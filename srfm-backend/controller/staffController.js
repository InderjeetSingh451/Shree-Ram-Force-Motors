import { v2 as cloudinary } from "cloudinary";
import StaffModel from "../models/staffModel.js";
import SalaryPeriodModel from "../models/salaryPeriodModel.js";
import SalaryTransactionModel from "../models/salaryTransactionModel.js";

// ─── helpers ───────────────────────────────────────────────────────────────

// Given a joining date, return the salary period that contains `targetDate`
const getPeriodDates = (joiningDate, targetDate = new Date()) => {
  const jd = new Date(joiningDate);
  const day = jd.getDate(); // anchor day-of-month

  let start = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);
  if (start > targetDate) {
    // step back one month
    start = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, day);
  }

  const end = new Date(start.getFullYear(), start.getMonth() + 1, day);
  return { start, end };
};

// Ensure salary period docs exist for last 12 months for a staff
const ensureSalaryPeriods = async (staff) => {
  const joiningDate = new Date(staff.joiningDate);
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Build list of period-starts from joiningDate up to now (max 12 months)
  const periods = [];
  let cursor = new Date(joiningDate);

  while (cursor <= now) {
    if (cursor >= oneYearAgo) {
      const periodStart = new Date(cursor);
      const periodEnd = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        cursor.getDate()
      );
      periods.push({ periodStart, periodEnd });
    }
    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      cursor.getDate()
    );
  }

  // For each period, create if not existing
  for (let i = 0; i < periods.length; i++) {
    const { periodStart, periodEnd } = periods[i];
    const existing = await SalaryPeriodModel.findOne({
      staff: staff._id,
      periodStart,
    });
    if (!existing) {
      // Get remaining from previous period
      let remainingFromPrevious = 0;
      if (i > 0) {
        const prev = await SalaryPeriodModel.findOne({
          staff: staff._id,
          periodStart: periods[i - 1].periodStart,
        });
        if (prev) {
          const netRemaining =
            prev.salaryDue + prev.remainingFromPrevious - prev.totalPaid;
          remainingFromPrevious = netRemaining > 0 ? netRemaining : 0;
        }
      }
      await SalaryPeriodModel.create({
        staff: staff._id,
        periodStart,
        periodEnd,
        salaryDue: staff.monthlySalary,
        totalPaid: 0,
        remainingFromPrevious,
      });
    }
  }
};

// ─── controllers ───────────────────────────────────────────────────────────

const addStaff = async (req, res) => {
  try {
    const { name, email, phone, gender, address, joiningDate, monthlySalary } =
      req.body;

    const existing = await StaffModel.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email already registered" });
    }

    let imageUrl = "";
    if (req.file) {
      const fileUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "srfm_staff",
      });
      imageUrl = fileUpload.secure_url;
    }

    const staff = await StaffModel.create({
      name,
      email,
      phone,
      gender,
      address,
      joiningDate: new Date(joiningDate),
      monthlySalary: Number(monthlySalary),
      imageUrl,
    });

    // Generate salary periods
    await ensureSalaryPeriods(staff);

    res.json({ success: true, message: "Staff added successfully!", staff });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staff = await StaffModel.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, staff });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.json({ success: false, message: "Staff not found" });
    }

    // Ensure periods are up to date
    await ensureSalaryPeriods(staff);

    // Fetch last 12 months salary periods
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const salaryPeriods = await SalaryPeriodModel.find({
      staff: id,
      periodStart: { $gte: oneYearAgo },
    }).sort({ periodStart: -1 });

    // Attach transactions to each period
    const periodsWithTransactions = await Promise.all(
      salaryPeriods.map(async (period) => {
        const transactions = await SalaryTransactionModel.find({
          salaryPeriod: period._id,
        }).sort({ paymentDate: 1 });
        return { ...period.toObject(), transactions };
      })
    );

    // Calculate totals
    const totalSalaryGiven = periodsWithTransactions.reduce(
      (sum, p) => sum + p.totalPaid,
      0
    );
    const currentPeriod = periodsWithTransactions[0];
    const remainingSalary = currentPeriod
      ? currentPeriod.salaryDue +
        currentPeriod.remainingFromPrevious -
        currentPeriod.totalPaid
      : 0;

    res.json({
      success: true,
      staff,
      salaryPeriods: periodsWithTransactions,
      totalSalaryGiven,
      remainingSalary: remainingSalary > 0 ? remainingSalary : 0,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const giveSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid, paymentDate, notes } = req.body;

    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.json({ success: false, message: "Staff not found" });
    }

    await ensureSalaryPeriods(staff);

    // Find current period
    const now = new Date(paymentDate || Date.now());
    const { start } = getPeriodDates(staff.joiningDate, now);

    const currentPeriod = await SalaryPeriodModel.findOne({
      staff: id,
      periodStart: start,
    });

    if (!currentPeriod) {
      return res.json({ success: false, message: "Salary period not found" });
    }

    // Create transaction
    await SalaryTransactionModel.create({
      staff: id,
      salaryPeriod: currentPeriod._id,
      amountPaid: Number(amountPaid),
      paymentDate: new Date(paymentDate || Date.now()),
      notes: notes || "",
    });

    // Update period totalPaid
    currentPeriod.totalPaid += Number(amountPaid);
    const netRemaining =
      currentPeriod.salaryDue +
      currentPeriod.remainingFromPrevious -
      currentPeriod.totalPaid;
    if (netRemaining <= 0) {
      currentPeriod.isSettled = true;
    }
    await currentPeriod.save();

    res.json({ success: true, message: "Salary recorded successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await StaffModel.findByIdAndUpdate(id, { isActive: false });
    res.json({ success: true, message: "Staff removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addStaff, getAllStaff, getStaffById, giveSalary, deleteStaff };
