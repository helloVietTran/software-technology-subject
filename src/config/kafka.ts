import { Kafka, logLevel } from 'kafkajs';
import { config } from './config';

const kafka = new Kafka({
  clientId: 'attendance-service',
  brokers: [config.kafka.broker],
  retry: {
    initialRetryTime: 100,
    retries: 4
  },
  logLevel: logLevel.ERROR
});

export const kafkaProducer = kafka.producer();
export const kafkaAdmin = kafka.admin();

export const initKafkaProducer = async () => {
  await kafkaProducer.connect();
};

// cấu hình topic
export const createTopicIfNotExists = async () => {
  await kafkaAdmin.connect();

  const topics = [
    {
      topic: 'attendance.log.received',
      numPartitions: 2,
      replicationFactor: 1
    }
  ];

  const created = await kafkaAdmin.createTopics({
    topics,
    waitForLeaders: true
  });

  console.log(created ? 'Kafka topics created' : 'Kafka topics already exist');

  await kafkaAdmin.disconnect();
};
