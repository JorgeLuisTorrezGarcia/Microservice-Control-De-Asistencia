const HttpUtils = require('../utils/httpUtils');

class UserServiceClient {
    constructor() {
        this.baseUrl = 'http://localhost:3001';
    }

    async getUserById(userId) {
        try {
            const options = {
                hostname: 'localhost',
                port: 3001,
                path: `/users/${userId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await HttpUtils.makeHttpRequest(options);
            return response.data;
        } catch (error) {
            console.error('Error calling User Service:', error.message);
            throw new Error(`Unable to verify user: ${error.message}`);
        }
    }

    async validateProfessor(professorId) {
        try {
            const user = await this.getUserById(professorId);
            if (user.role !== 'professor') {
                throw new Error('User is not a professor');
            }
            return user;
        } catch (error) {
            throw new Error(`Professor validation failed: ${error.message}`);
        }
    }

    async validateStudent(studentId) {
        try {
            const user = await this.getUserById(studentId);
            if (user.role !== 'student') {
                throw new Error('User is not a student');
            }
            return user;
        } catch (error) {
            throw new Error(`Student validation failed: ${error.message}`);
        }
    }

    async getUsersByIds(userIds) {
        try {
            // Para múltiples usuarios, haríamos llamadas individuales
            // En un sistema más avanzado, tendríamos un endpoint batch
            const users = [];
            for (const userId of userIds) {
                try {
                    const user = await this.getUserById(userId);
                    users.push(user);
                } catch (error) {
                    console.warn(`User ${userId} not found:`, error.message);
                }
            }
            return users;
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }
}

module.exports = UserServiceClient;