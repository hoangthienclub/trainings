/**
 * VÍ DỤ TUÂN THỦ INTERFACE SEGREGATION PRINCIPLE (ISP)
 * 
 * Giải pháp: Tách interface lớn thành nhiều interface nhỏ, chuyên biệt
 * - Workable: khả năng làm việc
 * - Eatable: khả năng ăn
 * - Sleepable: khả năng ngủ
 * - Breakable: khả năng nghỉ
 * - Meetable: khả năng họp
 * 
 * Lợi ích:
 * - Mỗi class chỉ implement interface mà nó cần
 * - Không bắt buộc implement method không dùng
 * - Linh hoạt, dễ mở rộng
 */

// Interface nhỏ 1: Khả năng làm việc
class Workable {
    work() {
        throw new Error('Method work() must be implemented');
    }
}

// Interface nhỏ 2: Khả năng ăn
class Eatable {
    eat() {
        throw new Error('Method eat() must be implemented');
    }
}

// Interface nhỏ 3: Khả năng ngủ
class Sleepable {
    sleep() {
        throw new Error('Method sleep() must be implemented');
    }
}

// Interface nhỏ 4: Khả năng nghỉ giải lao
class Breakable {
    takeBreak() {
        throw new Error('Method takeBreak() must be implemented');
    }
}

// Interface nhỏ 5: Khả năng họp
class Meetable {
    attendMeeting() {
        throw new Error('Method attendMeeting() must be implemented');
    }
}

// Interface nhỏ 6: Khả năng sạc pin (cho robot)
class Rechargeable {
    recharge() {
        throw new Error('Method recharge() must be implemented');
    }
}

// Human Worker - implement các interface cần thiết
class HumanWorker extends Workable {
    constructor(name) {
        super();
        this.name = name;
    }

    work() {
        console.log(`👨‍💼 ${this.name} đang làm việc`);
    }
}

// Thêm khả năng ăn cho Human
class EatableHumanWorker extends HumanWorker {
    eat() {
        console.log(`🍚 ${this.name} đang ăn trưa`);
    }
}

// Thêm khả năng ngủ
class SleepableHumanWorker extends EatableHumanWorker {
    sleep() {
        console.log(`😴 ${this.name} đang ngủ`);
    }
}

// Thêm khả năng nghỉ giải lao
class BreakableHumanWorker extends SleepableHumanWorker {
    takeBreak() {
        console.log(`☕ ${this.name} đang nghỉ giải lao`);
    }
}

// Full Human Worker - có tất cả khả năng
class FullHumanWorker extends BreakableHumanWorker {
    attendMeeting() {
        console.log(`👥 ${this.name} đang họp`);
    }
}

// Robot Worker - CHỈ implement interface cần thiết
class RobotWorker extends Workable {
    constructor(name) {
        super();
        this.name = name;
        this.batteryLevel = 100;
    }

    work() {
        console.log(`🤖 ${this.name} đang làm việc 24/7 (Pin: ${this.batteryLevel}%)`);
        this.batteryLevel -= 10;
    }

    // Robot có method riêng
    recharge() {
        console.log(`🔋 ${this.name} đang sạc pin...`);
        this.batteryLevel = 100;
        console.log(`✅ Sạc đầy! Pin: ${this.batteryLevel}%`);
    }

    attendMeeting() {
        console.log(`📊 ${this.name} đang gửi báo cáo tự động`);
    }
}

// Manager - quản lý linh hoạt theo khả năng
class WorkManager {
    // Quản lý worker có khả năng làm việc
    assignWork(worker) {
        if (worker instanceof Workable) {
            console.log(`\n📋 Giao việc cho ${worker.name}:`);
            worker.work();
        }
    }

    // Quản lý giờ ăn - chỉ cho human
    manageLunchTime(worker) {
        if (typeof worker.eat === 'function') {
            console.log(`\n🍽️  Giờ ăn trưa cho ${worker.name}:`);
            worker.eat();
        } else {
            console.log(`\n⏭️  ${worker.name} không cần ăn, tiếp tục làm việc`);
        }
    }

    // Quản lý giờ nghỉ
    manageBreakTime(worker) {
        if (typeof worker.takeBreak === 'function') {
            console.log(`\n☕ Giờ nghỉ giải lao cho ${worker.name}:`);
            worker.takeBreak();
        } else if (typeof worker.recharge === 'function') {
            console.log(`\n🔋 Giờ sạc pin cho ${worker.name}:`);
            worker.recharge();
        }
    }

    // Quản lý meeting
    scheduleMeeting(workers) {
        console.log('\n👥 BẮT ĐẦU MEETING:');
        workers.forEach(worker => {
            if (typeof worker.attendMeeting === 'function') {
                worker.attendMeeting();
            }
        });
    }
}

// ===== DEMO =====
console.log('✅ VÍ DỤ TUÂN THỦ ISP - Interface nhỏ, chuyên biệt\n');
console.log('='.repeat(60));

const human = new FullHumanWorker('Nguyễn Văn A');
const robot = new RobotWorker('Robot-X1');

const manager = new WorkManager();

// Giao việc
manager.assignWork(human);
manager.assignWork(robot);

// Giờ ăn trưa
manager.manageLunchTime(human);
manager.manageLunchTime(robot);

// Giờ nghỉ
manager.manageBreakTime(human);
manager.manageBreakTime(robot);

// Meeting
manager.scheduleMeeting([human, robot]);

console.log('\n✅ LỢI ÍCH CỦA ISP:');
console.log('   ✓ Mỗi class chỉ implement interface cần thiết');
console.log('   ✓ HumanWorker: Workable + Eatable + Sleepable + Breakable + Meetable');
console.log('   ✓ RobotWorker: Workable + Rechargeable + Meetable');
console.log('   ✓ Không bắt buộc implement method không dùng');
console.log('   ✓ Không cần throw exception');
console.log('   ✓ Dễ mở rộng: thêm interface mới không ảnh hưởng code cũ');

console.log('\n💡 Nguyên tắc:');
console.log('   → Nhiều interface nhỏ tốt hơn một interface lớn');
console.log('   → Client chỉ phụ thuộc vào interface mà nó dùng');
console.log('   → Tách interface theo khả năng/hành vi cụ thể');

console.log('\n💡 Ví dụ mở rộng:');
console.log('   → Thêm DroneWorker: Workable + Flyable + Rechargeable');
console.log('   → Thêm InternWorker: Workable + Eatable + Learnable');
console.log('   → Không cần sửa code cũ!');

console.log('\n' + '='.repeat(60));
console.log('💡 So sánh với 4-isp-bad.js để thấy sự khác biệt!\n');
