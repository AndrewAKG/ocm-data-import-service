import mongoose from 'mongoose';

export const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/ocm-data');
    console.log('Connected to MongoDB.');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
