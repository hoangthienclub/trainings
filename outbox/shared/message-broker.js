const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'outbox-saga-app',
    brokers: ['localhost:9092'],
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

class MessageBroker {
    constructor() {
        this.producer = null;
        this.consumers = new Map();
    }

    async initProducer() {
        if (!this.producer) {
            this.producer = kafka.producer();
            await this.producer.connect();
            console.log('Kafka producer connected');
        }
        return this.producer;
    }

    async publish(topic, message) {
        const producer = await this.initProducer();

        await producer.send({
            topic,
            messages: [
                {
                    key: message.key || null,
                    value: JSON.stringify(message.value),
                    headers: message.headers || {}
                }
            ]
        });

        console.log(`Published message to topic: ${topic}`, message);
    }

    async subscribe(topic, groupId, handler) {
        const consumer = kafka.consumer({ groupId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const value = JSON.parse(message.value.toString());
                    console.log(`Received message from topic: ${topic}`, value);
                    await handler(value, message);
                } catch (error) {
                    console.error('Error processing message:', error);
                    // Trong production, nên implement retry logic hoặc dead letter queue
                }
            }
        });

        this.consumers.set(topic, consumer);
        console.log(`Subscribed to topic: ${topic} with groupId: ${groupId}`);
    }

    async disconnect() {
        if (this.producer) {
            await this.producer.disconnect();
        }
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect();
        }
        console.log('Message broker disconnected');
    }
}

module.exports = new MessageBroker();
