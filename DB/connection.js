import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_LOCAL)
    .then(() => {
      console.log("MongoDB Connected...");
    })
    .catch((err) => {
      console.error(`Error connecting to MongoDB: ${err}`);
    });
};
export default connectDB;
