#!/bin/bash

# $1 -> stackName -> my-stack
# $2 -> awsRegion -> us-east-1
# $3 -> stackParams -> "ParameterKey=Prefix,ParameterValue=menpedro-react-app ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=preprod"

aws cloudformation describe-stacks --stack-name $1 --region $2
STACK_EXISTS_RESULT_CODE=$?
if [ $STACK_EXISTS_RESULT_CODE == 0 ]
then
  echo "Updating stack"
  STACK_UPDATE_OUTPUT=$(aws cloudformation update-stack --stack-name $1 --template-body file://infra/infrastructure.yaml --parameters $3 --region $2 2>&1)
  STACK_UPDATE_RESULT_CODE="$?"
  set -e
  echo "Stack update result code?: $STACK_UPDATE_RESULT_CODE"
  if [ $STACK_UPDATE_RESULT_CODE == 0 ]
  then
    aws cloudformation wait stack-update-complete --stack-name $1 --region $2
  else
    STACK_UPDATE_REQUIRED=$(printf '%s' "$STACK_UPDATE_OUTPUT" | grep -c "No updates are to be performed")
    echo "Stack update required?: $STACK_UPDATE_REQUIRED"
    if [ $STACK_UPDATE_REQUIRED == 0 ]
    then
      exit 1
    fi
  fi
else
  echo "Creating stack"
  set -e
  aws cloudformation create-stack --stack-name $1 --template-body file://infra/infrastructure.yaml --parameters $3 --region $2
  aws cloudformation wait stack-create-complete --stack-name $1 --region $2
fi
