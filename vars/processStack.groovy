#!/usr/bin/env groovy

def call(String s3Prefix, String country, String environment) {
  script {
    STACK_EXISTS = sh (
      script: "aws cloudformation describe-stacks --stack-name my-react-app-${environment}-${country} --region us-east-1",
      returnStatus: true
    ) == 0
    echo "Stack exists?: ${STACK_EXISTS}"
    if (STACK_EXISTS) {
      echo "Updating stack"
      STACK_UPDATE_REQUIRED = sh (
        script: "aws cloudformation update-stack --stack-name my-react-app-${environment}-${country} --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${s3Prefix} ParameterKey=Country,ParameterValue=${country} ParameterKey=Environment,ParameterValue=${environment} --region us-east-1",
        returnStatus: true
      ) == 0
      echo "Stack update required?: ${STACK_UPDATE_REQUIRED}"
      if (STACK_UPDATE_REQUIRED) {
        sh ("aws cloudformation wait stack-update-complete --stack-name my-react-app-${environment}-${country} --region us-east-1")
      }
    } else {
      echo "Creating stack"
      sh ("aws cloudformation create-stack --stack-name my-react-app-${environment}-${country} --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${s3Prefix} ParameterKey=Country,ParameterValue=${country} ParameterKey=Environment,ParameterValue=${environment} --region us-east-1")
      sh ("aws cloudformation wait stack-create-complete --stack-name my-react-app-${environment}-${country} --region us-east-1")
    }
  }
}
