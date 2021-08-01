node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Dependencies') {
        sh 'npm ci --unsafe-perm'
    }
    stage('Build') {
        sh 'npm run build'
    }
    stage('Test') {
        try {
            sh 'npm run test:jenkins'
        } finally {
            junit checksName: 'Tests', testResults: 'junit.xml'
        }
    }
}
