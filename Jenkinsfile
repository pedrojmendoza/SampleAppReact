pipeline {
  agent any

  parameters {
    string (
      defaultValue: '',
      description: 'Proxy URL',
      name : 'PROXY')
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
        echo "Will use ${params.PROXY} for proxying"
        script {
          if ("${params.PROXY}" != '') {
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
            sh "npm install"
            sh "REACT_APP_ES_FEATURE=true npm run build"
            stash includes: 'build/*', name: 'build_ES'
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
              sh "aws s3 sync build/ s3://menpedro-react-app-preprod-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              sh "aws s3 sync build/ s3://menpedro-react-app-preprod-es"
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
            sh "npm install cypress --save-dev"
            sh "./node_modules/.bin/cypress run --spec cypress/integration/simple_spec_es.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
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
              sh "aws s3 sync build/ s3://menpedro-react-app-us"
            }
          }
        }
        stage('ES') {
          steps {
            dir("ES") {
              unstash 'build_ES'
              sh "aws s3 sync build/ s3://menpedro-react-app-es"
            }
          }
        }
      }
    }
  }
}
