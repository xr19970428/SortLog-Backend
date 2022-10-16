pipeline {
    agent any
    
    environment {
      registryCredential = 'ecr:ap-southeast-2:awscreds' 
      appRegistry = "200167892154.dkr.ecr.ap-southeast-2.amazonaws.com/sortlogbackend"
      vprofileRegistry = "https://200167892154.dkr.ecr.ap-southeast-2.amazonaws.com"
      cluster = "sortlog"
      service = "custom-service"
    }

    stages{
      stage('Build App Image') {
        steps {   
          script {
            dockerImage = docker.build( appRegistry + ":$BUILD_NUMBER", ".")
          }
        } 
      }

      stage('Upload App Image to ECR') {
        steps{
          script {
            docker.withRegistry( vprofileRegistry, registryCredential ) {
                dockerImage.push("$BUILD_NUMBER")
                dockerImage.push('latest')
            }
          }
        }
      }

      stage('Deploy to ECS') {
        steps {
          withAWS(credentials: 'awscreds', region: 'us-east-2') {
                sh 'aws ecs update-service --cluster ${cluster} --service ${service} --force-new-deployment'
          }
        }
      }
  }
}
