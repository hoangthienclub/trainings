const { parentPort, workerData } = require('worker_threads');

// Hàm tính toán nặng (CPU intensive)
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Nhận dữ liệu từ luồng chính, tính toán và gửi kết quả về
const result = fibonacci(workerData.num);
parentPort.postMessage(result);