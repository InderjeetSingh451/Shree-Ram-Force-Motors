import mongoose from "mongoose";

const DbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected!");
  } catch (error) {
    console.log("Database Connection failed! ");
    console.log(error);
  }
};

export default DbConnect;
