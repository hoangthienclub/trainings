const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} đang chạy. Số CPU: ${numCPUs}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} thoát (${code || signal}). Có thể fork lại.`);
  });
} else {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Phản hồi từ worker PID: ${process.pid}\n`);
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} lắng nghe http://localhost:3000`);
  });
}
