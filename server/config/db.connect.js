import mongoose from "mongoose";
import { config } from "dotenv";
config();

const databaseConnection = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URL);

    console.log("✅ mongoDb connected sucessfully", db.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default databaseConnection;
