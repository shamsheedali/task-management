import mongoose from 'mongoose';
import logger from '../utils/logger';

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB Disconnected. Reconnecting...');
  connectDB(); // Attempt to reconnect
});

export default connectDB;
