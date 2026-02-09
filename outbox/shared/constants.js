// Saga Steps Configuration
const SAGA_STEPS = [
    {
        name: 'RESERVE_PAYMENT',
        topic: 'payment-commands',
        compensate: 'REFUND_PAYMENT'
    },
    {
        name: 'RESERVE_INVENTORY',
        topic: 'inventory-commands',
        compensate: 'RELEASE_INVENTORY'
    },
    {
        name: 'SCHEDULE_SHIPPING',
        topic: 'shipping-commands',
        compensate: 'CANCEL_SHIPPING'
    }
];

// Event Types
const EVENT_TYPES = {
    ORDER_CREATED: 'OrderCreated',
    ORDER_CONFIRMED: 'OrderConfirmed',
    ORDER_FAILED: 'OrderFailed',
    PAYMENT_RESERVED: 'PaymentReserved',
    PAYMENT_REFUNDED: 'PaymentRefunded',
    PAYMENT_FAILED: 'PaymentFailed',
    INVENTORY_RESERVED: 'InventoryReserved',
    INVENTORY_RELEASED: 'InventoryReleased',
    INVENTORY_FAILED: 'InventoryFailed',
    SHIPPING_SCHEDULED: 'ShippingScheduled',
    SHIPPING_CANCELLED: 'ShippingCancelled',
    SHIPPING_FAILED: 'ShippingFailed'
};

// Topics
const TOPICS = {
    ORDER_EVENTS: 'order-events',
    PAYMENT_COMMANDS: 'payment-commands',
    PAYMENT_EVENTS: 'payment-events',
    INVENTORY_COMMANDS: 'inventory-commands',
    INVENTORY_EVENTS: 'inventory-events',
    SHIPPING_COMMANDS: 'shipping-commands',
    SHIPPING_EVENTS: 'shipping-events',
    DEFAULT_EVENTS: 'default-events'
};

// Order Status
const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED'
};

// Saga Status
const SAGA_STATUS = {
    STARTED: 'STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    COMPENSATING: 'COMPENSATING',
    COMPENSATED: 'COMPENSATED',
    FAILED: 'FAILED'
};

// Step Status
const STEP_STATUS = {
    STARTED: 'STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

// Consumer Groups
const CONSUMER_GROUPS = {
    SAGA_ORCHESTRATOR: 'saga-orchestrator-group',
    PAYMENT_SERVICE: 'payment-service-group',
    INVENTORY_SERVICE: 'inventory-service-group',
    SHIPPING_SERVICE: 'shipping-service-group'
};

module.exports = {
    SAGA_STEPS,
    EVENT_TYPES,
    TOPICS,
    ORDER_STATUS,
    SAGA_STATUS,
    STEP_STATUS,
    CONSUMER_GROUPS
};
