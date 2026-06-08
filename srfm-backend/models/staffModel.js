import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: String,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    monthlySalary: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const StaffModel =
  mongoose.models.Staff || mongoose.model("Staff", staffSchema);

export default StaffModel;
