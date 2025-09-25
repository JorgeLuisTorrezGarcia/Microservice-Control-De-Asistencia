const HttpUtils = require('../utils/httpUtils');

class CatalogServiceClient {
    constructor() {
        this.baseUrl = 'http://localhost:3002';
    }

    async getSubjectById(subjectId) {
        try {
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: `/subjects/${subjectId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await HttpUtils.makeHttpRequest(options);
            return response.data;
        } catch (error) {
            console.error('Error calling Catalog Service:', error.message);
            throw new Error(`Unable to verify subject: ${error.message}`);
        }
    }

    async getStudentsBySubjectId(subjectId) {
        try {
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: `/subjects/${subjectId}/students`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await HttpUtils.makeHttpRequest(options);
            return response.data;
        } catch (error) {
            throw new Error(`Unable to fetch students for subject: ${error.message}`);
        }
    }

    async isProfessorAssignedToSubject(professorId, subjectId) {
        try {
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: `/teachers/${professorId}/subjects`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await HttpUtils.makeHttpRequest(options);
            const teacherSubjects = response.data;
            
            return teacherSubjects.some(subject => subject.subject_id === parseInt(subjectId));
        } catch (error) {
            throw new Error(`Unable to verify professor assignment: ${error.message}`);
        }
    }

    async isStudentEnrolledInSubject(studentId, subjectId) {
        try {
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: `/students/${studentId}/subjects`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await HttpUtils.makeHttpRequest(options);
            const studentSubjects = response.data;
            
            return studentSubjects.some(subject => subject.subject_id === parseInt(subjectId));
        } catch (error) {
            throw new Error(`Unable to verify student enrollment: ${error.message}`);
        }
    }
}

module.exports = CatalogServiceClient;