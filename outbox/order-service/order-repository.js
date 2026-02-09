const { v4: uuidv4 } = require('uuid');
const db = require('../shared/database');
const { ORDER_STATUS } = require('../shared/constants');


class OrderRepository {
    async createOrder(orderData, client) {
        const orderId = uuidv4();

        const query = `
      INSERT INTO orders (id, customer_id, total_amount, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

        const values = [
            orderId,
            orderData.customerId,
            orderData.totalAmount,
            ORDER_STATUS.PENDING
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    async updateOrderStatus(orderId, status, client = null) {
        const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

        const dbClient = client || db;
        const result = await dbClient.query(query, [status, orderId]);
        return result.rows[0];
    }

    async getOrder(orderId) {
        const query = 'SELECT * FROM orders WHERE id = $1';
        const result = await db.query(query, [orderId]);
        return result.rows[0];
    }

    async getAllOrders() {
        const query = 'SELECT * FROM orders ORDER BY created_at DESC';
        const result = await db.query(query);
        return result.rows;
    }
}

module.exports = new OrderRepository();
