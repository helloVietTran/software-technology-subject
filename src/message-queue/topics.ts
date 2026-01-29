import { kafka } from '../config/kafka';

export const kafkaAdmin = kafka.admin();

export const ensureKafkaTopics = async () => {
  await kafkaAdmin.connect();

  await kafkaAdmin.createTopics({
    topics: [
      {
        topic: 'attendance.log.received',
        numPartitions: 2,
        replicationFactor: 1
      }
    ],
    waitForLeaders: true
  });

  await kafkaAdmin.disconnect();
};
