import mongoose from "mongoose";

// Represents a single payment made to a staff member
const salaryTransactionSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    salaryPeriod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryPeriod",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const SalaryTransactionModel =
  mongoose.models.SalaryTransaction ||
  mongoose.model("SalaryTransaction", salaryTransactionSchema);

export default SalaryTransactionModel;
