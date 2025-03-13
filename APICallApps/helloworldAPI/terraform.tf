terraform {
  backend "s3" {
        bucket = "terraformcontainerbucket"
        key    = "apigateway/state2.tfstate"
        region = "us-east-1"
    }
  }

provider "aws" {
  region = var.aws_region
}

