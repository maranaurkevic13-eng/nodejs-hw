import mongoose from "mongoose";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  } 
};   