pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Build (core) and unit test') {
      agent {
          docker {
              image 'node:6-alpine'
          }
      }
      steps {
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
                  image 'node:6-alpine'
              }
          }
          steps {
            ws('US') {
              checkout scm
              sh "npm install"
              sh "REACT_APP_US_FEATURE=true npm run build"
            }
          }
        }
        stage('Build ES') {
          agent {
              docker {
                  image 'node:6-alpine'
              }
          }
          steps {
            ws('ES') {
              checkout scm
              sh "npm install"
              sh "REACT_APP_ES_FEATURE=true npm run build"
            }
          }
        }
      }
    }

    stage ('Deploy to PRE-PROD') {
      parallel {
        stage('US') {
          steps {
            ws('US') {
              sh "aws s3 sync build/ s3://menpedro-react-app-preprod-us"
            }
          }
        }
        stage('ES') {
          steps {
            ws('ES') {
              sh "aws s3 sync build/ s3://menpedro-react-app-preprod-es"
            }
          }
        }
      }
    }

    stage ('UI Test') {
      parallel {
        stage('US') {
          steps {
            ws('US') {
              sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec_us.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
            }
          }
        }
        stage('ES') {
          steps {
            ws('ES') {
              sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec_es.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
            }
          }
        }
      }
    }

    stage ('Deploy to PROD') {
      parallel {
        stage('US') {
          steps {
            ws('US') {
              sh "aws s3 sync build/ s3://menpedro-react-app-us"
            }
          }
        }
        stage('ES') {
          steps {
            ws('ES') {
              sh "aws s3 sync build/ s3://menpedro-react-app-es"
            }
          }
        }
      }
    }
  }
}
