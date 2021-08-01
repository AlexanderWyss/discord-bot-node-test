node {
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
