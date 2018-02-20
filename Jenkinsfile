node {
  stage('Checkout') {
    checkout scm
  }

  stage('Build') {
    sh "npm install"
    sh "npm run build"
  }

  stage('Test') {
    sh "CI=true npm test"
  }

  stage('Deploy to S3') {
    sh "aws s3 sync build/ s3://menpedro-react-app --profile menpedro"
  }

  stage('End-to-end test') {
    sh "npm install cypress --save-dev"
    sh "./node_modules/.bin/cypress run --record --key 0262b5bb-dc12-4513-84eb-241c6b18f42c"
  }
}
