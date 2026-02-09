/**
 * SERVICES LAYER (Use Cases / Business Logic Layer)
 * 
 * User Service - Chứa business logic cho User operations
 * Layer này orchestrate giữa controllers và repositories
 */

const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/userRepository');
const User = require('../models/User');

class UserService {
    /**
     * Tạo user mới
     * Business logic: Kiểm tra email trùng, validate data
     */
    async createUser(userData) {
        // Business rule: Email phải unique
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email đã tồn tại trong hệ thống');
        }

        // Tạo user với ID mới
        const userWithId = {
            id: uuidv4(),
            ...userData
        };

        const user = new User(userWithId);

        // Validate business rules
        const validation = user.validate();
        if (!validation.isValid) {
            const error = new Error('Dữ liệu không hợp lệ');
            error.validationErrors = validation.errors;
            throw error;
        }

        // Lưu vào database
        return await userRepository.create(user.toJSON());
    }

    /**
     * Lấy user theo ID
     */
    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('Không tìm thấy user');
        }
        return user;
    }

    /**
     * Lấy tất cả users
     * Business logic: Có thể thêm pagination, filtering, sorting
     */
    async getAllUsers() {
        return await userRepository.findAll();
    }

    /**
     * Cập nhật user
     * Business logic: Validate data, check email unique nếu thay đổi email
     */
    async updateUser(id, updateData) {
        // Kiểm tra user tồn tại
        const existingUser = await userRepository.findById(id);
        if (!existingUser) {
            throw new Error('Không tìm thấy user');
        }

        // Business rule: Nếu đổi email, phải check email mới chưa tồn tại
        if (updateData.email && updateData.email !== existingUser.email) {
            const userWithEmail = await userRepository.findByEmail(updateData.email);
            if (userWithEmail) {
                throw new Error('Email đã tồn tại trong hệ thống');
            }
        }

        // Update và validate
        const updatedUser = await userRepository.update(id, updateData);
        const validation = updatedUser.validate();

        if (!validation.isValid) {
            const error = new Error('Dữ liệu không hợp lệ');
            error.validationErrors = validation.errors;
            throw error;
        }

        return updatedUser;
    }

    /**
     * Xóa user
     * Business logic: Có thể thêm soft delete, check dependencies, etc.
     */
    async deleteUser(id) {
        // Kiểm tra user tồn tại
        const exists = await userRepository.exists(id);
        if (!exists) {
            throw new Error('Không tìm thấy user');
        }

        // Business logic: Có thể thêm check xem user có data liên quan không
        // Ví dụ: check orders, posts, comments, etc.

        const deleted = await userRepository.delete(id);
        return deleted;
    }

    /**
     * Tìm user theo email
     */
    async getUserByEmail(email) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Không tìm thấy user với email này');
        }
        return user;
    }

    /**
     * Business logic: Lấy danh sách users trưởng thành
     */
    async getAdultUsers() {
        const allUsers = await userRepository.findAll();
        return allUsers.filter(user => user.isAdult());
    }
}

module.exports = new UserService();
