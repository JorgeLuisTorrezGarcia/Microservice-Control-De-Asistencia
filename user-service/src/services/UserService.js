const UserRepository = require('../repositories/UserRepository');
const PasswordUtils = require('../utils/passwordUtils');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers() {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
            // Validaciones básicas
            if (!userData.username || !userData.password) {
                throw new Error('Username and password are required');
            }

            if (!['admin', 'professor', 'student'].includes(userData.role)) {
                throw new Error('Invalid role');
            }

            // Verificar si el usuario ya existe
            const existingUser = await this.userRepository.findByUsername(userData.username);
            if (existingUser) {
                throw new Error('Username already exists');
            }

            // Hashear la contraseña
            const passwordHash = await PasswordUtils.hashPassword(userData.password);

            const userToCreate = {
                username: userData.username,
                password_hash: passwordHash,
                email: userData.email || null,
                full_name: userData.full_name || null,
                role: userData.role
            };

            const userId = await this.userRepository.insert(userToCreate);
            return await this.userRepository.findById(userId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            const updateData = { ...userData };
            
            // Si se está actualizando la contraseña, hashearla
            if (updateData.password) {
                updateData.password_hash = await PasswordUtils.hashPassword(updateData.password);
                delete updateData.password;
            }

            const success = await this.userRepository.update(id, updateData);
            if (!success) {
                throw new Error('User not found or no changes made');
            }

            return await this.userRepository.findById(id);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async authenticate(username, password) {
        try {
            const user = await this.userRepository.findByUsername(username);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            return user;
        } catch (error) {
            throw new Error(`Authentication error: ${error.message}`);
        }
    }

    async deactivateUser(id) {
        try {
            const success = await this.userRepository.deactivate(id);
            if (!success) {
                throw new Error('User not found');
            }
            return true;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }
}

module.exports = UserService;