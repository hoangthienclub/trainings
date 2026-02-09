/**
 * CONTROLLERS LAYER (Interface Adapters)
 * 
 * User Controller - Xử lý HTTP requests và responses
 * Gọi services để thực hiện business logic
 */

const userService = require('../services/userService');
const ResponseHelper = require('../utils/response');

class UserController {
    /**
     * POST /api/users - Tạo user mới
     */
    async createUser(req, res) {
        try {
            const { name, email, age } = req.body;

            // Validate request data
            if (!name || !email || age === undefined) {
                return ResponseHelper.badRequest(
                    res,
                    'Thiếu thông tin bắt buộc',
                    ['name, email, và age là bắt buộc']
                );
            }

            // Gọi service để xử lý business logic
            const user = await userService.createUser({ name, email, age });

            return ResponseHelper.created(res, user.toJSON(), 'Tạo user thành công');
        } catch (error) {
            // Handle validation errors
            if (error.validationErrors) {
                return ResponseHelper.validationError(res, error.validationErrors, error.message);
            }

            // Handle duplicate email
            if (error.message.includes('Email đã tồn tại')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, error.message);
        }
    }

    /**
     * GET /api/users - Lấy tất cả users
     */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            const usersData = users.map(user => user.toJSON());

            return ResponseHelper.success(
                res,
                usersData,
                `Lấy danh sách ${usersData.length} users thành công`
            );
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    /**
     * GET /api/users/:id - Lấy user theo ID
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            return ResponseHelper.success(res, user.toJSON(), 'Lấy thông tin user thành công');
        } catch (error) {
            if (error.message.includes('Không tìm thấy')) {
                return ResponseHelper.notFound(res, error.message);
            }
            return ResponseHelper.error(res, error.message);
        }
    }

    /**
     * PUT /api/users/:id - Cập nhật user
     */
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Validate có data để update không
            if (Object.keys(updateData).length === 0) {
                return ResponseHelper.badRequest(res, 'Không có dữ liệu để cập nhật');
            }

            const user = await userService.updateUser(id, updateData);

            return ResponseHelper.success(res, user.toJSON(), 'Cập nhật user thành công');
        } catch (error) {
            // Handle validation errors
            if (error.validationErrors) {
                return ResponseHelper.validationError(res, error.validationErrors, error.message);
            }

            // Handle not found
            if (error.message.includes('Không tìm thấy')) {
                return ResponseHelper.notFound(res, error.message);
            }

            // Handle duplicate email
            if (error.message.includes('Email đã tồn tại')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, error.message);
        }
    }

    /**
     * DELETE /api/users/:id - Xóa user
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);

            return ResponseHelper.success(res, null, 'Xóa user thành công');
        } catch (error) {
            if (error.message.includes('Không tìm thấy')) {
                return ResponseHelper.notFound(res, error.message);
            }
            return ResponseHelper.error(res, error.message);
        }
    }

    /**
     * GET /api/users/adults - Lấy danh sách users trưởng thành
     */
    async getAdultUsers(req, res) {
        try {
            const users = await userService.getAdultUsers();
            const usersData = users.map(user => user.toJSON());

            return ResponseHelper.success(
                res,
                usersData,
                `Lấy danh sách ${usersData.length} users trưởng thành thành công`
            );
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }
}

module.exports = new UserController();
