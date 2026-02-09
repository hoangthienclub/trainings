/**
 * VÍ DỤ VI PHẠM INTERFACE SEGREGATION PRINCIPLE (ISP)
 * 
 * Interface Segregation Principle: "Clients should not be forced to depend 
 * on interfaces they do not use"
 * (Không nên bắt client implement các method mà nó không dùng)
 * 
 * Vấn đề: Interface Worker quá lớn, bắt tất cả worker phải implement
 * tất cả các method, kể cả những method không cần thiết
 */

// Interface quá lớn - chứa quá nhiều method
class Worker {
    work() {
        throw new Error('Method work() must be implemented');
    }

    eat() {
        throw new Error('Method eat() must be implemented');
    }

    sleep() {
        throw new Error('Method sleep() must be implemented');
    }

    // Vấn đề: không phải worker nào cũng cần nghỉ giải lao
    takeBreak() {
        throw new Error('Method takeBreak() must be implemented');
    }

    // Vấn đề: không phải worker nào cũng cần meeting
    attendMeeting() {
        throw new Error('Method attendMeeting() must be implemented');
    }
}

// Human Worker - cần tất cả các method
class HumanWorker extends Worker {
    constructor(name) {
        super();
        this.name = name;
    }

    work() {
        console.log(`👨‍💼 ${this.name} đang làm việc`);
    }

    eat() {
        console.log(`🍚 ${this.name} đang ăn trưa`);
    }

    sleep() {
        console.log(`😴 ${this.name} đang ngủ`);
    }

    takeBreak() {
        console.log(`☕ ${this.name} đang nghỉ giải lao`);
    }

    attendMeeting() {
        console.log(`👥 ${this.name} đang họp`);
    }
}

// Robot Worker - KHÔNG cần eat, sleep, takeBreak
// Nhưng vẫn bắt buộc phải implement -> Vi phạm ISP!
class RobotWorker extends Worker {
    constructor(name) {
        super();
        this.name = name;
    }

    work() {
        console.log(`🤖 ${this.name} đang làm việc 24/7`);
    }

    // Bắt buộc phải implement nhưng không có ý nghĩa!
    eat() {
        throw new Error(`❌ ${this.name} là robot, không cần ăn!`);
    }

    sleep() {
        throw new Error(`❌ ${this.name} là robot, không cần ngủ!`);
    }

    takeBreak() {
        throw new Error(`❌ ${this.name} là robot, không cần nghỉ!`);
    }

    attendMeeting() {
        // Robot có thể tham gia meeting (gửi report)
        console.log(`📊 ${this.name} đang gửi báo cáo tự động`);
    }
}

// Manager - quản lý workers
class WorkManager {
    manageWorker(worker) {
        console.log(`\n📋 Quản lý worker: ${worker.name}`);

        try {
            worker.work();
            worker.eat();        // Lỗi nếu là Robot!
            worker.takeBreak();  // Lỗi nếu là Robot!
            worker.sleep();      // Lỗi nếu là Robot!
            worker.attendMeeting();
        } catch (error) {
            console.log(error.message);
        }
    }
}

// ===== DEMO =====
console.log('🔴 VÍ DỤ VI PHẠM ISP - Interface quá lớn, bắt implement method không cần\n');
console.log('='.repeat(60));

const human = new HumanWorker('Nguyễn Văn A');
const robot = new RobotWorker('Robot-X1');

const manager = new WorkManager();

console.log('👨‍💼 QUẢN LÝ HUMAN WORKER:');
manager.manageWorker(human);

console.log('\n🤖 QUẢN LÝ ROBOT WORKER:');
manager.manageWorker(robot);

console.log('\n❌ VẤN ĐỀ:');
console.log('   - Interface Worker quá lớn, chứa quá nhiều method');
console.log('   - RobotWorker bắt buộc phải implement eat(), sleep(), takeBreak()');
console.log('   - Nhưng robot không cần các method này!');
console.log('   - Phải throw exception hoặc để trống -> không tốt');
console.log('   - Vi phạm ISP: "không bắt implement method không dùng"');

console.log('\n💡 Hậu quả:');
console.log('   - Code khó maintain');
console.log('   - Dễ gây lỗi runtime');
console.log('   - Phải dùng try/catch khắp nơi');
console.log('   - Interface không linh hoạt');

console.log('\n' + '='.repeat(60));
console.log('💡 Xem file 4-isp-good.js để biết cách làm đúng!\n');
