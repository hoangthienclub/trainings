/**
 * VÍ DỤ 1: SỬ DỤNG process.memoryUsage()
 * 
 * Đây là cách đơn giản nhất để theo dõi memory usage trong Node.js
 */

console.log('=== BASIC MEMORY PROFILING ===\n');

// Hàm helper để format bytes thành MB
function formatMemory(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// Hàm hiển thị memory usage
function showMemoryUsage(label) {
  const usage = process.memoryUsage();

  console.log(`\n--- ${label} ---`);
  console.log(`RSS (Resident Set Size):    ${formatMemory(usage.rss)}`);
  console.log(`Heap Total:                 ${formatMemory(usage.heapTotal)}`);
  console.log(`Heap Used:                  ${formatMemory(usage.heapUsed)}`);
  console.log(`External:                   ${formatMemory(usage.external)}`);
  console.log(`Array Buffers:              ${formatMemory(usage.arrayBuffers)}`);

  return usage;
}

// 1. Kiểm tra memory ban đầu
const initialMemory = showMemoryUsage('Initial Memory');

// 2. Tạo một array lớn để xem memory tăng
console.log('\n🔄 Creating large array...');
const largeArray = new Array(1000000).fill('x'.repeat(100));
const afterArrayMemory = showMemoryUsage('After Creating Large Array');

// 3. Tính toán memory tăng thêm
const memoryIncrease = afterArrayMemory.heapUsed - initialMemory.heapUsed;
console.log(`\n📊 Memory increased by: ${formatMemory(memoryIncrease)}`);

// 4. Giải phóng memory bằng cách xóa reference
console.log('\n🔄 Clearing array...');
largeArray.length = 0;

// 5. Force garbage collection (chỉ hoạt động khi chạy với flag --expose-gc)
if (global.gc) {
  console.log('🗑️  Running garbage collection...');
  global.gc();
} else {
  console.log('⚠️  Garbage collection not available. Run with --expose-gc flag');
}

// 6. Kiểm tra memory sau khi clear
setTimeout(() => {
  const afterClearMemory = showMemoryUsage('After Clearing Array');

  const memoryRecovered = afterArrayMemory.heapUsed - afterClearMemory.heapUsed;
  console.log(`\n♻️  Memory recovered: ${formatMemory(memoryRecovered)}`);

  console.log('\n💡 TIP: Run this script with --expose-gc flag to enable manual GC:');
  console.log('   node --expose-gc basic-memory-usage.js');
}, 1000);

// 7. Theo dõi memory liên tục
console.log('\n📈 Monitoring memory every 2 seconds (will stop after 10 seconds)...');
let count = 0;
const interval = setInterval(() => {
  count++;
  showMemoryUsage(`Monitor #${count}`);

  if (count >= 50) {
    clearInterval(interval);
    console.log('\n✅ Monitoring completed!');
  }
}, 2000);
