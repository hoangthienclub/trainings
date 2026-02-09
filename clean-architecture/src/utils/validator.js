/**
 * UTILS LAYER
 * 
 * Validator - Validation utilities
 * Tách biệt validation logic thành reusable functions
 */

class Validator {
    /**
     * Validate required fields
     */
    static validateRequired(data, requiredFields) {
        const errors = [];

        requiredFields.forEach(field => {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                errors.push(`Trường '${field}' là bắt buộc`);
            }
        });

        return errors;
    }

    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate age range
     */
    static isValidAge(age) {
        return typeof age === 'number' && age >= 0 && age <= 150;
    }

    /**
     * Validate string length
     */
    static isValidLength(str, min, max) {
        if (typeof str !== 'string') return false;
        const length = str.trim().length;
        return length >= min && length <= max;
    }

    /**
     * Validate UUID format
     */
    static isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    /**
     * Sanitize string (remove special characters)
     */
    static sanitizeString(str) {
        if (typeof str !== 'string') return str;
        return str.trim();
    }
}

module.exports = Validator;
