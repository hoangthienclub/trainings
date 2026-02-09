/**
 * VÍ DỤ 4: CÁC LOẠI MEMORY LEAK PHỔ BIẾN VÀ CÁCH PHÁT HIỆN
 * 
 * Ví dụ này minh họa các pattern memory leak thường gặp trong Node.js
 */

console.log('=== COMMON MEMORY LEAK PATTERNS ===\n');

// Hàm helper
function formatMemory(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function showMemory(label) {
    const usage = process.memoryUsage();
    console.log(`${label}: ${formatMemory(usage.heapUsed)}`);
    return usage.heapUsed;
}

// ===== LEAK 1: Event Listeners không được remove =====
console.log('\n🔴 LEAK #1: Event Listeners Not Removed\n');

const EventEmitter = require('events');

function demonstrateEventListenerLeak() {
    const emitter = new EventEmitter();
    const listeners = [];

    console.log('Creating event listeners...');
    const before = showMemory('Before');

    // Tạo nhiều listeners mà không remove
    for (let i = 0; i < 10000; i++) {
        const listener = () => {
            // Closure giữ reference đến biến i và data lớn
            const data = new Array(1000).fill(i);
            return data.length;
        };

        emitter.on('event', listener);
        listeners.push(listener); // Giữ reference
    }

    const after = showMemory('After creating listeners');
    console.log(`Memory increased: ${formatMemory(after - before)}`);
    console.log(`Listener count: ${emitter.listenerCount('event')}`);

    // ✅ FIX: Remove listeners
    console.log('\n✅ Fixing: Removing listeners...');
    emitter.removeAllListeners('event');
    listeners.length = 0;

    setTimeout(() => {
        const fixed = showMemory('After removing listeners');
        console.log(`Memory recovered: ${formatMemory(after - fixed)}`);
    }, 100);
}

// ===== LEAK 2: Timers/Intervals không được clear =====
console.log('\n\n🔴 LEAK #2: Timers Not Cleared\n');

function demonstrateTimerLeak() {
    const timers = [];
    const data = [];

    console.log('Creating timers...');
    const before = showMemory('Before');

    // Tạo nhiều timers mà không clear
    for (let i = 0; i < 1000; i++) {
        const timer = setInterval(() => {
            // Closure giữ reference đến data
            data.push(new Array(100).fill(i));
        }, 10000); // Timer sẽ không bao giờ chạy trong demo này

        timers.push(timer);
    }

    const after = showMemory('After creating timers');
    console.log(`Memory increased: ${formatMemory(after - before)}`);
    console.log(`Timer count: ${timers.length}`);

    // ✅ FIX: Clear timers
    console.log('\n✅ Fixing: Clearing timers...');
    timers.forEach(timer => clearInterval(timer));
    timers.length = 0;
    data.length = 0;

    setTimeout(() => {
        const fixed = showMemory('After clearing timers');
        console.log(`Memory recovered: ${formatMemory(after - fixed)}`);
    }, 100);
}

// ===== LEAK 3: Global variables và closures =====
console.log('\n\n🔴 LEAK #3: Global Variables & Closures\n');

// ❌ BAD: Global variable
let globalCache = [];

function demonstrateGlobalLeak() {
    console.log('Adding data to global cache...');
    const before = showMemory('Before');

    for (let i = 0; i < 50000; i++) {
        globalCache.push({
            id: i,
            data: new Array(100).fill(i)
        });
    }

    const after = showMemory('After adding to global cache');
    console.log(`Memory increased: ${formatMemory(after - before)}`);
    console.log(`Cache size: ${globalCache.length}`);

    // ✅ FIX: Clear global cache
    console.log('\n✅ Fixing: Clearing global cache...');
    globalCache = [];

    setTimeout(() => {
        const fixed = showMemory('After clearing cache');
        console.log(`Memory recovered: ${formatMemory(after - fixed)}`);
    }, 100);
}

// ===== LEAK 4: Circular References =====
console.log('\n\n🔴 LEAK #4: Circular References (Usually handled by GC, but can be problematic)\n');

function demonstrateCircularReference() {
    const objects = [];

    console.log('Creating circular references...');
    const before = showMemory('Before');

    for (let i = 0; i < 50000; i++) {
        const obj1 = { name: `Object1-${i}`, data: new Array(100).fill(i) };
        const obj2 = { name: `Object2-${i}`, data: new Array(100).fill(i) };

        // Circular reference
        obj1.ref = obj2;
        obj2.ref = obj1;

        objects.push(obj1);
    }

    const after = showMemory('After creating circular refs');
    console.log(`Memory increased: ${formatMemory(after - before)}`);

    // ✅ FIX: Break circular references
    console.log('\n✅ Fixing: Breaking circular references...');
    objects.forEach(obj => {
        if (obj.ref && obj.ref.ref) {
            obj.ref.ref = null;
            obj.ref = null;
        }
    });
    objects.length = 0;

    setTimeout(() => {
        const fixed = showMemory('After breaking references');
        console.log(`Memory recovered: ${formatMemory(after - fixed)}`);
    }, 100);
}

// ===== LEAK 5: Large Objects in Closures =====
console.log('\n\n🔴 LEAK #5: Large Objects Captured in Closures\n');

function demonstrateClosureLeak() {
    const functions = [];

    console.log('Creating closures with large objects...');
    const before = showMemory('Before');

    for (let i = 0; i < 10000; i++) {
        const largeObject = {
            id: i,
            data: new Array(1000).fill('x'.repeat(100))
        };

        // ❌ BAD: Closure captures entire largeObject
        const fn = () => {
            return largeObject.id; // Chỉ cần id nhưng giữ cả object
        };

        functions.push(fn);
    }

    const after = showMemory('After creating closures');
    console.log(`Memory increased: ${formatMemory(after - before)}`);

    // ✅ FIX: Only capture what you need
    console.log('\n✅ Better approach: Only capture needed data');
    const betterFunctions = [];

    for (let i = 0; i < 10000; i++) {
        const largeObject = {
            id: i,
            data: new Array(1000).fill('x'.repeat(100))
        };

        // ✅ GOOD: Only capture the id
        const id = largeObject.id;
        const fn = () => {
            return id; // Chỉ giữ id, không giữ cả object
        };

        betterFunctions.push(fn);
    }

    functions.length = 0;

    setTimeout(() => {
        const fixed = showMemory('After fixing closures');
        console.log(`Memory with better approach: ${formatMemory(fixed - before)}`);
        betterFunctions.length = 0;
    }, 100);
}

// ===== Chạy tất cả demonstrations =====
async function runAllDemonstrations() {
    demonstrateEventListenerLeak();

    setTimeout(() => {
        demonstrateTimerLeak();

        setTimeout(() => {
            demonstrateGlobalLeak();

            setTimeout(() => {
                demonstrateCircularReference();

                setTimeout(() => {
                    demonstrateClosureLeak();

                    setTimeout(() => {
                        console.log('\n\n=== SUMMARY ===');
                        console.log('Common memory leak patterns:');
                        console.log('1. ❌ Event listeners not removed');
                        console.log('2. ❌ Timers/intervals not cleared');
                        console.log('3. ❌ Unbounded global variables');
                        console.log('4. ❌ Circular references (usually OK, but be careful)');
                        console.log('5. ❌ Large objects captured in closures');
                        console.log('\n💡 Always clean up resources when done!');
                        console.log('💡 Use WeakMap/WeakSet for caching when appropriate');
                        console.log('💡 Run with --expose-gc to manually trigger GC for testing');
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

runAllDemonstrations();
