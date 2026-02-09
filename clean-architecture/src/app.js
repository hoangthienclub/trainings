/**
 * APPLICATION SETUP
 * 
 * Express app configuration và middleware setup
 */

const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware: Parse JSON body
app.use(express.json());

// Middleware: Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Middleware: Logging requests (simple logger)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint không tồn tại'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
