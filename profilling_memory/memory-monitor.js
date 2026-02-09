/**
 * VÍ DỤ 5: CONTINUOUS MEMORY MONITORING
 * 
 * Theo dõi memory liên tục và cảnh báo khi vượt ngưỡng
 * Hữu ích cho production monitoring
 */

const v8 = require('v8');
const EventEmitter = require('events');

console.log('=== CONTINUOUS MEMORY MONITORING ===\n');

// Memory Monitor Class
class MemoryMonitor extends EventEmitter {
    constructor(options = {}) {
        super();

        this.interval = options.interval || 5000; // Check every 5 seconds
        this.heapThreshold = options.heapThreshold || 80; // Alert at 80%
        this.rssThreshold = options.rssThreshold || 500; // Alert at 500MB
        this.timer = null;
        this.history = [];
        this.maxHistory = options.maxHistory || 20;
        this.alertCooldown = options.alertCooldown || 30000; // 30 seconds
        this.lastAlertTime = 0;
    }

    start() {
        console.log('🚀 Starting memory monitor...');
        console.log(`   Interval: ${this.interval}ms`);
        console.log(`   Heap threshold: ${this.heapThreshold}%`);
        console.log(`   RSS threshold: ${this.rssThreshold}MB\n`);

        this.timer = setInterval(() => {
            this.check();
        }, this.interval);

        // Initial check
        this.check();
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('\n🛑 Memory monitor stopped');
        }
    }

    check() {
        const memUsage = process.memoryUsage();
        const heapStats = v8.getHeapStatistics();

        const stats = {
            timestamp: new Date(),
            rss: memUsage.rss,
            heapTotal: memUsage.heapTotal,
            heapUsed: memUsage.heapUsed,
            external: memUsage.external,
            heapLimit: heapStats.heap_size_limit,
            heapPercentage: (memUsage.heapUsed / heapStats.heap_size_limit) * 100
        };

        // Add to history
        this.history.push(stats);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Emit stats
        this.emit('stats', stats);

        // Check thresholds
        this.checkThresholds(stats);

        // Display stats
        this.displayStats(stats);
    }

    checkThresholds(stats) {
        const now = Date.now();
        const canAlert = (now - this.lastAlertTime) > this.alertCooldown;

        // Check heap percentage
        if (stats.heapPercentage > this.heapThreshold) {
            if (canAlert) {
                this.emit('alert', {
                    type: 'heap',
                    message: `Heap usage is ${stats.heapPercentage.toFixed(2)}% (threshold: ${this.heapThreshold}%)`,
                    stats
                });
                this.lastAlertTime = now;
            }
        }

        // Check RSS
        const rssMB = stats.rss / 1024 / 1024;
        if (rssMB > this.rssThreshold) {
            if (canAlert) {
                this.emit('alert', {
                    type: 'rss',
                    message: `RSS is ${rssMB.toFixed(2)}MB (threshold: ${this.rssThreshold}MB)`,
                    stats
                });
                this.lastAlertTime = now;
            }
        }
    }

    displayStats(stats) {
        const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

        console.log(`[${stats.timestamp.toLocaleTimeString()}]`);
        console.log(`  RSS: ${formatMB(stats.rss)}MB | Heap: ${formatMB(stats.heapUsed)}/${formatMB(stats.heapLimit)}MB (${stats.heapPercentage.toFixed(2)}%)`);

        // Show trend if we have history
        if (this.history.length >= 2) {
            const prev = this.history[this.history.length - 2];
            const heapDiff = stats.heapUsed - prev.heapUsed;
            const trend = heapDiff > 0 ? '📈' : heapDiff < 0 ? '📉' : '➡️';
            console.log(`  Trend: ${trend} ${formatMB(Math.abs(heapDiff))}MB`);
        }
    }

    getStats() {
        return {
            current: this.history[this.history.length - 1],
            history: this.history,
            average: this.calculateAverage()
        };
    }

    calculateAverage() {
        if (this.history.length === 0) return null;

        const sum = this.history.reduce((acc, stat) => ({
            rss: acc.rss + stat.rss,
            heapUsed: acc.heapUsed + stat.heapUsed,
            heapPercentage: acc.heapPercentage + stat.heapPercentage
        }), { rss: 0, heapUsed: 0, heapPercentage: 0 });

        const count = this.history.length;
        return {
            rss: sum.rss / count,
            heapUsed: sum.heapUsed / count,
            heapPercentage: sum.heapPercentage / count
        };
    }
}

// ===== DEMO: Sử dụng Memory Monitor =====

const monitor = new MemoryMonitor({
    interval: 2000,        // Check every 2 seconds
    heapThreshold: 60,     // Alert at 60% (thấp để demo dễ trigger)
    rssThreshold: 100,     // Alert at 100MB
    maxHistory: 10
});

// Listen to events
monitor.on('stats', (stats) => {
    // Có thể log vào database, send metrics, etc.
});

monitor.on('alert', (alert) => {
    console.log(`\n⚠️  ALERT [${alert.type.toUpperCase()}]: ${alert.message}\n`);

    // Trong production, có thể:
    // - Send notification
    // - Log to monitoring service
    // - Trigger auto-scaling
    // - Create heap snapshot for analysis
});

// Start monitoring
monitor.start();

// ===== Simulate memory usage =====
console.log('\n🔄 Simulating application workload...\n');

const data = [];
let counter = 0;

const workloadInterval = setInterval(() => {
    counter++;

    // Simulate creating data
    for (let i = 0; i < 10000; i++) {
        data.push({
            id: counter * 10000 + i,
            data: new Array(50).fill('x'.repeat(20)),
            timestamp: new Date()
        });
    }

    console.log(`📦 Created batch ${counter} (${data.length.toLocaleString()} total objects)`);

    // Occasionally clear some data (simulate cleanup)
    if (counter % 3 === 0) {
        const removed = data.splice(0, 5000);
        console.log(`🗑️  Cleaned up ${removed.length.toLocaleString()} objects`);
    }

    // Stop after 10 batches
    if (counter >= 10) {
        clearInterval(workloadInterval);
        console.log('\n✅ Workload simulation completed');

        // Show summary after a delay
        setTimeout(() => {
            console.log('\n=== MONITORING SUMMARY ===');
            const stats = monitor.getStats();
            const avg = stats.average;

            if (avg) {
                console.log(`Average RSS: ${(avg.rss / 1024 / 1024).toFixed(2)}MB`);
                console.log(`Average Heap Used: ${(avg.heapUsed / 1024 / 1024).toFixed(2)}MB`);
                console.log(`Average Heap %: ${avg.heapPercentage.toFixed(2)}%`);
            }

            console.log(`\nTotal measurements: ${stats.history.length}`);

            // Stop monitor
            setTimeout(() => {
                monitor.stop();

                console.log('\n💡 In production, you can:');
                console.log('   - Send metrics to monitoring services (Prometheus, DataDog, etc.)');
                console.log('   - Set up alerts via email/Slack/PagerDuty');
                console.log('   - Auto-create heap snapshots when threshold exceeded');
                console.log('   - Trigger auto-scaling based on memory usage');
                console.log('   - Log to time-series database for trend analysis');
            }, 2000);
        }, 3000);
    }
}, 3000);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nReceived SIGINT, shutting down...');
    clearInterval(workloadInterval);
    monitor.stop();
    process.exit(0);
});
