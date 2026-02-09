/**
 * MODELS LAYER (Domain Layer)
 * 
 * User Model - Đại diện cho business entity
 * Chứa business logic và validation rules
 */

class User {
    constructor({ id, name, email, age, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    /**
     * Validate user data theo business rules
     */
    validate() {
        const errors = [];

        // Validate name
        if (!this.name || this.name.trim().length === 0) {
            errors.push('Tên không được để trống');
        }
        if (this.name && this.name.length < 2) {
            errors.push('Tên phải có ít nhất 2 ký tự');
        }

        // Validate email
        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('Email không hợp lệ');
        }

        // Validate age
        if (this.age === undefined || this.age === null) {
            errors.push('Tuổi không được để trống');
        }
        if (this.age < 0 || this.age > 150) {
            errors.push('Tuổi phải từ 0 đến 150');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Business logic: Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Business logic: Update user information
     */
    update(data) {
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
        if (data.age !== undefined) {
            this.age = data.age;
        }
        this.updatedAt = new Date();
    }

    /**
     * Convert to plain object (for JSON response)
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Business logic: Check if user is adult
     */
    isAdult() {
        return this.age >= 18;
    }
}

module.exports = User;
