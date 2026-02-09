const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} started`);
  }

  // Listen for worker online event
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  // Listen for worker exit event
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
    console.log('Starting a new worker...');
    cluster.fork();
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down gracefully...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });

} else {
  // Workers can share any TCP connection
  // In this case, it's an HTTP server
  http.createServer((req, res) => {
    const startTime = Date.now();
    
    // Simulate some work
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }

    const duration = Date.now() - startTime;
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from worker ${process.pid}!\n` +
            `Request processed in ${duration}ms\n` +
            `Total workers: ${Object.keys(cluster.workers || {}).length}\n`);
  }).listen(3000);

  console.log(`Worker ${process.pid} started and listening on port 3000`);
}

