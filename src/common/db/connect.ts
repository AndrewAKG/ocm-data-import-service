import mongoose from 'mongoose';
import { commonConfig } from '@common/config/config';
import { throwError } from '@common/utils/error';

export const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(commonConfig.mongoUri);
    console.log('Connected to MongoDB.');
  } catch (error: unknown) {
    throwError(error, 'Error connecting to MongoDB');
  }
};
