import { kafka } from '../config/kafka';

export const kafkaProducer = kafka.producer({
  allowAutoTopicCreation: false,
  transactionTimeout: 3000
});

export const initKafkaProducer = async () => {
  await kafkaProducer.connect();
  console.log('✅ Kafka Producer connected');
};
