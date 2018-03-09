pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Build US version') {
      steps {
        sh "npm install"
        sh "REACT_APP_US_FEATURE=true npm run build"
      }
    }

    stage('Test') {
      steps {
        sh "CI=true npm test"
      }
    }

    stage('Deploy to S3') {
      steps {
        sh "aws s3 sync build/ s3://menpedro-react-app"
      }
    }

    stage('End-to-end test') {
      steps {
        //sh "npm install cypress --save-dev"
        //sh "./node_modules/.bin/cypress run --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
        sh "/tmp/node_modules/.bin/cypress run --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
      }
    }
  }
}
