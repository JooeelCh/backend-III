import mongoose from "mongoose";

export const connectDB = async (mongoUri = process.env.MONGO_URI) => {
  if (!mongoUri) {
    throw new Error("");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  return mongoose.connect(mongoUri);
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
};
