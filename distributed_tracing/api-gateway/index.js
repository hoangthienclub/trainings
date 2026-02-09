// QUAN TRỌNG: Phải import tracing TRƯỚC tất cả các module khác
const { initTracing } = require('../shared/tracing');
initTracing('api-gateway');

const express = require('express');
const axios = require('axios');
const { trace, context, SpanStatusCode } = require('@opentelemetry/api');

const app = express();
const PORT = 3000;

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

app.use(express.json());

// Middleware để log requests
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

/**
 * Endpoint để lấy thông tin user
 * Trace sẽ bao gồm: API Gateway -> User Service
 */
app.get('/api/users/:id', async (req, res) => {
    const tracer = trace.getTracer('api-gateway');
    const span = tracer.startSpan('get-user-info');

    try {
        const userId = req.params.id;

        // Add attributes vào span
        span.setAttribute('user.id', userId);
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/api/users/:id');

        // Gọi User Service
        span.addEvent('Calling User Service');
        const userResponse = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);

        span.addEvent('User Service responded', {
            'response.status': userResponse.status,
        });

        span.setStatus({ code: SpanStatusCode.OK });
        res.json(userResponse.data);
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

/**
 * Endpoint để lấy thông tin user và orders
 * Trace sẽ bao gồm: API Gateway -> User Service
 *                                -> Order Service
 */
app.get('/api/orders/:userId', async (req, res) => {
    const tracer = trace.getTracer('api-gateway');
    const span = tracer.startSpan('get-user-orders');

    try {
        const userId = req.params.userId;

        span.setAttribute('user.id', userId);
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/api/orders/:userId');

        // Gọi User Service và Order Service song song
        span.addEvent('Calling User and Order Services in parallel');

        const [userResponse, ordersResponse] = await Promise.all([
            axios.get(`${USER_SERVICE_URL}/users/${userId}`),
            axios.get(`${ORDER_SERVICE_URL}/orders/${userId}`),
        ]);

        const result = {
            user: userResponse.data,
            orders: ordersResponse.data,
        };

        span.addEvent('Both services responded successfully');
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
    res.json({ status: 'healthy', service: 'api-gateway' });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📍 User Service: ${USER_SERVICE_URL}`);
    console.log(`📍 Order Service: ${ORDER_SERVICE_URL}`);
});
