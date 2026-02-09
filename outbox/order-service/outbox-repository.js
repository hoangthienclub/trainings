const { v4: uuidv4 } = require('uuid');
const db = require('../shared/database');

class OutboxRepository {
    /**
     * Lưu event vào outbox table trong cùng transaction với business logic
     * Đây là core của Outbox Pattern
     */
    async saveEvent(event, client) {
        const eventId = uuidv4();

        const query = `
      INSERT INTO outbox (id, aggregate_type, aggregate_id, event_type, payload)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const values = [
            eventId,
            event.aggregateType,
            event.aggregateId,
            event.eventType,
            JSON.stringify(event.payload)
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    /**
     * Lấy các events chưa được process
     * Được sử dụng bởi Outbox Relay
     */
    async getUnprocessedEvents(limit = 100) {
        const query = `
      SELECT * FROM outbox 
      WHERE processed = false 
      ORDER BY created_at ASC 
      LIMIT $1
    `;

        const result = await db.query(query, [limit]);
        return result.rows;
    }

    /**
     * Đánh dấu event đã được process
     */
    async markAsProcessed(eventId) {
        const query = `
      UPDATE outbox 
      SET processed = true, processed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

        const result = await db.query(query, [eventId]);
        return result.rows[0];
    }

    /**
     * Xóa các events đã được process (cleanup job)
     */
    async deleteProcessedEvents(olderThanDays = 7) {
        const query = `
      DELETE FROM outbox 
      WHERE processed = true 
      AND processed_at < NOW() - INTERVAL '${olderThanDays} days'
    `;

        const result = await db.query(query);
        return result.rowCount;
    }
}

module.exports = new OutboxRepository();
