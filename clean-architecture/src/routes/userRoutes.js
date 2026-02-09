/**
 * ROUTES LAYER
 * 
 * User Routes - Định nghĩa API endpoints
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @route   POST /api/users
 * @desc    Tạo user mới
 * @access  Public
 */
router.post('/', (req, res) => userController.createUser(req, res));

/**
 * @route   GET /api/users
 * @desc    Lấy tất cả users
 * @access  Public
 */
router.get('/', (req, res) => userController.getAllUsers(req, res));

/**
 * @route   GET /api/users/adults
 * @desc    Lấy danh sách users trưởng thành (>= 18 tuổi)
 * @access  Public
 * @note    Route này phải đặt TRƯỚC route /:id để tránh conflict
 */
router.get('/adults', (req, res) => userController.getAdultUsers(req, res));

/**
 * @route   GET /api/users/:id
 * @desc    Lấy user theo ID
 * @access  Public
 */
router.get('/:id', (req, res) => userController.getUserById(req, res));

/**
 * @route   PUT /api/users/:id
 * @desc    Cập nhật user
 * @access  Public
 */
router.put('/:id', (req, res) => userController.updateUser(req, res));

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa user
 * @access  Public
 */
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
