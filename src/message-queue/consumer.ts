import { kafka } from '../config/kafka';

export const kafkaConsumer = kafka.consumer({
  groupId: 'attendance-processing-group'
});
