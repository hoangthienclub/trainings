/**
 * VÍ DỤ VI PHẠM LISKOV SUBSTITUTION PRINCIPLE (LSP)
 * 
 * Liskov Substitution Principle: "Objects of a superclass should be replaceable 
 * with objects of a subclass without breaking the application"
 * (Đối tượng của class con phải có thể thay thế được class cha mà không gây lỗi)
 * 
 * Vấn đề: Penguin (chim cánh cụt) kế thừa Bird nhưng không thể bay
 * -> Không thể thay thế Bird bằng Penguin -> Vi phạm LSP
 */

class Bird {
    constructor(name) {
        this.name = name;
    }

    fly() {
        console.log(`🦅 ${this.name} đang bay!`);
    }

    eat() {
        console.log(`🍖 ${this.name} đang ăn`);
    }
}

// Vấn đề: Penguin là Bird nhưng không bay được!
class Penguin extends Bird {
    constructor(name) {
        super(name);
    }

    // Vi phạm LSP: phải override và throw error
    fly() {
        // Chim cánh cụt không bay được!
        throw new Error(`❌ ${this.name} không thể bay! Chim cánh cụt không có khả năng bay.`);
    }

    swim() {
        console.log(`🏊 ${this.name} đang bơi!`);
    }
}

class Eagle extends Bird {
    constructor(name) {
        super(name);
    }

    fly() {
        console.log(`🦅 ${this.name} đang bay cao trên bầu trời!`);
    }
}

// Hàm sử dụng Bird - kỳ vọng tất cả Bird đều bay được
function makeBirdFly(bird) {
    console.log(`\n📢 Yêu cầu ${bird.name} bay:`);
    bird.fly(); // Kỳ vọng: tất cả bird đều bay được
}

function birdShow(birds) {
    console.log('\n🎪 BIỂU DIỄN CHIM BAY:\n');

    birds.forEach(bird => {
        try {
            makeBirdFly(bird);
        } catch (error) {
            console.log(error.message);
        }
    });
}

// ===== DEMO =====
console.log('🔴 VÍ DỤ VI PHẠM LSP - Subclass không thể thay thế superclass\n');
console.log('='.repeat(60));

const eagle = new Eagle('Đại bàng');
const sparrow = new Bird('Chim sẻ');
const penguin = new Penguin('Chim cánh cụt');

// Tạo mảng các Bird
const birds = [eagle, sparrow, penguin];

// Thử cho tất cả bay
birdShow(birds);

console.log('\n❌ VẤN ĐỀ:');
console.log('   - Penguin kế thừa Bird nhưng không thể bay');
console.log('   - Không thể thay thế Bird bằng Penguin mà không gây lỗi');
console.log('   - Phải dùng try/catch để xử lý exception');
console.log('   - Vi phạm LSP: "subclass phải thay thế được superclass"');
console.log('   - Thiết kế class hierarchy không hợp lý!');

console.log('\n💡 Vấn đề gốc rễ:');
console.log('   - Không phải tất cả Bird đều fly được');
console.log('   - Nhưng Bird class lại có method fly()');
console.log('   - → Cần thiết kế lại class hierarchy!');

console.log('\n' + '='.repeat(60));
console.log('💡 Xem file 3-lsp-good.js để biết cách làm đúng!\n');
