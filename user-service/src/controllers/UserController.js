const UserService = require('../services/UserService');
const HttpUtils = require('../utils/httpUtils');

class UserController {
    constructor() {
        this.userService = new UserService();
        this.handleRequest = this.handleRequest.bind(this);
    }

    async handleRequest(req, res) {
        // Manejar CORS primero
        if (HttpUtils.handleCors(req, res)) return;

        const { method, url } = req;
        const urlParts = url.split('/').filter(part => part !== '');

        try {
            // Routing básico
            if (method === 'POST' && url === '/login') {
                await this.handleLogin(req, res);
            } else if (method === 'GET' && urlParts[0] === 'users' && urlParts.length === 1) {
                await this.handleGetAllUsers(req, res);
            } else if (method === 'GET' && urlParts[0] === 'users' && urlParts.length === 2) {
                await this.handleGetUserById(req, res, urlParts[1]);
            } else if (method === 'POST' && urlParts[0] === 'users' && urlParts.length === 1) {
                await this.handleCreateUser(req, res);
            } else if (method === 'PUT' && urlParts[0] === 'users' && urlParts.length === 2) {
                await this.handleUpdateUser(req, res, urlParts[1]);
            } else if (method === 'DELETE' && urlParts[0] === 'users' && urlParts.length === 2) {
                await this.handleDeactivateUser(req, res, urlParts[1]);
            } else {
                HttpUtils.sendError(res, 404, 'Endpoint not found');
            }
        } catch (error) {
            console.error('Controller error:', error);
            HttpUtils.sendError(res, 500, 'Internal server error');
        }
    }

    async handleLogin(req, res) {
        try {
            const body = await HttpUtils.parseRequestBody(req);
            const { username, password } = body;

            if (!username || !password) {
                return HttpUtils.sendError(res, 400, 'Username and password are required');
            }

            const user = await this.userService.authenticate(username, password);
            HttpUtils.sendResponse(res, 200, { 
                message: 'Login successful', 
                user: user.toSafeJSON() 
            });
        } catch (error) {
            HttpUtils.sendError(res, 401, error.message);
        }
    }

    async handleGetAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            const safeUsers = users.map(user => user.toSafeJSON());
            HttpUtils.sendResponse(res, 200, safeUsers);
        } catch (error) {
            HttpUtils.sendError(res, 500, error.message);
        }
    }

    async handleGetUserById(req, res, userId) {
        try {
            const id = parseInt(userId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid user ID');
            }

            const user = await this.userService.getUserById(id);
            HttpUtils.sendResponse(res, 200, user.toSafeJSON());
        } catch (error) {
            if (error.message === 'User not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleCreateUser(req, res) {
        try {
            const body = await HttpUtils.parseRequestBody(req);
            const user = await this.userService.createUser(body);
            HttpUtils.sendResponse(res, 201, user.toSafeJSON());
        } catch (error) {
            if (error.message === 'Username already exists' || error.message === 'Invalid role') {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleUpdateUser(req, res, userId) {
        try {
            const id = parseInt(userId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid user ID');
            }

            const body = await HttpUtils.parseRequestBody(req);
            const user = await this.userService.updateUser(id, body);
            HttpUtils.sendResponse(res, 200, user.toSafeJSON());
        } catch (error) {
            if (error.message === 'User not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleDeactivateUser(req, res, userId) {
        try {
            const id = parseInt(userId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid user ID');
            }

            await this.userService.deactivateUser(id);
            HttpUtils.sendResponse(res, 200, { message: 'User deactivated successfully' });
        } catch (error) {
            if (error.message === 'User not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }
}

module.exports = UserController;