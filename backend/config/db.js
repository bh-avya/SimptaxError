import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`Database Connection Successful`);
  } catch (err) {
    console.error(`Database Connection Failed\n ${err}`);
  }
};

export default connectDB;