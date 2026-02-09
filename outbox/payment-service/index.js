const messageBroker = require('../shared/message-broker');
const { TOPICS, CONSUMER_GROUPS, EVENT_TYPES } = require('../shared/constants');


/**
 * Payment Service
 * Xử lý các commands liên quan đến payment trong saga
 */
class PaymentService {
    constructor() {
        this.payments = new Map(); // In-memory storage cho demo
    }

    async start() {
        console.log('Starting Payment Service...');

        // Subscribe to payment commands
        await messageBroker.subscribe(
            TOPICS.PAYMENT_COMMANDS,
            CONSUMER_GROUPS.PAYMENT_SERVICE,
            this.handleCommand.bind(this)
        );

        console.log(`
    ╔════════════════════════════════════════╗
    ║         PAYMENT SERVICE                ║
    ║                                        ║
    ║  Listening to: ${TOPICS.PAYMENT_COMMANDS}        ║
    ║  Status: RUNNING                       ║
    ╚════════════════════════════════════════╝
    `);
    }

    async handleCommand(message) {
        const { sagaId, orderId, command, data } = message;

        console.log(`[Payment Service] Received command: ${command} for order ${orderId}`);

        try {
            switch (command) {
                case 'RESERVE_PAYMENT':
                    await this.reservePayment(sagaId, orderId, data);
                    break;

                case 'REFUND_PAYMENT':
                    await this.refundPayment(sagaId, orderId);
                    break;

                default:
                    console.log(`Unknown command: ${command}`);
            }
        } catch (error) {
            console.error(`Error handling command ${command}:`, error);
            // Publish failure event
            await this.publishFailure(sagaId, orderId, command, error);
        }
    }

    async reservePayment(sagaId, orderId, data) {
        console.log(`[Payment Service] Reserving payment for order ${orderId}`);

        // Simulate payment processing
        await this.sleep(500);

        // Giả lập 95% success rate
        if (Math.random() > 0.05) {
            const payment = {
                orderId,
                amount: data.totalAmount,
                status: 'RESERVED',
                reservedAt: new Date()
            };

            this.payments.set(orderId, payment);

            console.log(`✓ Payment reserved for order ${orderId}: $${data.totalAmount}`);

            // Publish success event
            await messageBroker.publish(TOPICS.PAYMENT_EVENTS, {
                value: {
                    sagaId,
                    orderId,
                    eventType: EVENT_TYPES.PAYMENT_RESERVED,
                    data: payment
                }
            });
        } else {
            throw new Error('Payment gateway unavailable');
        }
    }

    async refundPayment(sagaId, orderId) {
        console.log(`[Payment Service] Refunding payment for order ${orderId}`);

        const payment = this.payments.get(orderId);

        if (payment) {
            payment.status = 'REFUNDED';
            payment.refundedAt = new Date();

            console.log(`✓ Payment refunded for order ${orderId}: $${payment.amount}`);

            // Publish refund event
            await messageBroker.publish(TOPICS.PAYMENT_EVENTS, {
                value: {
                    sagaId,
                    orderId,
                    eventType: EVENT_TYPES.PAYMENT_REFUNDED,
                    data: payment
                }
            });
        } else {
            console.log(`No payment found for order ${orderId}`);
        }
    }

    async publishFailure(sagaId, orderId, command, error) {
        await messageBroker.publish(TOPICS.PAYMENT_EVENTS, {
            value: {
                sagaId,
                orderId,
                eventType: EVENT_TYPES.PAYMENT_FAILED,
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
const service = new PaymentService();
service.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    await messageBroker.disconnect();
    process.exit(0);
});
