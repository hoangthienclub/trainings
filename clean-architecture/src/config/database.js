/**
 * CONFIG LAYER
 * 
 * Database configuration
 * Trong ví dụ này dùng in-memory storage, nhưng có thể dễ dàng thay thế bằng MongoDB, PostgreSQL, etc.
 */

class Database {
    constructor() {
        // In-memory storage
        this.users = new Map();
    }

    /**
     * Get all users
     */
    getAllUsers() {
        return Array.from(this.users.values());
    }

    /**
     * Get user by ID
     */
    getUserById(id) {
        return this.users.get(id) || null;
    }

    /**
     * Save user
     */
    saveUser(id, userData) {
        this.users.set(id, userData);
    }

    /**
     * Delete user
     */
    deleteUser(id) {
        return this.users.delete(id);
    }

    /**
     * Check if user exists
     */
    hasUser(id) {
        return this.users.has(id);
    }

    /**
     * Find user by email
     */
    findUserByEmail(email) {
        const users = Array.from(this.users.values());
        return users.find(user => user.email === email) || null;
    }

    /**
     * Clear all data (for testing)
     */
    clear() {
        this.users.clear();
    }
}

// Singleton instance
const database = new Database();

module.exports = database;
