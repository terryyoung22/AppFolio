output "api_gateway_url" {
  value = aws_apigatewayv2_api.static_api.api_endpoint
}