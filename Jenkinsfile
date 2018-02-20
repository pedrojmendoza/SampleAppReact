node {
  stage('Checkout') {
    checkout scm
  }

  stage('Build') {
    sh "npm run build"
  }

  stage('Test') {
    sh "CI=true npm test"
  }

  stage('Deploy to S3') {
    sh "aws s3 sync build/ s3://menpedro-react-app --profile menpedro"
  }
}
