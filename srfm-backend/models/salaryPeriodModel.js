import mongoose from "mongoose";

// Represents one salary cycle (e.g., 03-Apr-2026 to 03-May-2026)
const salaryPeriodSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    salaryDue: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    remainingFromPrevious: {
      type: Number,
      default: 0, // carry-forward from last period
    },
    // net remaining = salaryDue + remainingFromPrevious - totalPaid
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SalaryPeriodModel =
  mongoose.models.SalaryPeriod ||
  mongoose.model("SalaryPeriod", salaryPeriodSchema);

export default SalaryPeriodModel;
