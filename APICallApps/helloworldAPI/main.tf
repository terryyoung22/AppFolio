resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow",
      },
    ],
  })
}

resource "aws_iam_policy_attachment" "lambda_logs" {
  name       = "lambda_logs"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "static_lambda" {
  function_name    = "public_lambda"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"

  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")
}

resource "aws_apigatewayv2_api" "static_api" {
  name          = "static-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.static_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.static_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.static_api.id
  route_key = "GET /"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.static_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gateway_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.static_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.static_api.execution_arn}/*/*"
}

# S3 additions
# resource "aws_apigatewayv2_domain_name" "custom_domain" {
#   domain_name = "api.example.com"

#   domain_name_configuration {
#     certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abcde-1234-fghi-5678-jklmnop"
#     endpoint_type   = "REGIONAL"
#     security_policy = "TLS_1_2"
#   }
# }

# resource "aws_apigatewayv2_api_mapping" "api_mapping" {
#   api_id      = aws_apigatewayv2_api.static_api.id
#   domain_name = aws_apigatewayv2_domain_name.custom_domain.id
#   stage       = aws_apigatewayv2_stage.default_stage.id
# }

# resource "aws_route53_record" "api_record" {
#   zone_id = aws_route53_zone.example.zone_id
#   name    = "api.example.com"
#   type    = "A"

#   alias {
#     name                   = aws_apigatewayv2_domain_name.custom_domain.domain_name_configuration[0].target_domain_name
#     zone_id                = aws_apigatewayv2_domain_name.custom_domain.domain_name_configuration[0].hosted_zone_id
#     evaluate_target_health = false
#   }
# }
