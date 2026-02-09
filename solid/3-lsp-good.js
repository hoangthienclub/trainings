/**
 * VÍ DỤ TUÂN THỦ LISKOV SUBSTITUTION PRINCIPLE (LSP)
 * 
 * Giải pháp: Thiết kế lại class hierarchy hợp lý
 * - Bird: base class với các hành vi chung (eat)
 * - FlyingBird: chim bay được (fly)
 * - SwimmingBird: chim bơi được (swim)
 * 
 * Lợi ích:
 * - Mỗi subclass đều có thể thay thế được superclass của nó
 * - Không cần throw exception
 * - Thiết kế rõ ràng, logic hơn
 */

// Base class: Chim - chỉ có hành vi chung
class Bird {
    constructor(name) {
        this.name = name;
    }

    eat() {
        console.log(`🍖 ${this.name} đang ăn`);
    }

    makeSound() {
        console.log(`🎵 ${this.name} đang kêu`);
    }
}

// Chim bay được - kế thừa Bird và thêm khả năng bay
class FlyingBird extends Bird {
    constructor(name, maxAltitude) {
        super(name);
        this.maxAltitude = maxAltitude;
    }

    fly() {
        console.log(`🦅 ${this.name} đang bay ở độ cao ${this.maxAltitude}m!`);
    }
}

// Chim bơi được - kế thừa Bird và thêm khả năng bơi
class SwimmingBird extends Bird {
    constructor(name, maxDepth) {
        super(name);
        this.maxDepth = maxDepth;
    }

    swim() {
        console.log(`🏊 ${this.name} đang bơi ở độ sâu ${this.maxDepth}m!`);
    }
}

// Concrete classes
class Eagle extends FlyingBird {
    constructor(name) {
        super(name, 3000); // Đại bàng bay cao 3000m
    }

    fly() {
        console.log(`🦅 ${this.name} đang bay cao trên bầu trời ở độ cao ${this.maxAltitude}m!`);
    }
}

class Sparrow extends FlyingBird {
    constructor(name) {
        super(name, 100); // Chim sẻ bay thấp 100m
    }

    fly() {
        console.log(`🐦 ${this.name} đang bay lượn ở độ cao ${this.maxAltitude}m!`);
    }
}

class Penguin extends SwimmingBird {
    constructor(name) {
        super(name, 50); // Chim cánh cụt lặn sâu 50m
    }

    swim() {
        console.log(`🐧 ${this.name} đang bơi và lặn ở độ sâu ${this.maxDepth}m!`);
    }

    // Penguin có thêm hành vi đặc biệt
    slideOnIce() {
        console.log(`⛸️  ${this.name} đang trượt trên băng!`);
    }
}

class Duck extends FlyingBird {
    constructor(name) {
        super(name, 500);
        this.canSwim = true;
    }

    fly() {
        console.log(`🦆 ${this.name} đang bay ở độ cao ${this.maxAltitude}m!`);
    }

    swim() {
        console.log(`🦆 ${this.name} đang bơi trên mặt nước!`);
    }
}

// Hàm xử lý FlyingBird - chỉ nhận chim bay được
function makeFlyingBirdFly(bird) {
    console.log(`\n📢 Yêu cầu ${bird.name} bay:`);
    bird.fly(); // An toàn: tất cả FlyingBird đều bay được
}

// Hàm xử lý SwimmingBird - chỉ nhận chim bơi được
function makeSwimmingBirdSwim(bird) {
    console.log(`\n📢 Yêu cầu ${bird.name} bơi:`);
    bird.swim(); // An toàn: tất cả SwimmingBird đều bơi được
}

// Hàm xử lý tất cả Bird - chỉ dùng hành vi chung
function feedBird(bird) {
    console.log(`\n📢 Cho ${bird.name} ăn:`);
    bird.eat(); // An toàn: tất cả Bird đều ăn được
}

// ===== DEMO =====
console.log('✅ VÍ DỤ TUÂN THỦ LSP - Subclass có thể thay thế superclass\n');
console.log('='.repeat(60));

const eagle = new Eagle('Đại bàng');
const sparrow = new Sparrow('Chim sẻ');
const penguin = new Penguin('Chim cánh cụt');
const duck = new Duck('Vịt');

console.log('🎪 BIỂU DIỄN CHIM BAY:');
const flyingBirds = [eagle, sparrow, duck];
flyingBirds.forEach(bird => makeFlyingBirdFly(bird));

console.log('\n🏊 BIỂU DIỄN CHIM BƠI:');
const swimmingBirds = [penguin, duck];
swimmingBirds.forEach(bird => makeSwimmingBirdSwim(bird));

console.log('\n🍖 CHO TẤT CẢ CHIM ĂN:');
const allBirds = [eagle, sparrow, penguin, duck];
allBirds.forEach(bird => feedBird(bird));

// Hành vi đặc biệt của Penguin
console.log('\n❄️  HÀNH VI ĐẶC BIỆT:');
console.log(`\n📢 ${penguin.name} trượt băng:`);
penguin.slideOnIce();

console.log('\n✅ LỢI ÍCH CỦA LSP:');
console.log('   ✓ FlyingBird có thể thay thế Bird mà không lỗi');
console.log('   ✓ SwimmingBird có thể thay thế Bird mà không lỗi');
console.log('   ✓ Không cần throw exception');
console.log('   ✓ Không cần try/catch');
console.log('   ✓ Class hierarchy rõ ràng, logic');
console.log('   ✓ Dễ mở rộng: thêm RunningBird, ClimbingBird...');

console.log('\n💡 Nguyên tắc:');
console.log('   → Subclass PHẢI có thể thay thế superclass');
console.log('   → Không được làm yếu đi preconditions');
console.log('   → Không được làm mạnh thêm postconditions');
console.log('   → Không được throw exception mà superclass không throw');

console.log('\n' + '='.repeat(60));
console.log('💡 So sánh với 3-lsp-bad.js để thấy sự khác biệt!\n');
