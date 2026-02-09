const express = require('express');
const bodyParser = require('body-parser');
const db = require('../shared/database');
const orderRepository = require('./order-repository');
const outboxRepository = require('./outbox-repository');


const app = express();
app.use(bodyParser.json());

/**
 * Tạo order mới
 * Sử dụng Outbox Pattern để đảm bảo atomicity
 */
app.post('/orders', async (req, res) => {
    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        const orderData = {
            customerId: req.body.customerId,
            totalAmount: req.body.totalAmount,
            items: req.body.items
        };

        // 1. Tạo order trong database
        const order = await orderRepository.createOrder(orderData, client);
        console.log('Order created:', order.id);

        // 2. Lưu event vào outbox table (trong cùng transaction)
        // Đây là điểm quan trọng của Outbox Pattern
        const event = {
            aggregateType: 'Order',
            aggregateId: order.id,
            eventType: 'OrderCreated',
            payload: {
                orderId: order.id,
                customerId: order.customer_id,
                totalAmount: order.total_amount,
                items: orderData.items
            }
        };

        await outboxRepository.saveEvent(event, client);
        console.log('Event saved to outbox');

        // 3. Commit transaction
        await client.query('COMMIT');

        // 4. Commit transaction
        // Event sẽ được Outbox Relay đọc và publish lên Kafka
        // Saga Orchestrator sẽ lắng nghe OrderCreated event và bắt đầu saga
        // Đây là quy trình đúng của Outbox Pattern - đảm bảo eventual consistency


        res.status(201).json({
            success: true,
            order: {
                id: order.id,
                status: order.status,
                customerId: order.customer_id,
                totalAmount: order.total_amount
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        client.release();
    }
});

/**
 * Lấy thông tin order
 */
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await orderRepository.getOrder(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Lấy tất cả orders
 */
app.get('/orders', async (req, res) => {
    try {
        const orders = await orderRepository.getAllOrders();
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
    console.log(`
  ╔════════════════════════════════════════╗
  ║      ORDER SERVICE (Port ${PORT})       ║
  ║                                        ║
  ║  POST /orders - Create new order       ║
  ║  GET  /orders - Get all orders         ║
  ║  GET  /orders/:id - Get order by ID    ║
  ╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await db.pool.end();
    process.exit(0);
});
