import mongoose from 'mongoose';
import { commonConfig } from '@common/config/config';

export const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(commonConfig.mongoUri);
    console.log('Connected to MongoDB.');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
