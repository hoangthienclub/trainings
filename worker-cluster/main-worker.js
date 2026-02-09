const { Worker } = require('worker_threads');
const path = require('path');

function chayWorker(so) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker-calc.js'), {
      workerData: { so }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

async function main() {
  console.log('Main thread bắt đầu...');
  const [kq1, kq2] = await Promise.all([
    chayWorker(10),
    chayWorker(20)
  ]);
  console.log('Kết quả:', kq1, kq2); // Kết quả: 100 400
  console.log('Main thread xong.');
}

main();
