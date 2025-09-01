#!/bin/bash

# Configure these variables
AWS_REGION="us-west-2"  # Choose a region close to your users
ECR_REPOSITORY_NAME="personal-portfolio"
APP_RUNNER_SERVICE_NAME="personal-portfolio"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Building Docker Image ===${NC}"
docker build -t $ECR_REPOSITORY_NAME .

echo -e "${GREEN}=== Authenticating with AWS ECR ===${NC}"
echo -e "${YELLOW}Ensure you've set up AWS credentials with 'aws configure' before running this script${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

echo -e "${GREEN}=== Creating ECR Repository (if it doesn't exist) ===${NC}"
aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION || aws ecr create-repository --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION

# Get the ECR repository URI
ECR_REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION --query "repositories[0].repositoryUri" --output text)

echo -e "${GREEN}=== Tagging and Pushing Docker Image to ECR ===${NC}"
docker tag $ECR_REPOSITORY_NAME:latest $ECR_REPOSITORY_URI:latest
docker push $ECR_REPOSITORY_URI:latest

echo -e "${GREEN}=== Creating IAM Access Role for App Runner ===${NC}"
ROLE_NAME="AppRunnerECRAccessRole"

# Check if role exists
ROLE_EXISTS=$(aws iam list-roles --query "Roles[?RoleName=='$ROLE_NAME'].RoleName" --output text)

if [ -z "$ROLE_EXISTS" ]; then
  # Create trust policy document for App Runner
  cat > apprunner-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "build.apprunner.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  # Create the role
  aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://apprunner-trust-policy.json

  # Attach the AmazonECR-FullAccess policy to the role
  aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AmazonECR-FullAccess
  
  # Wait for role to propagate
  echo "Waiting for IAM role to propagate..."
  sleep 10
fi

# Get the role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query "Role.Arn" --output text)

echo -e "${GREEN}=== Deploying to App Runner ===${NC}"
# Check if service exists already
SERVICE_EXISTS=$(aws apprunner list-services --region $AWS_REGION --query "serviceList[?serviceName=='$APP_RUNNER_SERVICE_NAME']" --output text)

if [ -z "$SERVICE_EXISTS" ]; then
  echo "Creating new App Runner service..."
  
  # Create source config JSON file
  cat > apprunner-config.json << EOF
{
  "AuthenticationConfiguration": {
    "AccessRoleArn": "$ROLE_ARN"
  },
  "ImageRepository": {
    "ImageIdentifier": "$ECR_REPOSITORY_URI:latest",
    "ImageConfiguration": {
      "Port": "5001"
    },
    "ImageRepositoryType": "ECR"
  }
}
EOF
  
  # Create service
  RESULT=$(aws apprunner create-service \
    --service-name $APP_RUNNER_SERVICE_NAME \
    --source-configuration file://apprunner-config.json \
    --region $AWS_REGION)
  
  # Get service URL
  SERVICE_URL=$(echo $RESULT | grep -o "https://[a-zA-Z0-9.-]*")
  echo "App Runner service created with URL: $SERVICE_URL"
else
  echo "App Runner service already exists. Updating..."
  
  # Create source config JSON file
  cat > apprunner-config.json << EOF
{
  "AuthenticationConfiguration": {
    "AccessRoleArn": "$ROLE_ARN"
  },
  "ImageRepository": {
    "ImageIdentifier": "$ECR_REPOSITORY_URI:latest",
    "ImageConfiguration": {
      "Port": "5001"
    },
    "ImageRepositoryType": "ECR"
  }
}
EOF
  
  SERVICE_ARN=$(aws apprunner list-services --region $AWS_REGION --query "serviceList[?serviceName=='$APP_RUNNER_SERVICE_NAME'].ServiceArn" --output text)
  
  aws apprunner update-service \
    --service-arn "$SERVICE_ARN" \
    --source-configuration file://apprunner-config.json \
    --region $AWS_REGION
  
  # Get service URL
  SERVICE_URL=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION --query "Service.ServiceUrl" --output text)
  echo "App Runner service updated with URL: https://$SERVICE_URL"
fi

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Your application will be available at: https://$SERVICE_URL"
echo -e "You can check the status using: aws apprunner list-services --region $AWS_REGION"