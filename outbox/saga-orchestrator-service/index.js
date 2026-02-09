const sagaOrchestrator = require('./saga-orchestrator');

/**
 * Saga Orchestrator Service
 * Service độc lập để điều phối distributed transactions
 */
async function startService() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║    SAGA ORCHESTRATOR SERVICE           ║');
    console.log('║                                        ║');
    console.log('║  Orchestrating distributed sagas       ║');
    console.log('║  Listening to order events             ║');
    console.log('╚════════════════════════════════════════╝');

    try {
        // Khởi tạo saga orchestrator
        await sagaOrchestrator.initialize();

        console.log('\n✓ Saga Orchestrator Service is running');
        console.log('  Waiting for OrderCreated events...\n');

    } catch (error) {
        console.error('Failed to start Saga Orchestrator Service:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start the service
startService();
