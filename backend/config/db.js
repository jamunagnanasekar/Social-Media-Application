import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/connecthub');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`[Warning]: Ensure MongoDB server is running locally or MONGO_URI is set correctly.`);
    // Do not crash server completely during development if database is starting up
  }
};

export default connectDB;
