const outboxRepository = require('../order-service/outbox-repository');
const messageBroker = require('../shared/message-broker');
const { EVENT_TYPES, TOPICS } = require('../shared/constants');


/**
 * Outbox Relay Service
 * 
 * Nhiệm vụ:
 * 1. Polling outbox table để lấy events chưa được publish
 * 2. Publish events lên message broker
 * 3. Đánh dấu events đã được publish
 * 
 * Pattern này đảm bảo:
 * - At-least-once delivery
 * - Eventual consistency
 * - Decoupling giữa database transaction và message publishing
 */
class OutboxRelay {
    constructor() {
        this.isRunning = false;
        this.pollingInterval = 2000; // 2 seconds
        this.batchSize = 100;
    }

    async start() {
        console.log('Starting Outbox Relay...');

        // Initialize message broker
        await messageBroker.initProducer();

        this.isRunning = true;
        this.poll();

        console.log(`
    ╔════════════════════════════════════════╗
    ║         OUTBOX RELAY SERVICE           ║
    ║                                        ║
    ║  Polling interval: ${this.pollingInterval}ms              ║
    ║  Batch size: ${this.batchSize}                     ║
    ║                                        ║
    ║  Status: RUNNING                       ║
    ╚════════════════════════════════════════╝
    `);
    }

    async poll() {
        while (this.isRunning) {
            try {
                await this.processOutboxEvents();
            } catch (error) {
                console.error('Error processing outbox events:', error);
            }

            // Đợi trước khi poll tiếp
            await this.sleep(this.pollingInterval);
        }
    }

    async processOutboxEvents() {
        // 1. Lấy events chưa được process
        const events = await outboxRepository.getUnprocessedEvents(this.batchSize);

        if (events.length === 0) {
            return;
        }

        console.log(`Found ${events.length} unprocessed events`);

        // 2. Process từng event
        for (const event of events) {
            try {
                await this.publishEvent(event);

                // 3. Đánh dấu đã process
                await outboxRepository.markAsProcessed(event.id);

                console.log(`✓ Event ${event.id} published and marked as processed`);
            } catch (error) {
                console.error(`✗ Failed to publish event ${event.id}:`, error.message);
                // Trong production, cần implement retry logic với exponential backoff
                // hoặc move event vào dead letter queue sau X lần retry
            }
        }
    }

    async publishEvent(event) {
        // Map event type to topic
        const topic = this.getTopicForEvent(event.event_type);

        const message = {
            key: event.aggregate_id,
            value: {
                eventId: event.id,
                eventType: event.event_type,
                aggregateType: event.aggregate_type,
                aggregateId: event.aggregate_id,
                payload: event.payload,
                timestamp: event.created_at
            }
        };

        await messageBroker.publish(topic, message);
    }

    getTopicForEvent(eventType) {
        // Map event types to topics using shared constants
        const topicMap = {
            [EVENT_TYPES.ORDER_CREATED]: TOPICS.ORDER_EVENTS,
            [EVENT_TYPES.ORDER_CONFIRMED]: TOPICS.ORDER_EVENTS,
            [EVENT_TYPES.ORDER_FAILED]: TOPICS.ORDER_EVENTS,
            [EVENT_TYPES.PAYMENT_RESERVED]: TOPICS.PAYMENT_EVENTS,
            [EVENT_TYPES.PAYMENT_REFUNDED]: TOPICS.PAYMENT_EVENTS,
            [EVENT_TYPES.INVENTORY_RESERVED]: TOPICS.INVENTORY_EVENTS,
            [EVENT_TYPES.INVENTORY_RELEASED]: TOPICS.INVENTORY_EVENTS,
            [EVENT_TYPES.SHIPPING_SCHEDULED]: TOPICS.SHIPPING_EVENTS,
            [EVENT_TYPES.SHIPPING_CANCELLED]: TOPICS.SHIPPING_EVENTS
        };

        return topicMap[eventType] || TOPICS.DEFAULT_EVENTS;
    }


    async stop() {
        console.log('Stopping Outbox Relay...');
        this.isRunning = false;
        await messageBroker.disconnect();
        console.log('Outbox Relay stopped');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Start the relay
const relay = new OutboxRelay();
relay.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    await relay.stop();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received');
    await relay.stop();
    process.exit(0);
});
