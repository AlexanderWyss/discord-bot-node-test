pipeline {
    agent any
    stages {
        stage('Dependencies') {
            steps {
                sh 'npm ci --unsafe-perm'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Restart test env') {
            steps {
                sh 'docker restart discord-bot-node'
            }
        }
        stage('WebDriver') {
            steps {
                sh 'npm run driver:linux'
            }
        }
        stage('Test') {
            steps {
                withCredentials([string(credentialsId: 'Discord_Token_Test', variable: 'token')]) {
                    sh 'export DISCORD_TOKEN=$token && npm run test:jenkins'
                }
                junit checksName: 'Tests', testResults: 'junit.xml'
            }
        }
    }
    post {
        failure {
            mail to: 'alexsilvan.wyss@gmail.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
        unstable {
            mail to: 'alexsilvan.wyss@gmail.com',
                 subject: "Unstable Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
    }
}
