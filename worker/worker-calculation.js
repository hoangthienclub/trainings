const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  // Master colors
  master: '\x1b[36m', // Cyan
  masterBright: '\x1b[96m', // Bright Cyan
  // Worker colors
  worker: '\x1b[32m', // Green
  workerBright: '\x1b[92m', // Bright Green
  workerYellow: '\x1b[33m', // Yellow
  // Other colors
  error: '\x1b[31m', // Red
  success: '\x1b[32m', // Green
  info: '\x1b[34m', // Blue
  result: '\x1b[35m', // Magenta
  highlight: '\x1b[93m', // Bright Yellow
};

// Helper functions for colored logging
const logMaster = (message) => {
  console.log(`${colors.masterBright}[MASTER]${colors.reset} ${colors.master}${message}${colors.reset}`);
};

const logWorker = (pid, message) => {
  console.log(`${colors.workerBright}[WORKER ${pid}]${colors.reset} ${colors.worker}${message}${colors.reset}`);
};

const logError = (message) => {
  console.error(`${colors.error}${colors.bright}[ERROR]${colors.reset} ${colors.error}${message}${colors.reset}`);
};

const logResult = (message) => {
  console.log(`${colors.result}${message}${colors.reset}`);
};

const logInfo = (message) => {
  console.log(`${colors.info}${message}${colors.reset}`);
};

if (cluster.isMaster) {
  logMaster(`Master process ${process.pid} is running`);
  logMaster(`Starting ${numCPUs} workers for calculations...\n`);

  const workers = [];
  let completedWorkers = 0;
  const results = [];

  // Fork workers
  for (let i = 0; i < 4; i++) {
    const worker = cluster.fork();
    workers.push(worker);
    
    // Listen for messages from worker
    worker.on('message', (message) => {
      if (message.type === 'ready') {
        logWorker(worker.process.pid, `is ready`);
      } else if (message.type === 'result') {
        logWorker(worker.process.pid, `completed: ${message.description}`);
        results.push({
          workerId: worker.process.pid,
          result: message.result,
          description: message.description,
          calculationTime: message.calculationTime
        });
        completedWorkers++;
        
        // When all workers complete, process results
        if (completedWorkers === workers.length) {
          processResults(results);
          // Gracefully shutdown workers
          workers.forEach(w => w.kill());
        }
      } else if (message.type === 'error') {
        logError(`Worker ${worker.process.pid} error: ${message.error}`);
        completedWorkers++;
        if (completedWorkers === workers.length) {
          workers.forEach(w => w.kill());
        }
      }
    });

    worker.on('exit', (code) => {
      logWorker(worker.process.pid, `exited with code ${code}`);
    });
  }

  // Wait a bit for all workers to be ready, then send tasks
  setTimeout(() => {
    logMaster('\n--- Distributing calculation tasks ---\n');
    
    // Example 1: Calculate factorial
    workers[0].send({
      type: 'calculate',
      task: 'factorial',
      data: { number: 20 }
    });

    // Example 2: Calculate sum of array
    if (workers[1]) {
      const largeArray = Array.from({ length: 10000000 }, (_, i) => i + 1);
      workers[1].send({
        type: 'calculate',
        task: 'sum',
        data: { array: largeArray }
      });
    }

    // Example 3: Calculate prime numbers
    if (workers[2]) {
      workers[2].send({
        type: 'calculate',
        task: 'primes',
        data: { limit: 1000000 }
      });
    }

    // Example 4: Calculate Fibonacci
    if (workers[3]) {
      workers[3].send({
        type: 'calculate',
        task: 'fibonacci',
        data: { n: 40 }
      });
    }

    // If we have more workers, assign more tasks
    for (let i = 4; i < workers.length; i++) {
      workers[i].send({
        type: 'calculate',
        task: 'sum',
        data: { array: Array.from({ length: 5000000 }, (_, i) => Math.random() * 100) }
      });
    }
  }, 1000);

  function processResults(results) {
    logMaster('\n--- All Calculations Complete ---\n');
    
    let totalCalculationTime = 0;
    results.forEach((result, index) => {
      logResult(`Result ${index + 1}:`);
      logInfo(`  Worker PID: ${result.workerId}`);
      logInfo(`  Description: ${result.description}`);
      logInfo(`  Calculation Time: ${colors.highlight}${result.calculationTime}ms${colors.reset}`);
      logInfo(`  Result: ${JSON.stringify(result.result).substring(0, 100)}${JSON.stringify(result.result).length > 100 ? '...' : ''}`);
      console.log('');
      totalCalculationTime += result.calculationTime;
    });

    logMaster(`Total calculation time: ${colors.highlight}${totalCalculationTime}ms${colors.reset}`);
    logMaster(`Average time per worker: ${colors.highlight}${(totalCalculationTime / results.length).toFixed(2)}ms${colors.reset}`);
    
    // Example: Use results for further processing
    const sumResults = results.filter(r => r.description.includes('Sum'));
    if (sumResults.length > 0) {
      const totalSum = sumResults.reduce((acc, r) => acc + r.result, 0);
      logResult(`\nCombined sum from all sum calculations: ${colors.highlight}${totalSum}${colors.reset}`);
    }
  }

} else {
  // Worker process
  logWorker(process.pid, `started`);

  // Send ready message to master
  process.send({ type: 'ready' });

  // Listen for messages from master
  process.on('message', (message) => {
    if (message.type === 'calculate') {
      const startTime = Date.now();
      let result;
      let description;

      try {
        switch (message.task) {
          case 'factorial':
            result = calculateFactorial(message.data.number);
            description = `Factorial of ${message.data.number}`;
            break;

          case 'sum':
            result = calculateSum(message.data.array);
            description = `Sum of array (${message.data.array.length} elements)`;
            break;

          case 'primes':
            result = calculatePrimes(message.data.limit);
            description = `Prime numbers up to ${message.data.limit} (found ${result.length} primes)`;
            break;

          case 'fibonacci':
            result = calculateFibonacci(message.data.n);
            description = `Fibonacci(${message.data.n})`;
            break;

          default:
            throw new Error(`Unknown task: ${message.task}`);
        }

        const calculationTime = Date.now() - startTime;

        // Send result back to master
        process.send({
          type: 'result',
          result: result,
          description: description,
          calculationTime: calculationTime
        });
      } catch (error) {
        process.send({
          type: 'error',
          error: error.message
        });
      }
    }
  });
}

// Calculation functions
function calculateFactorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function calculateSum(array) {
  return array.reduce((sum, num) => sum + num, 0);
}

function calculatePrimes(limit) {
  const primes = [];
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }

  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) {
      primes.push(i);
    }
  }

  return primes;
}

function calculateFibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}


