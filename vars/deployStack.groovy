#!/usr/bin/env groovy

def call(String stackName, String awsRegion, String stackParams) {
  script {
    STACK_EXISTS = sh (
      script: "aws cloudformation describe-stacks --stack-name ${stackName} --region ${awsRegion}",
      returnStatus: true
    ) == 0
    echo "Stack exists?: ${STACK_EXISTS}"
    if (STACK_EXISTS) {
      echo "Updating stack"
      STACK_UPDATE_REQUIRED = sh (
        script: "aws cloudformation update-stack --stack-name ${stackName} --template-body file://infra/infrastructure.yaml --parameters ${stackParams} --region ${awsRegion}",
        returnStatus: true
      ) == 0
      echo "Stack update required?: ${STACK_UPDATE_REQUIRED}"
      if (STACK_UPDATE_REQUIRED) {
        sh ("aws cloudformation wait stack-update-complete --stack-name ${stackName} --region ${awsRegion}")
      }
    } else {
      echo "Creating stack"
      sh ("aws cloudformation create-stack --stack-name ${stackName} --template-body file://infra/infrastructure.yaml --parameters ${stackParams} --region ${awsRegion}")
      sh ("aws cloudformation wait stack-create-complete --stack-name ${stackName} --region ${awsRegion}")
    }
  }
}
