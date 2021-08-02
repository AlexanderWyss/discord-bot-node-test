pipeline {
    agent any
    stages {
        stage('Clone repository') {
            checkout scm
        }
        stage('Dependencies') {
            sh 'npm ci --unsafe-perm'
        }
        stage('WebDriver') {
            sh 'npm run driver:linux'
        }
        stage('Build') {
            sh 'npm run build'
        }
        stage('Test') {
            sh 'npm run test:jenkins'
            junit checksName: 'Tests', testResults: 'junit.xml'
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
