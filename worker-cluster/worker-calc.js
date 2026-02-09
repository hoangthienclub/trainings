const { parentPort, workerData } = require('worker_threads');

// CPU-intensive: tính bình phương
const so = workerData.so;
const ketQua = so * so;

parentPort.postMessage(ketQua);
