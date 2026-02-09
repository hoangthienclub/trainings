/**
 * VÍ DỤ 3: TẠO VÀ PHÂN TÍCH HEAP SNAPSHOT
 * 
 * Heap snapshot cho phép bạn chụp lại trạng thái memory tại một thời điểm
 * và phân tích chi tiết các objects trong heap
 */

const v8 = require('v8');
const fs = require('fs');
const path = require('path');

console.log('=== HEAP SNAPSHOT EXAMPLE ===\n');

// Tạo thư mục để lưu snapshots
const snapshotDir = path.join(__dirname, 'snapshots');
if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir);
    console.log(`📁 Created snapshots directory: ${snapshotDir}`);
}

// Hàm tạo heap snapshot
function takeHeapSnapshot(label) {
    const timestamp = Date.now();
    const filename = `heap-${label}-${timestamp}.heapsnapshot`;
    const filepath = path.join(snapshotDir, filename);

    console.log(`\n📸 Taking heap snapshot: ${label}...`);

    const snapshotStream = v8.writeHeapSnapshot(filepath);

    if (snapshotStream) {
        const stats = fs.statSync(filepath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`✅ Snapshot saved: ${filename} (${sizeMB} MB)`);
        return filepath;
    } else {
        console.log('❌ Failed to create snapshot');
        return null;
    }
}

// Hàm hiển thị memory usage
function showMemory(label) {
    const usage = process.memoryUsage();
    console.log(`\n${label}:`);
    console.log(`  Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

// ===== SCENARIO: Phát hiện Memory Leak =====

console.log('\n🔍 SCENARIO: Detecting Memory Leak\n');

// 1. Snapshot ban đầu
showMemory('Initial State');
const snapshot1 = takeHeapSnapshot('initial');

// 2. Tạo data (giả lập memory leak)
console.log('\n🔄 Creating data structures...');
const leakyCache = [];
const users = [];

for (let i = 0; i < 50000; i++) {
    // Tạo user objects
    const user = {
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        data: 'x'.repeat(100)
    };
    users.push(user);

    // Giả lập cache leak - cache không bao giờ được clear
    leakyCache.push({
        key: `cache_${i}`,
        value: user,
        timestamp: new Date()
    });
}

showMemory('After Creating Data');
const snapshot2 = takeHeapSnapshot('after-creation');

// 3. Giả lập xóa users nhưng cache vẫn giữ references (memory leak!)
console.log('\n🔄 Clearing users array (but cache still holds references)...');
users.length = 0;

showMemory('After Clearing Users');
const snapshot3 = takeHeapSnapshot('after-clear');

// 4. Phân tích
console.log('\n\n=== ANALYSIS ===');
console.log('📊 Three snapshots have been created:');
console.log('   1. initial - Baseline memory state');
console.log('   2. after-creation - After creating users and cache');
console.log('   3. after-clear - After clearing users (but cache leak remains)');

console.log('\n🔍 To analyze these snapshots:');
console.log('   1. Open Chrome DevTools (F12)');
console.log('   2. Go to "Memory" tab');
console.log('   3. Click "Load" and select the .heapsnapshot files');
console.log('   4. Compare snapshots to find memory leaks');

console.log('\n💡 What to look for:');
console.log('   - Objects that should be garbage collected but still exist');
console.log('   - Unexpected growth in object counts between snapshots');
console.log('   - Large arrays or objects holding references');

console.log('\n⚠️  Expected finding:');
console.log('   The "leakyCache" array still holds references to user objects');
console.log('   even after users array was cleared, preventing garbage collection.');

// 5. Tạo một snapshot sau khi fix leak
console.log('\n\n🔧 Fixing the leak by clearing cache...');
leakyCache.length = 0;

if (global.gc) {
    console.log('🗑️  Running garbage collection...');
    global.gc();
}

setTimeout(() => {
    showMemory('After Fixing Leak');
    const snapshot4 = takeHeapSnapshot('after-fix');

    console.log('\n✅ All snapshots created successfully!');
    console.log(`📁 Snapshots location: ${snapshotDir}`);

    // List all snapshots
    const snapshots = fs.readdirSync(snapshotDir);
    console.log('\n📋 Created snapshots:');
    snapshots.forEach(file => {
        const filepath = path.join(snapshotDir, file);
        const stats = fs.statSync(filepath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`   - ${file} (${sizeMB} MB)`);
    });

    console.log('\n💡 TIP: Run with --expose-gc for better garbage collection:');
    console.log('   node --expose-gc heap-snapshot.js');
}, 1000);
