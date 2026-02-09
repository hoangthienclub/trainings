/**
 * UTILS LAYER
 * 
 * Response Helper - Standardize API responses
 * Đảm bảo tất cả responses có format nhất quán
 */

class ResponseHelper {
    /**
     * Success response
     */
    static success(res, data, message = 'Thành công', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Created response (201)
     */
    static created(res, data, message = 'Tạo mới thành công') {
        return this.success(res, data, message, 201);
    }

    /**
     * Error response
     */
    static error(res, message = 'Có lỗi xảy ra', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Not found response (404)
     */
    static notFound(res, message = 'Không tìm thấy') {
        return this.error(res, message, 404);
    }

    /**
     * Bad request response (400)
     */
    static badRequest(res, message = 'Dữ liệu không hợp lệ', errors = null) {
        return this.error(res, message, 400, errors);
    }

    /**
     * Validation error response (422)
     */
    static validationError(res, errors, message = 'Lỗi validation') {
        return this.error(res, message, 422, errors);
    }

    /**
     * Conflict response (409)
     */
    static conflict(res, message = 'Dữ liệu đã tồn tại') {
        return this.error(res, message, 409);
    }

    /**
     * No content response (204)
     */
    static noContent(res) {
        return res.status(204).send();
    }
}

module.exports = ResponseHelper;
