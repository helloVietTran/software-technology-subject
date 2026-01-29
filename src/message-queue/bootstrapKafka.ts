import { initKafkaProducer } from './producer';
import { ensureKafkaTopics } from './topics';

export const bootstrapKafka = async () => {
  await ensureKafkaTopics();
  await initKafkaProducer();
};
