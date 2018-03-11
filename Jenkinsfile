pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Build core') {
      steps {
        sh "npm install"
        sh "npm run build"
      }
    }

    stage('Unit test') {
      steps {
        sh "CI=true npm test"
      }
    }

    stage('Deploy to S3 preprod (country agnostic)') {
      steps {
        sh "aws s3 sync build/ s3://menpedro-react-app-preprod"
      }
    }

    stage('UI test (contry agnostic)') {
      steps {
        //sh "npm install cypress --save-dev"
        //sh "./node_modules/.bin/cypress run --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
        sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
      }
    }

    stage ('Country deployments') {
      parallel {
        stage('Build US') {
          steps {
            ws('US') {
              sh "npm install"
              sh "REACT_APP_US_FEATURE=true npm run build"
              sh "aws s3 sync build/ s3://menpedro-react-app-preprod-us"
              sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec_us.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
              sh "aws s3 sync build/ s3://menpedro-react-app-us"
            }
          }
        }
        stage('Build ES') {
          steps {
            ws('ES') {
              sh "npm install"
              sh "REACT_APP_ES_FEATURE=true npm run build"
              sh "aws s3 sync build/ s3://menpedro-react-app-preprod-es"
              sh "/tmp/node_modules/.bin/cypress run --spec cypress/integration/simple_spec_es.js --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
              sh "aws s3 sync build/ s3://menpedro-react-app-es"
            }
          }
        }
      }
    }

  }
}
