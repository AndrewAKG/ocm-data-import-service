import mongoose from 'mongoose';
import { throwError } from './error.utils';

export const connectToDB = async (mongoUri: string): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');
  } catch (error: unknown) {
    throwError(error, 'Error connecting to MongoDB');
  }
};

export const closeDBConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error: unknown) {
    throwError(error, 'Error disconnecting to MongoDB');
  }
};
