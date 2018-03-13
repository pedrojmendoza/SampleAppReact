pipeline {
  agent any

  parameters {
    string (
      defaultValue: '',
      description: 'Proxy URL',
      name : 'PROXY'
    )
    string (
      defaultValue: 'menpedro-react-app',
      description: 'S3 prefix',
      name : 'S3_PREFIX'
    )
  }

  triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Build (core) and unit test') {
      agent {
        docker {
          image 'node:6'
        }
      }
      environment {
        HOME="."
      }
      steps {
        script {
          if ("${params.PROXY}" != '') {
            echo "Will use ${params.PROXY} for proxying"
            sh "npm config set proxy ${params.PROXY}"
            sh "npm config set https-proxy ${params.PROXY}"
          }
        }
        sh "npm install"
        sh "npm run build"
        sh "CI=true npm test"
      }
    }

    stage ('Build') {
      parallel {
        stage('US') {
          agent {
            docker {
              image 'node:6'
            }
          }
          environment {
            HOME="."
          }
          steps {
            script {
              if ("${params.PROXY}" != '') {
                echo "Will use ${params.PROXY} for proxying"
                sh "npm config set proxy ${params.PROXY}"
                sh "npm config set https-proxy ${params.PROXY}"
              }
            }
            sh "npm install"
            sh "REACT_APP_US_FEATURE=true npm run build"
            stash includes: 'build/*', name: 'build_US'
          }
        }
        stage('Build ES') {
          agent {
            docker {
              image 'node:6'
            }
          }
          environment {
            HOME="."
          }
          steps {
            script {
              if ("${params.PROXY}" != '') {
                echo "Will use ${params.PROXY} for proxying"
                sh "npm config set proxy ${params.PROXY}"
                sh "npm config set https-proxy ${params.PROXY}"
              }
            }
            sh "npm install"
            sh "REACT_APP_ES_FEATURE=true npm run build"
            stash includes: 'build/*', name: 'build_ES'
          }
        }
      }
    }

    stage ('Deploy CFN to PRE-PROD') {
      parallel {
        stage('US') {
          steps {
            script {
              STACK_EXISTS=1
              sh ("aws cloudformation describe-stacks --stack-name my-react-app-preprod-us || STACK_EXISTS=0")
              echo "Stack exists?: ${STACK_EXISTS}"
              if ("${STACK_EXISTS}" == 1) {
                echo "Updating stack"
                sh ("aws cloudformation update-stack --stack-name my-react-app-preprod-us --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=preprod")
              } else {
                echo "Creating stack"
                sh ("aws cloudformation create-stack --stack-name my-react-app-preprod-us --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=preprod")
              }
            }
          }
        }
        stage('ES') {
          steps {
            script {
              STACK_EXISTS=1
              sh ("aws cloudformation describe-stacks --stack-name my-react-app-preprod-es || STACK_EXISTS=0")
              echo "Stack exists?: ${STACK_EXISTS}"
              if ("${STACK_EXISTS}" == 1) {
                echo "Updating stack"
                sh ("aws cloudformation update-stack --stack-name my-react-app-preprod-es --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=preprod")
              } else {
                echo "Creating stack"
                sh ("aws cloudformation create-stack --stack-name my-react-app-preprod-es --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=preprod")
              }
            }
          }
        }
      }
    }

    stage ('Deploy to PRE-PROD') {
      parallel {
        stage('US') {
          steps {
            dir("US") {
              unstash 'build_US'
              sh "aws s3 sync build/ s3://${params.S3_PREFIX}-preprod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              sh "aws s3 sync build/ s3://${params.S3_PREFIX}-preprod-es"
            }
          }
        }
      }
    }

    stage ('UI Test') {
      parallel {
        stage('US') {
          agent {
            docker {
              image 'node:6'
            }
          }
          environment {
            HOME="."
          }
          steps {
            script {
              if ("${params.PROXY}" != '') {
                echo "Will use ${params.PROXY} for proxying"
                sh "npm config set proxy ${params.PROXY}"
                sh "npm config set https-proxy ${params.PROXY}"
              }
            }
            sh "npm install cypress --save-dev"
            sh "./node_modules/.bin/cypress run --spec cypress/integration/simple_spec_us.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
          }
        }
        stage('ES') {
          agent {
            docker {
              image 'node:6'
            }
          }
          environment {
            HOME="."
          }
          steps {
            script {
              if ("${params.PROXY}" != '') {
                echo "Will use ${params.PROXY} for proxying"
                sh "npm config set proxy ${params.PROXY}"
                sh "npm config set https-proxy ${params.PROXY}"
              }
            }
            sh "npm install cypress --save-dev"
            sh "./node_modules/.bin/cypress run --spec cypress/integration/simple_spec_es.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
          }
        }
      }
    }

    stage ('Deploy CFN to PROD') {
      parallel {
        stage('US') {
          steps {
            script {
              STACK_EXISTS=1
              sh ("aws cloudformation describe-stacks --stack-name my-react-app-prod-us || STACK_EXISTS=0")
              echo "Stack exists?: ${STACK_EXISTS}"
              if ("${STACK_EXISTS}" == 1) {
                echo "Updating stack"
                sh ("aws cloudformation update-stack --stack-name my-react-app-prod-us --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=prod")
              } else {
                echo "Creating stack"
                sh ("aws cloudformation create-stack --stack-name my-react-app-prod-us --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=prod")
              }
            }
          }
        }
        stage('ES') {
          steps {
            script {
              STACK_EXISTS=1
              sh ("aws cloudformation describe-stacks --stack-name my-react-app-prod-es || STACK_EXISTS=0")
              echo "Stack exists?: ${STACK_EXISTS}"
              if ("${STACK_EXISTS}" == 1) {
                echo "Updating stack"
                sh ("aws cloudformation update-stack --stack-name my-react-app-prod-es --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=prod")
              } else {
                echo "Creating stack"
                sh ("aws cloudformation create-stack --stack-name my-react-app-prod-es --template-body file://infra/infrastructure.yaml --parameters ParameterKey=Prefix,ParameterValue=${params.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=prod")
              }
            }
          }
        }
      }
    }

    stage ('Deploy to PROD') {
      parallel {
        stage('US') {
          steps {
            dir("US") {
              unstash 'build_US'
              sh "aws s3 sync build/ s3://${params.S3_PREFIX}-prod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              sh "aws s3 sync build/ s3://${params.S3_PREFIX}-prod-es"
            }
          }
        }
      }
    }
  }
}
