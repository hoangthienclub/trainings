/**
 * VÍ DỤ 2: SỬ DỤNG v8.getHeapStatistics()
 * 
 * Cung cấp thông tin chi tiết hơn về V8 heap
 */

const v8 = require('v8');

console.log('=== V8 HEAP STATISTICS ===\n');

// Hàm helper để format bytes
function formatBytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// Hàm hiển thị heap statistics
function showHeapStatistics(label) {
    const heapStats = v8.getHeapStatistics();

    console.log(`\n--- ${label} ---`);
    console.log(`Total Heap Size:              ${formatBytes(heapStats.total_heap_size)}`);
    console.log(`Total Heap Size Executable:   ${formatBytes(heapStats.total_heap_size_executable)}`);
    console.log(`Total Physical Size:          ${formatBytes(heapStats.total_physical_size)}`);
    console.log(`Total Available Size:         ${formatBytes(heapStats.total_available_size)}`);
    console.log(`Used Heap Size:               ${formatBytes(heapStats.used_heap_size)}`);
    console.log(`Heap Size Limit:              ${formatBytes(heapStats.heap_size_limit)}`);
    console.log(`Malloced Memory:              ${formatBytes(heapStats.malloced_memory)}`);
    console.log(`Peak Malloced Memory:         ${formatBytes(heapStats.peak_malloced_memory)}`);
    console.log(`Does ZAP Garbage:             ${heapStats.does_zap_garbage}`);
    console.log(`Number of Native Contexts:    ${heapStats.number_of_native_contexts}`);
    console.log(`Number of Detached Contexts:  ${heapStats.number_of_detached_contexts}`);

    // Tính phần trăm heap đã sử dụng
    const usedPercentage = ((heapStats.used_heap_size / heapStats.heap_size_limit) * 100).toFixed(2);
    console.log(`\n📊 Heap Usage: ${usedPercentage}%`);

    // Cảnh báo nếu heap sử dụng quá cao
    if (usedPercentage > 80) {
        console.log('⚠️  WARNING: Heap usage is above 80%!');
    } else if (usedPercentage > 60) {
        console.log('⚡ CAUTION: Heap usage is above 60%');
    } else {
        console.log('✅ Heap usage is healthy');
    }

    return heapStats;
}

// Hiển thị heap statistics ban đầu
const initialStats = showHeapStatistics('Initial Heap Statistics');

// Tạo nhiều objects để tăng heap usage
console.log('\n🔄 Creating objects to increase heap usage...');
const objects = [];
for (let i = 0; i < 100000; i++) {
    objects.push({
        id: i,
        data: 'x'.repeat(100),
        timestamp: new Date(),
        nested: {
            value: Math.random(),
            array: new Array(10).fill(i)
        }
    });
}

const afterCreationStats = showHeapStatistics('After Creating Objects');

// Hiển thị heap space statistics
console.log('\n=== HEAP SPACE STATISTICS ===');
const heapSpaces = v8.getHeapSpaceStatistics();
heapSpaces.forEach(space => {
    console.log(`\n${space.space_name}:`);
    console.log(`  Space Size:       ${formatBytes(space.space_size)}`);
    console.log(`  Space Used Size:  ${formatBytes(space.space_used_size)}`);
    console.log(`  Space Available:  ${formatBytes(space.space_available_size)}`);
    console.log(`  Physical Size:    ${formatBytes(space.physical_space_size)}`);
});

// Hiển thị heap code statistics
console.log('\n=== HEAP CODE STATISTICS ===');
const codeStats = v8.getHeapCodeStatistics();
console.log(`Code and Metadata Size:       ${formatBytes(codeStats.code_and_metadata_size)}`);
console.log(`Bytecode and Metadata Size:   ${formatBytes(codeStats.bytecode_and_metadata_size)}`);
console.log(`External Script Source Size:  ${formatBytes(codeStats.external_script_source_size)}`);

// So sánh trước và sau
console.log('\n=== COMPARISON ===');
const heapIncrease = afterCreationStats.used_heap_size - initialStats.used_heap_size;
console.log(`Heap size increased by: ${formatBytes(heapIncrease)}`);

// Tính toán memory overhead
const objectCount = objects.length;
const averageObjectSize = heapIncrease / objectCount;
console.log(`\nCreated ${objectCount.toLocaleString()} objects`);
console.log(`Average size per object: ${(averageObjectSize / 1024).toFixed(2)} KB`);

console.log('\n✅ Heap statistics analysis completed!');
