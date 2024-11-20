import mongoose, { ConnectOptions } from "mongoose";
import { seedChatRooms } from "./models/ChatRoom";
import { ChatRoomModel } from "./models/ChatRoom";

const createSeedData = async () => {
  // Seed database only if the database is empty
  const count = await ChatRoomModel.estimatedDocumentCount();
  if (count === 0) {
    await ChatRoomModel.create(seedChatRooms);
  }
}

const options: ConnectOptions = {
  autoIndex: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
}

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, options);
    console.log('Connected to MongoDB');
    createSeedData();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

process.on("SIGINT", () => {
  mongoose.connection.close(true);
});

