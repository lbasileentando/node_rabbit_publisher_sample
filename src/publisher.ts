import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = process.env.EXCHANGE_NAME || 'example_exchange';
const ROUTING_KEY = process.env.ROUTING_KEY || 'example_queue';

async function publishMessage() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Declare exchange
        await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

        for (let i = 0; i < 5; i++) {
            const message = { id: i, content: `Message ${i}` };
            channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(JSON.stringify(message)));
            console.log(`Sent: ${JSON.stringify(message)}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        }

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in publisher:', error);
    }
}

publishMessage();
