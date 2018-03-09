pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  parameters {
    string(name: 'COUNTRY', defaultValue: 'US', choices: ['US\nES'], description: 'Which country should be baked?')
  }

  stages {
    stage('Build') {
      steps {
        sh "npm install"
        sh "REACT_APP_${params.COUNTRY}_FEATURE=true npm run build"
      }
    }

    stage('Unit test') {
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
