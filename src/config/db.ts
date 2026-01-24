import mongoose from 'mongoose';
import { config } from './config';

const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(
      config.db.uri as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } as mongoose.ConnectOptions
    );
    console.error('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

export default connectMongo;
