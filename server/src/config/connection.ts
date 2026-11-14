import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tech-thoughts';

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    let mongoUri = MONGODB_URI;

    if (!process.env.MONGODB_URI) {
      const mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log('Database connected.');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed.');
  }
};

export default db;
