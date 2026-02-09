/**
 * REPOSITORIES LAYER (Data Access Layer)
 * 
 * User Repository - Xử lý tất cả data access operations
 * Tách biệt business logic khỏi data access logic
 */

const database = require('../config/database');
const User = require('../models/User');

class UserRepository {
    /**
     * Tạo mới user trong database
     */
    async create(userData) {
        const user = new User(userData);
        database.saveUser(user.id, user.toJSON());
        return user;
    }

    /**
     * Tìm user theo ID
     */
    async findById(id) {
        const userData = database.getUserById(id);
        if (!userData) {
            return null;
        }
        return new User(userData);
    }

    /**
     * Tìm user theo email
     */
    async findByEmail(email) {
        const userData = database.findUserByEmail(email);
        if (!userData) {
            return null;
        }
        return new User(userData);
    }

    /**
     * Lấy tất cả users
     */
    async findAll() {
        const usersData = database.getAllUsers();
        return usersData.map(userData => new User(userData));
    }

    /**
     * Cập nhật user
     */
    async update(id, updateData) {
        const userData = database.getUserById(id);
        if (!userData) {
            return null;
        }

        const user = new User(userData);
        user.update(updateData);

        database.saveUser(id, user.toJSON());
        return user;
    }

    /**
     * Xóa user
     */
    async delete(id) {
        return database.deleteUser(id);
    }

    /**
     * Kiểm tra email đã tồn tại chưa
     */
    async existsByEmail(email) {
        const user = await this.findByEmail(email);
        return user !== null;
    }

    /**
     * Kiểm tra user ID có tồn tại không
     */
    async exists(id) {
        return database.hasUser(id);
    }
}

module.exports = new UserRepository();
