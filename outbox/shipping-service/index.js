const messageBroker = require('../shared/message-broker');
const { TOPICS, CONSUMER_GROUPS, EVENT_TYPES } = require('../shared/constants');


/**
 * Shipping Service
 * Xử lý các commands liên quan đến shipping trong saga
 */
class ShippingService {
    constructor() {
        this.shipments = new Map(); // In-memory storage cho demo
    }

    async start() {
        console.log('Starting Shipping Service...');

        // Subscribe to shipping commands
        await messageBroker.subscribe(
            'shipping-commands',
            'shipping-service-group',
            this.handleCommand.bind(this)
        );

        console.log(`
    ╔════════════════════════════════════════╗
    ║         SHIPPING SERVICE               ║
    ║                                        ║
    ║  Listening to: shipping-commands       ║
    ║  Status: RUNNING                       ║
    ╚════════════════════════════════════════╝
    `);
    }

    async handleCommand(message) {
        const { sagaId, orderId, command, data } = message;

        console.log(`[Shipping Service] Received command: ${command} for order ${orderId}`);

        try {
            switch (command) {
                case 'SCHEDULE_SHIPPING':
                    await this.scheduleShipping(sagaId, orderId, data);
                    break;

                case 'CANCEL_SHIPPING':
                    await this.cancelShipping(sagaId, orderId);
                    break;

                default:
                    console.log(`Unknown command: ${command}`);
            }
        } catch (error) {
            console.error(`Error handling command ${command}:`, error);
            await this.publishFailure(sagaId, orderId, command, error);
        }
    }

    async scheduleShipping(sagaId, orderId, data) {
        console.log(`[Shipping Service] Scheduling shipping for order ${orderId}`);

        // Simulate shipping scheduling
        await this.sleep(400);

        const shipment = {
            orderId,
            customerId: data.customerId,
            items: data.items || [],
            status: 'SCHEDULED',
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            scheduledAt: new Date()
        };

        this.shipments.set(orderId, shipment);

        console.log(`✓ Shipping scheduled for order ${orderId}`);
        console.log(`  Estimated delivery: ${shipment.estimatedDelivery.toISOString()}`);

        // Publish success event
        await messageBroker.publish('shipping-events', {
            value: {
                sagaId,
                orderId,
                eventType: 'ShippingScheduled',
                data: shipment
            }
        });
    }

    async cancelShipping(sagaId, orderId) {
        console.log(`[Shipping Service] Cancelling shipping for order ${orderId}`);

        const shipment = this.shipments.get(orderId);

        if (shipment) {
            shipment.status = 'CANCELLED';
            shipment.cancelledAt = new Date();

            console.log(`✓ Shipping cancelled for order ${orderId}`);

            // Publish cancellation event
            await messageBroker.publish('shipping-events', {
                value: {
                    sagaId,
                    orderId,
                    eventType: 'ShippingCancelled',
                    data: shipment
                }
            });
        } else {
            console.log(`No shipment found for order ${orderId}`);
        }
    }

    async publishFailure(sagaId, orderId, command, error) {
        await messageBroker.publish('shipping-events', {
            value: {
                sagaId,
                orderId,
                eventType: 'ShippingFailed',
                command,
                error: error.message
            }
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Start the service
const service = new ShippingService();
service.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    await messageBroker.disconnect();
    process.exit(0);
});
