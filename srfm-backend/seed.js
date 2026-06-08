// Run once to create the initial admin account
// Usage: node seed.js
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AdminModel from "./models/adminModel.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB Connected");

  const existing = await AdminModel.findOne({ email: "admin@srfm.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin@1234", 10);
  await AdminModel.create({
    email: "admin@srfm.com",
    password: hashedPassword,
    name: "Shri Ram Force Motors",
  });

  console.log("Admin created: admin@srfm.com / admin@1234");
  process.exit();
};

seed();
