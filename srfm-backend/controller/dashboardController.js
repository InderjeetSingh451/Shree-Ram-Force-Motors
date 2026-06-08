import WorkModel from "../models/workModel.js";
import StaffModel from "../models/staffModel.js";
import SalaryPeriodModel from "../models/salaryPeriodModel.js";
import SalaryTransactionModel from "../models/salaryTransactionModel.js";

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Work stats for current month
    const [totalWorks, completedWorks, cancelledWorks] = await Promise.all([
      WorkModel.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      }),
      WorkModel.countDocuments({
        status: "Done",
        completionDate: { $gte: monthStart, $lte: monthEnd },
      }),
      WorkModel.countDocuments({
        status: "Cancelled",
        cancellationDate: { $gte: monthStart, $lte: monthEnd },
      }),
    ]);

    // Financial stats from completed works this month
    const doneWorks = await WorkModel.find({
      status: "Done",
      completionDate: { $gte: monthStart, $lte: monthEnd },
    });

    const totalPaymentReceived = doneWorks.reduce(
      (sum, w) => sum + (w.paymentReceived || 0),
      0
    );
    const totalRemainingPayment = doneWorks.reduce(
      (sum, w) => sum + (w.remainingPayment || 0),
      0
    );
    const totalOutsideExpense = doneWorks.reduce(
      (sum, w) => sum + (w.outsideExpense || 0),
      0
    );
    const netIncome = totalPaymentReceived - totalOutsideExpense;

    // Staff stats
    const totalStaff = await StaffModel.countDocuments({ isActive: true });

    // Salary stats — transactions this month
    const salaryTransactions = await SalaryTransactionModel.find({
      paymentDate: { $gte: monthStart, $lte: monthEnd },
    });
    const totalSalaryPaid = salaryTransactions.reduce(
      (sum, t) => sum + t.amountPaid,
      0
    );

    // Total pending salary across all active staff (current periods)
    const activeStaff = await StaffModel.find({ isActive: true });
    let totalSalaryPending = 0;
    for (const staff of activeStaff) {
      const currentPeriod = await SalaryPeriodModel.findOne({
        staff: staff._id,
        periodStart: { $lte: now },
        periodEnd: { $gt: now },
      });
      if (currentPeriod) {
        const remaining =
          currentPeriod.salaryDue +
          currentPeriod.remainingFromPrevious -
          currentPeriod.totalPaid;
        if (remaining > 0) totalSalaryPending += remaining;
      }
    }

    // Recent works (last 5)
    const recentWorks = await WorkModel.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent salary transactions (last 5)
    const recentSalaryTransactions = await SalaryTransactionModel.find()
      .populate("staff", "name")
      .sort({ paymentDate: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboard: {
        workStats: {
          totalWorks,
          completedWorks,
          cancelledWorks,
          pendingWorks: totalWorks - completedWorks - cancelledWorks,
        },
        financialStats: {
          totalPaymentReceived,
          totalRemainingPayment,
          totalOutsideExpense,
          netIncome,
        },
        staffStats: {
          totalStaff,
          totalSalaryPaid,
          totalSalaryPending,
        },
        recentWorks,
        recentSalaryTransactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getDashboard };
