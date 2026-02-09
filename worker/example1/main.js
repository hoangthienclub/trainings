const express = require('express');
const { Worker } = require('worker_threads');
const app = express();

app.get('/calculate', (req, res) => {
    const num = parseInt(req.query.num) || 40;

    // Tạo một Worker mới để xử lý tác vụ nặng
    const worker = new Worker('./worker.js', {
        workerData: { num: num }
    });

    // Lắng nghe kết quả từ Worker
    worker.on('message', (result) => {
        res.send({ status: 'success', result: result });
    });

    worker.on('error', (err) => {
        res.status(500).send({ status: 'error', message: err.message });
    });

    worker.on('exit', (code) => {
        if (code !== 0) console.error(`Worker dừng với mã lỗi: ${code}`);
    });
});

app.listen(3000, () => console.log('Server chạy tại port 3000'));