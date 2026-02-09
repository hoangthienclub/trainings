// QUAN TRỌNG: Phải import tracing TRƯỚC tất cả các module khác
const { initTracing } = require('../shared/tracing');
initTracing('order-service');

const express = require('express');
const { trace, SpanStatusCode } = require('@opentelemetry/api');

const app = express();
const PORT = 3002;

app.use(express.json());

// Mock database
const orders = {
    '1': [
        { id: 'ORD-001', userId: '1', product: 'Laptop Dell XPS 13', amount: 25000000, status: 'delivered' },
        { id: 'ORD-002', userId: '1', product: 'Mouse Logitech MX Master', amount: 2000000, status: 'shipped' },
    ],
    '2': [
        { id: 'ORD-003', userId: '2', product: 'iPhone 15 Pro', amount: 30000000, status: 'processing' },
    ],
    '3': [
        { id: 'ORD-004', userId: '3', product: 'Samsung Monitor 27"', amount: 8000000, status: 'delivered' },
        { id: 'ORD-005', userId: '3', product: 'Mechanical Keyboard', amount: 3000000, status: 'delivered' },
        { id: 'ORD-006', userId: '3', product: 'Webcam Logitech C920', amount: 2500000, status: 'shipped' },
    ],
};

/**
 * Simulate database query với custom span
 */
async function getOrdersFromDB(userId) {
    const tracer = trace.getTracer('order-service');
    const span = tracer.startSpan('db.query.get_orders');

    try {
        span.setAttribute('db.system', 'mongodb');
        span.setAttribute('db.operation', 'find');
        span.setAttribute('db.statement', `db.orders.find({ userId: "${userId}" })`);

        // Simulate database latency
        await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 120));

        const userOrders = orders[userId] || [];

        span.addEvent('Orders retrieved from database', {
            'orders.count': userOrders.length,
        });
        span.setAttribute('orders.count', userOrders.length);
        span.setStatus({ code: SpanStatusCode.OK });

        return userOrders;
    } catch (error) {
        span.recordException(error);
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
        });
        throw error;
    } finally {
        span.end();
    }
}

/**
 * Calculate total amount với custom span
 */
async function calculateTotalAmount(orders) {
    const tracer = trace.getTracer('order-service');
    const span = tracer.startSpan('calculate-total-amount');

    try {
        span.setAttribute('orders.count', orders.length);

        // Simulate calculation time
        await new Promise(resolve => setTimeout(resolve, 20));

        const total = orders.reduce((sum, order) => sum + order.amount, 0);

        span.setAttribute('total.amount', total);
        span.addEvent('Total amount calculated', {
            'total.amount': total,
        });
        span.setStatus({ code: SpanStatusCode.OK });

        return total;
    } catch (error) {
        span.recordException(error);
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
        });
        throw error;
    } finally {
        span.end();
    }
}

/**
 * Endpoint để lấy orders của user
 */
app.get('/orders/:userId', async (req, res) => {
    const tracer = trace.getTracer('order-service');
    const span = tracer.startSpan('handle-get-orders');

    try {
        const userId = req.params.userId;
        console.log(`📦 Getting orders for user ${userId}`);

        span.setAttribute('user.id', userId);
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/orders/:userId');

        // Query database
        const userOrders = await getOrdersFromDB(userId);

        // Calculate total
        const totalAmount = await calculateTotalAmount(userOrders);

        const result = {
            userId,
            orders: userOrders,
            totalOrders: userOrders.length,
            totalAmount,
        };

        span.addEvent('Returning orders data', {
            'orders.count': userOrders.length,
            'total.amount': totalAmount,
        });
        span.setStatus({ code: SpanStatusCode.OK });

        res.json(result);
    } catch (error) {
        span.recordException(error);
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
        });

        console.error('❌ Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        span.end();
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'order-service' });
});

app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
});
