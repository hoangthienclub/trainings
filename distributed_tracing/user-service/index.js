// QUAN TRỌNG: Phải import tracing TRƯỚC tất cả các module khác
const { initTracing } = require('../shared/tracing');
initTracing('user-service');

const express = require('express');
const { trace, SpanStatusCode } = require('@opentelemetry/api');

const app = express();
const PORT = 3001;

app.use(express.json());

// Mock database
const users = {
    '1': { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', age: 25 },
    '2': { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', age: 30 },
    '3': { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', age: 28 },
};

/**
 * Simulate database query với custom span
 */
async function getUserFromDB(userId) {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('db.query.get_user');

    try {
        span.setAttribute('db.system', 'postgresql');
        span.setAttribute('db.operation', 'SELECT');
        span.setAttribute('db.statement', `SELECT * FROM users WHERE id = ${userId}`);

        // Simulate database latency
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

        const user = users[userId];

        if (user) {
            span.addEvent('User found in database');
            span.setAttribute('user.found', true);
            span.setStatus({ code: SpanStatusCode.OK });
            return user;
        } else {
            span.addEvent('User not found in database');
            span.setAttribute('user.found', false);
            span.setStatus({ code: SpanStatusCode.OK });
            return null;
        }
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
 * Endpoint để lấy thông tin user
 */
app.get('/users/:id', async (req, res) => {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('handle-get-user');

    try {
        const userId = req.params.id;
        console.log(`👤 Getting user ${userId}`);

        span.setAttribute('user.id', userId);
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/users/:id');

        // Query database
        const user = await getUserFromDB(userId);

        if (user) {
            span.addEvent('Returning user data');
            span.setStatus({ code: SpanStatusCode.OK });
            res.json(user);
        } else {
            span.addEvent('User not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'User not found' });
            res.status(404).json({ error: 'User not found' });
        }
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
    res.json({ status: 'healthy', service: 'user-service' });
});

app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
});
