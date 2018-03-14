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
    stage('DEBUG') {
      steps {
        sh "script/deployStack my-react-app-preprod-us us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=preprod\""
      }
    }
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
          if (env.HTTP_PROXY != null) {
            echo "Will use ${env.HTTP_PROXY} for proxying"
            sh "npm config set proxy ${env.HTTP_PROXY}"
            sh "npm config set https-proxy ${env.HTTPS_PROXY}"
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
              if (env.HTTP_PROXY != null) {
                echo "Will use ${env.HTTP_PROXY} for proxying"
                sh "npm config set proxy ${env.HTTP_PROXY}"
                sh "npm config set https-proxy ${env.HTTPS_PROXY}"
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
              if (env.HTTP_PROXY != null) {
                echo "Will use ${env.HTTP_PROXY} for proxying"
                sh "npm config set proxy ${env.HTTP_PROXY}"
                sh "npm config set https-proxy ${env.HTTPS_PROXY}"
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
            sh "script/deployStack my-react-app-preprod-us us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=preprod\""
          }
        }
        stage('ES') {
          steps {
            sh "script/deployStack my-react-app-preprod-es us-east-1 \"ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=preprod\""
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
              sh "aws s3 sync build/ s3://${env.S3_PREFIX}-preprod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              sh "aws s3 sync build/ s3://${env.S3_PREFIX}-preprod-es"
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
              if (env.HTTP_PROXY != null) {
                echo "Will use ${env.HTTP_PROXY} for proxying"
                sh "npm config set proxy ${env.HTTP_PROXY}"
                sh "npm config set https-proxy ${env.HTTPS_PROXY}"
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
              if (env.HTTP_PROXY != null) {
                echo "Will use ${env.HTTP_PROXY} for proxying"
                sh "npm config set proxy ${env.HTTP_PROXY}"
                sh "npm config set https-proxy ${env.HTTPS_PROXY}"
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
            deployStack "my-react-app-prod-us", "us-east-1", "ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=us ParameterKey=Environment,ParameterValue=prod"
          }
        }
        stage('ES') {
          steps {
            deployStack "my-react-app-prod-es", "us-east-1", "ParameterKey=Prefix,ParameterValue=${env.S3_PREFIX} ParameterKey=Country,ParameterValue=es ParameterKey=Environment,ParameterValue=prod"
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
              sh "aws s3 sync build/ s3://${env.S3_PREFIX}-prod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              sh "aws s3 sync build/ s3://${env.S3_PREFIX}-prod-es"
            }
          }
        }
      }
    }
  }
}
