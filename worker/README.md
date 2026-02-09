# Node.js Cluster Example

This example demonstrates how to use Node.js's built-in `cluster` module to create a multi-process application that can take advantage of multiple CPU cores.

## What is Cluster?

The `cluster` module allows you to create child processes (workers) that share server ports. This enables you to:
- Utilize all CPU cores on your machine
- Improve application performance and throughput
- Handle more concurrent requests
- Improve fault tolerance (if one worker crashes, others continue)

## Files

- `cluster-example.js` - HTTP server cluster implementation
- `worker-calculation.js` - Worker calculation example (master sends tasks, workers calculate and return results)
- `load-test.js` - Simple load testing script
- `package.json` - Project configuration

## How to Run

1. Start the cluster server:
   ```bash
   npm start
   # or
   node cluster-example.js
   ```

2. In another terminal, run the load test:
   ```bash
   npm test
   # or
   node load-test.js
   ```

3. Or test manually with curl:
   ```bash
   curl http://localhost:3000
   ```

## Worker Calculation Example

This example demonstrates how to use workers to perform CPU-intensive calculations and return results to the main thread:

```bash
npm run calculate
# or
node worker-calculation.js
```

This example shows:
- Master process distributing calculation tasks to workers
- Workers performing CPU-intensive calculations (factorial, sum, primes, fibonacci)
- Workers sending results back to master via IPC messaging
- Master collecting and processing all results

## How It Works

1. **Master Process**: 
   - Creates worker processes (one per CPU core)
   - Manages worker lifecycle
   - Restarts workers if they crash
   - Handles graceful shutdown

2. **Worker Processes**:
   - Each worker runs the HTTP server
   - Workers share port 3000
   - The OS distributes incoming connections across workers
   - Each request is handled by one worker

## Key Features Demonstrated

- ✅ Forking workers based on CPU count
- ✅ Worker lifecycle management
- ✅ Automatic worker restart on crash
- ✅ Graceful shutdown handling
- ✅ Shared TCP port across workers
- ✅ Worker identification in responses

## Notes

- The cluster module uses `child_process.fork()` under the hood
- Workers share the same server port (OS handles load balancing)
- Each worker is a separate process with its own memory space
- Communication between master and workers uses IPC (Inter-Process Communication)

