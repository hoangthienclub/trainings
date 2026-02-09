const http = require('http');

// Simple load test script to demonstrate cluster benefits
const numRequests = 20;
let completed = 0;
let totalTime = 0;

console.log(`Sending ${numRequests} concurrent requests...\n`);

const startTime = Date.now();

for (let i = 0; i < numRequests; i++) {
  const requestStart = Date.now();
  
  http.get('http://localhost:3000', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const requestTime = Date.now() - requestStart;
      totalTime += requestTime;
      completed++;
      
      console.log(`Request ${completed}: ${data.trim()} (${requestTime}ms)`);
      
      if (completed === numRequests) {
        const avgTime = totalTime / numRequests;
        const totalTimeElapsed = Date.now() - startTime;
        console.log(`\n--- Results ---`);
        console.log(`Total requests: ${numRequests}`);
        console.log(`Average response time: ${avgTime.toFixed(2)}ms`);
        console.log(`Total time: ${totalTimeElapsed}ms`);
        process.exit(0);
      }
    });
  }).on('error', (err) => {
    console.error(`Request error: ${err.message}`);
    completed++;
    if (completed === numRequests) {
      process.exit(1);
    }
  });
}

