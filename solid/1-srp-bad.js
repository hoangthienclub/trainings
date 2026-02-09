/**
 * VÍ DỤ VI PHẠM SINGLE RESPONSIBILITY PRINCIPLE (SRP)
 * 
 * Vấn đề: Class User làm quá nhiều việc:
 * - Quản lý dữ liệu user
 * - Validate dữ liệu
 * - Lưu vào database
 * - Gửi email
 * 
 * Khi cần thay đổi logic validation, database, hoặc email
 * đều phải sửa class User này -> Vi phạm SRP
 */

class User {
  constructor(name, email, age) {
    this.name = name;
    this.email = email;
    this.age = age;
  }

  // Trách nhiệm 1: Validate dữ liệu
  validate() {
    if (!this.name || this.name.length < 2) {
      throw new Error('Tên phải có ít nhất 2 ký tự');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Email không hợp lệ');
    }
    
    if (this.age < 18) {
      throw new Error('Tuổi phải từ 18 trở lên');
    }
    
    return true;
  }

  // Trách nhiệm 2: Lưu vào database
  save() {
    this.validate();
    
    // Giả lập lưu vào database
    console.log('💾 Đang lưu vào database...');
    console.log(`   INSERT INTO users (name, email, age) VALUES ('${this.name}', '${this.email}', ${this.age})`);
    console.log('✅ Lưu thành công!');
    
    return true;
  }

  // Trách nhiệm 3: Gửi email chào mừng
  sendWelcomeEmail() {
    console.log('📧 Đang gửi email chào mừng...');
    console.log(`   To: ${this.email}`);
    console.log(`   Subject: Chào mừng ${this.name}!`);
    console.log(`   Body: Xin chào ${this.name}, cảm ơn bạn đã đăng ký!`);
    console.log('✅ Email đã được gửi!');
  }

  // Trách nhiệm 4: In thông tin
  print() {
    console.log('\n📋 Thông tin User:');
    console.log(`   Tên: ${this.name}`);
    console.log(`   Email: ${this.email}`);
    console.log(`   Tuổi: ${this.age}`);
  }
}

// ===== DEMO =====
console.log('🔴 VÍ DỤ VI PHẠM SRP - Class User làm quá nhiều việc\n');
console.log('=' .repeat(60));

try {
  const user = new User('Nguyễn Văn A', 'nguyenvana@example.com', 25);
  
  user.print();
  user.save();
  user.sendWelcomeEmail();
  
  console.log('\n❌ VẤN ĐỀ:');
  console.log('   - Class User có quá nhiều trách nhiệm');
  console.log('   - Khi thay đổi logic validation -> phải sửa class User');
  console.log('   - Khi thay đổi database -> phải sửa class User');
  console.log('   - Khi thay đổi email service -> phải sửa class User');
  console.log('   - Khó test, khó maintain, vi phạm SRP!');
  
} catch (error) {
  console.error('❌ Lỗi:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('💡 Xem file 1-srp-good.js để biết cách làm đúng!\n');
