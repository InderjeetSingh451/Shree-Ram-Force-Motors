import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    workDescription: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
    },
    vehicleName: {
      type: String,
    },
    vehicleModel: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Done", "Cancelled"],
      default: "Pending",
    },
    // Filled when marked Done
    paymentReceived: {
      type: Number,
      default: 0,
    },
    outsideExpense: {
      type: Number,
      default: 0,
    },
    remainingPayment: {
      type: Number,
      default: 0,
    },
    completionDate: {
      type: Date,
    },
    // Filled when Cancelled
    cancellationDate: {
      type: Date,
    },
    cancellationRemarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const WorkModel =
  mongoose.models.Work || mongoose.model("Work", workSchema);

export default WorkModel;
