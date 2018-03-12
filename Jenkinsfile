pipeline {
  agent any

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
        sh "rm -rf .npm"
        sh "rm -rf .config"
        sh "rm -rf node_modules"
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
            sh "rm -rf build_US"
            sh "npm install"
            sh "REACT_APP_US_FEATURE=true npm run build"
            sh "mv build build_US"
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
            sh "rm -rf build_ES"
            sh "npm install"
            sh "REACT_APP_ES_FEATURE=true npm run build"
            sh "mv build build_ES"
          }
        }
      }
    }

    stage ('Deploy to PRE-PROD') {
      parallel {
        stage('US') {
          steps {
            sh "aws s3 sync build_US/ s3://menpedro-react-app-preprod-us"
          }
        }
        stage('ES') {
          steps {
            sh "aws s3 sync build_ES/ s3://menpedro-react-app-preprod-es"
          }
        }
      }
    }

    stage ('UI Test') {
      parallel {
        stage('US') {
          steps {
            sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec_us.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
          }
        }
        stage('ES') {
          steps {
            sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec_es.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
          }
        }
      }
    }

    stage ('Deploy to PROD') {
      parallel {
        stage('US') {
          steps {
            sh "aws s3 sync build_US/ s3://menpedro-react-app-us"
          }
        }
        stage('ES') {
          steps {
            sh "aws s3 sync build_ES/ s3://menpedro-react-app-es"
          }
        }
      }
    }
  }
}
