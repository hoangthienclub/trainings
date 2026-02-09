const messageBroker = require('../shared/message-broker');
const { TOPICS, CONSUMER_GROUPS, EVENT_TYPES } = require('../shared/constants');


/**
 * Inventory Service
 * Xử lý các commands liên quan đến inventory trong saga
 */
class InventoryService {
    constructor() {
        this.reservations = new Map(); // In-memory storage cho demo
        this.inventory = new Map([
            ['ITEM-001', { sku: 'ITEM-001', quantity: 100 }],
            ['ITEM-002', { sku: 'ITEM-002', quantity: 50 }],
            ['ITEM-003', { sku: 'ITEM-003', quantity: 200 }]
        ]);
    }

    async start() {
        console.log('Starting Inventory Service...');

        // Subscribe to inventory commands
        await messageBroker.subscribe(
            'inventory-commands',
            'inventory-service-group',
            this.handleCommand.bind(this)
        );

        console.log(`
    ╔════════════════════════════════════════╗
    ║        INVENTORY SERVICE               ║
    ║                                        ║
    ║  Listening to: inventory-commands      ║
    ║  Status: RUNNING                       ║
    ╚════════════════════════════════════════╝
    `);
    }

    async handleCommand(message) {
        const { sagaId, orderId, command, data } = message;

        console.log(`[Inventory Service] Received command: ${command} for order ${orderId}`);

        try {
            switch (command) {
                case 'RESERVE_INVENTORY':
                    await this.reserveInventory(sagaId, orderId, data);
                    break;

                case 'RELEASE_INVENTORY':
                    await this.releaseInventory(sagaId, orderId);
                    break;

                default:
                    console.log(`Unknown command: ${command}`);
            }
        } catch (error) {
            console.error(`Error handling command ${command}:`, error);
            await this.publishFailure(sagaId, orderId, command, error);
        }
    }

    async reserveInventory(sagaId, orderId, data) {
        console.log(`[Inventory Service] Reserving inventory for order ${orderId}`);

        // Simulate inventory check
        await this.sleep(300);

        const items = data.items || [];
        const reservedItems = [];

        // Check if all items are available
        for (const item of items) {
            const stock = this.inventory.get(item.sku);

            if (!stock || stock.quantity < item.quantity) {
                throw new Error(`Insufficient inventory for ${item.sku}`);
            }

            reservedItems.push(item);
        }

        // Reserve items
        for (const item of reservedItems) {
            const stock = this.inventory.get(item.sku);
            stock.quantity -= item.quantity;
        }

        this.reservations.set(orderId, {
            orderId,
            items: reservedItems,
            status: 'RESERVED',
            reservedAt: new Date()
        });

        console.log(`✓ Inventory reserved for order ${orderId}:`, reservedItems);

        // Publish success event
        await messageBroker.publish('inventory-events', {
            value: {
                sagaId,
                orderId,
                eventType: 'InventoryReserved',
                data: { items: reservedItems }
            }
        });
    }

    async releaseInventory(sagaId, orderId) {
        console.log(`[Inventory Service] Releasing inventory for order ${orderId}`);

        const reservation = this.reservations.get(orderId);

        if (reservation) {
            // Release items back to inventory
            for (const item of reservation.items) {
                const stock = this.inventory.get(item.sku);
                if (stock) {
                    stock.quantity += item.quantity;
                }
            }

            this.reservations.delete(orderId);

            console.log(`✓ Inventory released for order ${orderId}`);

            // Publish release event
            await messageBroker.publish('inventory-events', {
                value: {
                    sagaId,
                    orderId,
                    eventType: 'InventoryReleased',
                    data: { items: reservation.items }
                }
            });
        } else {
            console.log(`No reservation found for order ${orderId}`);
        }
    }

    async publishFailure(sagaId, orderId, command, error) {
        await messageBroker.publish('inventory-events', {
            value: {
                sagaId,
                orderId,
                eventType: 'InventoryFailed',
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
const service = new InventoryService();
service.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    await messageBroker.disconnect();
    process.exit(0);
});
