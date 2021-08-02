pipeline {
    agent any
    stages {
        stage('Clone repository') {
            steps {
                checkout scm
            }
        }
        stage('Dependencies') {
            steps {
                sh 'npm ci --unsafe-perm'
            }
        }
        stage('WebDriver') {
            steps {
                sh 'npm run driver:linux'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test:jenkins'
                junit checksName: 'Tests', testResults: 'junit.xml'
            }
        }
    }
    post {
        failure {
            mail to: 'admin@wyss.tech',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
        unstable {
            mail to: 'admin@wyss.tech',
                 subject: "Unstable Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
    }
}
