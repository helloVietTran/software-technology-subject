import { Kafka, logLevel } from 'kafkajs';
import { config } from './config';

export const kafka = new Kafka({
  clientId: 'attendance-service',
  brokers: [config.kafka.broker],
  retry: {
    initialRetryTime: 300,
    retries: 3
  },
  logLevel: logLevel.ERROR
});
