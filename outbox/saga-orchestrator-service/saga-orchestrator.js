const { v4: uuidv4 } = require('uuid');
const db = require('../shared/database');
const messageBroker = require('../shared/message-broker');
const {
    SAGA_STEPS,
    EVENT_TYPES,
    TOPICS,
    ORDER_STATUS,
    SAGA_STATUS,
    STEP_STATUS,
    CONSUMER_GROUPS
} = require('../shared/constants');

/**
 * Saga Orchestrator - Điều phối distributed transaction
 * Sử dụng Orchestration pattern (thay vì Choreography)
 */
class SagaOrchestrator {
    constructor() {
        this.sagaSteps = SAGA_STEPS;
    }

    /**
     * Khởi tạo và lắng nghe OrderCreated events từ message broker
     * Đây là quy trình đúng: Saga được trigger bởi events, không phải direct call
     */
    async initialize() {
        console.log('[Saga Orchestrator] Initializing...');

        await messageBroker.subscribe(
            TOPICS.ORDER_EVENTS,
            CONSUMER_GROUPS.SAGA_ORCHESTRATOR,
            this.handleOrderEvent.bind(this)
        );

        console.log(`[Saga Orchestrator] Listening to ${TOPICS.ORDER_EVENTS} topic`);
    }

    /**
     * Xử lý OrderCreated event và bắt đầu saga
     */
    async handleOrderEvent(message) {
        const { eventType, payload } = message;

        if (eventType === EVENT_TYPES.ORDER_CREATED) {
            console.log(`[Saga Orchestrator] Received ${EVENT_TYPES.ORDER_CREATED} event for order ${payload.orderId}`);

            // Bắt đầu saga
            await this.startSaga(payload.orderId, payload);
        }
    }

    async startSaga(orderId, orderData) {
        const sagaId = uuidv4();

        // Lưu saga state
        await this.saveSagaState(sagaId, orderId, SAGA_STATUS.STARTED, orderData);

        console.log(`[SAGA ${sagaId}] Started for order ${orderId}`);

        try {
            // Thực hiện từng bước
            for (let i = 0; i < this.sagaSteps.length; i++) {
                const step = this.sagaSteps[i];
                await this.executeStep(sagaId, orderId, step, orderData, i);
            }

            // Tất cả các bước thành công
            await this.completeSaga(sagaId, orderId);

        } catch (error) {
            console.error(`[SAGA ${sagaId}] Failed:`, error.message);
            await this.compensateSaga(sagaId, orderId, error);
        }
    }

    async executeStep(sagaId, orderId, step, orderData, stepIndex) {
        console.log(`[SAGA ${sagaId}] Executing step: ${step.name}`);

        // Update saga state
        await this.updateSagaState(sagaId, step.name, SAGA_STATUS.IN_PROGRESS);

        // Log step execution - STARTED
        await this.logStepExecution(uuidv4(), sagaId, step.name, STEP_STATUS.STARTED, orderData);

        // Publish command
        await messageBroker.publish(step.topic, {
            value: {
                sagaId,
                orderId,
                command: step.name,
                data: orderData
            }
        });

        // Trong thực tế, cần đợi response từ service
        // Ở đây giả lập bằng cách đợi message từ reply topic
        const success = await this.waitForStepCompletion(sagaId, step.name);

        if (!success) {
            // Log FAILED với UUID mới
            await this.logStepExecution(uuidv4(), sagaId, step.name, STEP_STATUS.FAILED, null, 'Step failed');
            throw new Error(`Step ${step.name} failed`);
        }

        // Log COMPLETED với UUID mới
        await this.logStepExecution(uuidv4(), sagaId, step.name, STEP_STATUS.COMPLETED, { success: true });
        console.log(`[SAGA ${sagaId}] Step ${step.name} completed`);
    }

    async compensateSaga(sagaId, orderId, error) {
        console.log(`[SAGA ${sagaId}] Starting compensation`);

        await this.updateSagaState(sagaId, 'COMPENSATING', SAGA_STATUS.IN_PROGRESS);

        // Lấy các steps đã thực hiện thành công
        const completedSteps = await this.getCompletedSteps(sagaId);

        // Thực hiện compensation theo thứ tự ngược lại
        for (let i = completedSteps.length - 1; i >= 0; i--) {
            const step = completedSteps[i];
            const sagaStep = this.sagaSteps.find(s => s.name === step.step_name);

            if (sagaStep && sagaStep.compensate) {
                console.log(`[SAGA ${sagaId}] Compensating: ${sagaStep.compensate}`);

                await messageBroker.publish(sagaStep.topic, {
                    value: {
                        sagaId,
                        orderId,
                        command: sagaStep.compensate,
                        data: {}
                    }
                });
            }
        }

        // Update order status
        await this.updateOrderStatus(orderId, ORDER_STATUS.FAILED);
        await this.updateSagaState(sagaId, 'COMPENSATED', SAGA_STATUS.COMPLETED);

        console.log(`[SAGA ${sagaId}] Compensation completed`);
    }

    async completeSaga(sagaId, orderId) {
        console.log(`[SAGA ${sagaId}] Completing saga`);

        await this.updateOrderStatus(orderId, ORDER_STATUS.CONFIRMED);
        await this.updateSagaState(sagaId, 'COMPLETED', SAGA_STATUS.COMPLETED);

        console.log(`[SAGA ${sagaId}] Saga completed successfully`);
    }

    async updateOrderStatus(orderId, status) {
        const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

        const result = await db.query(query, [status, orderId]);
        return result.rows[0];
    }

    async saveSagaState(sagaId, orderId, status, payload) {
        const query = `
      INSERT INTO saga_state (saga_id, order_id, current_step, status, payload)
      VALUES ($1, $2, $3, $4, $5)
    `;

        await db.query(query, [sagaId, orderId, 'STARTED', status, JSON.stringify(payload)]);
    }

    async updateSagaState(sagaId, currentStep, status) {
        const query = `
      UPDATE saga_state 
      SET current_step = $1, status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE saga_id = $3
    `;

        await db.query(query, [currentStep, status, sagaId]);
    }

    async logStepExecution(id, sagaId, stepName, status, request = null, error = null) {
        const query = `
      INSERT INTO saga_step_log (id, saga_id, step_name, status, request, error)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

        await db.query(query, [
            id,
            sagaId,
            stepName,
            status,
            request ? JSON.stringify(request) : null,
            error
        ]);
    }

    async getCompletedSteps(sagaId) {
        const query = `
      SELECT * FROM saga_step_log 
      WHERE saga_id = $1 AND status = $2
      ORDER BY created_at ASC
    `;

        const result = await db.query(query, [sagaId, STEP_STATUS.COMPLETED]);
        return result.rows;
    }

    async waitForStepCompletion(sagaId, stepName, timeoutMs = 5000) {
        // Giả lập đợi response - trong thực tế cần implement message correlation
        return new Promise((resolve) => {
            setTimeout(() => {
                // Giả lập 90% success rate
                resolve(Math.random() > 0.1);
            }, 1000);
        });
    }
}

module.exports = new SagaOrchestrator();
