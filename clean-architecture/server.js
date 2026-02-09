/**
 * SERVER ENTRY POINT
 * 
 * Khởi động server
 */

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Clean Architecture Node.js Example');
    console.log('='.repeat(50));
    console.log(`📡 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
    console.log('\n📋 Available Endpoints:');
    console.log('  POST   /api/users          - Tạo user mới');
    console.log('  GET    /api/users          - Lấy tất cả users');
    console.log('  GET    /api/users/adults   - Lấy users trưởng thành');
    console.log('  GET    /api/users/:id      - Lấy user theo ID');
    console.log('  PUT    /api/users/:id      - Cập nhật user');
    console.log('  DELETE /api/users/:id      - Xóa user');
    console.log('='.repeat(50));
    console.log('\n✨ Server sẵn sàng nhận requests!\n');
});
