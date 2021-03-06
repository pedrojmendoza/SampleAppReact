#!/usr/bin/env groovy
pipeline {
  agent any

  environment {
    S3_PREFIX = 'menpedro-react-app'
  }

  triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Build (core), linting and unit test') {
      agent {
        docker {
          image 'node:6'
        }
      }
      environment {
        HOME="."
      }
      steps {
        //sh "scripts/configNpm.sh ${env.HTTP_PROXY} ${env.HTTPS_PROXY}"
        sh "npm config set proxy ${env.HTTP_PROXY}"
        sh "npm config set https-proxy ${env.HTTPS_PROXY}"
        sh "npm install"
        sh "npm run test:lint:js"
        sh "CI=true npm test"
      }
    }

    stage('Security test') {
      steps {
        sh "docker run -v ${env.WORKSPACE}:/target -e HTTP_PROXY -e HTTPS_PROXY --rm stono/hawkeye"
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
            //sh "scripts/configNpm.sh ${env.HTTP_PROXY} ${env.HTTPS_PROXY}"
            sh "npm config set proxy ${env.HTTP_PROXY}"
            sh "npm config set https-proxy ${env.HTTPS_PROXY}"
            sh "npm install"
            sh "REACT_APP_US_FEATURE=true npm run build"
            stash includes: 'build/**', name: 'build_US'
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
            //sh "scripts/configNpm.sh ${env.HTTP_PROXY} ${env.HTTPS_PROXY}"
            sh "npm config set proxy ${env.HTTP_PROXY}"
            sh "npm config set https-proxy ${env.HTTPS_PROXY}"
            sh "npm install"
            sh "REACT_APP_ES_FEATURE=true npm run build"
            stash includes: 'build/**', name: 'build_ES'
          }
        }
      }
    }

    stage ('Deploy CFN to PRE-PROD') {
      parallel {
        stage('US') {
          steps {
            echo "deploying to US ..."
            //sh "scripts/deployStack.sh my-react-app-preprod-us us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=preprod\""
          }
        }
        stage('ES') {
          steps {
            echo "deploying to ES ..."
            //sh "scripts/deployStack.sh my-react-app-preprod-es us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=preprod\""
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
              //sh "aws s3 sync build/ s3://${env.S3_PREFIX}-preprod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              //sh "aws s3 sync build/ s3://${env.S3_PREFIX}-preprod-es"
            }
          }
        }
      }
    }

    stage ('UI Test') {
      steps {
        sh "docker run -tid -v ${env.WORKSPACE}:/my-app -e HTTP_PROXY -e HTTPS_PROXY --name cypress --rm cypress/base:6"
        sh "docker exec cypress sh -c 'cd /my-app && npm config set proxy ${env.HTTP_PROXY} && npm config set https-proxy ${env.HTTPS_PROXY} && npm install cypress --save-dev && ./node_modules/.bin/cypress run --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c'"
      }
      post {
        always {
          sh 'docker exec cypress sh -c "cd /my-app && rm -rf node_modules/ && rm -rf cypress/screenshots/ && rm -rf cypress/videos/"'
          sh 'docker stop cypress'
        }
      }
    }

    stage ('Deploy CFN to PROD') {
      parallel {
        stage('US') {
          steps {
            echo "deploying to US ..."
            //sh "scripts/deployStack.sh my-react-app-prod-us us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=prod\""
          }
        }
        stage('ES') {
          steps {
            echo "deploying to ES ..."
            //sh "scripts/deployStack.sh my-react-app-prod-es us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=prod\""
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
              //sh "aws s3 sync build/ s3://${env.S3_PREFIX}-prod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              //sh "aws s3 sync build/ s3://${env.S3_PREFIX}-prod-es"
            }
          }
        }
      }
    }
  }
}
