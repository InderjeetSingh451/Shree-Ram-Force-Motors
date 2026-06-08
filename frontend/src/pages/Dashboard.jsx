import { useEffect, useState } from "react";
import {
  MdWork,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdCurrencyRupee,
  MdTrendingUp,
  MdTrendingDown,
  MdPeople,
  MdPayment,
  MdSchedule,
  MdRefresh,
} from "react-icons/md";
import api from "../services/api";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { formatCurrency, formatDate } from "../utils/helpers";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/dashboard/");
      if (res.data.success) {
        setData(res.data.dashboard);
      }
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const now = new Date();
  const monthName = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">DASHBOARD</h1>
          <p className="text-dark-400 font-body text-sm mt-1">{monthName} Overview</p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="btn-secondary text-sm"
        >
          <MdRefresh className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : data ? (
        <>
          {/* Work Stats */}
          <div className="mb-6">
            <h2 className="text-sm font-mono text-dark-400 tracking-widest uppercase mb-3">
              Work Statistics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Works"
                value={data.workStats.totalWorks}
                icon={MdWork}
                color="brand"
              />
              <StatCard
                label="Completed"
                value={data.workStats.completedWorks}
                icon={MdCheckCircle}
                color="green"
              />
              <StatCard
                label="Pending"
                value={data.workStats.pendingWorks}
                icon={MdPending}
                color="yellow"
              />
              <StatCard
                label="Cancelled"
                value={data.workStats.cancelledWorks}
                icon={MdCancel}
                color="red"
              />
            </div>
          </div>

          {/* Financial Stats */}
          <div className="mb-6">
            <h2 className="text-sm font-mono text-dark-400 tracking-widest uppercase mb-3">
              Financial Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Payment Received"
                value={formatCurrency(data.financialStats.totalPaymentReceived)}
                icon={MdCurrencyRupee}
                color="green"
              />
              <StatCard
                label="Outside Expense"
                value={formatCurrency(data.financialStats.totalOutsideExpense)}
                icon={MdTrendingDown}
                color="red"
              />
              <StatCard
                label="Remaining Payment"
                value={formatCurrency(data.financialStats.totalRemainingPayment)}
                icon={MdSchedule}
                color="yellow"
              />
              <StatCard
                label="Net Income"
                value={formatCurrency(data.financialStats.netIncome)}
                icon={MdTrendingUp}
                color="brand"
                sub="After outside expenses"
              />
            </div>
          </div>

          {/* Staff Stats */}
          <div className="mb-8">
            <h2 className="text-sm font-mono text-dark-400 tracking-widest uppercase mb-3">
              Staff Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Staff"
                value={data.staffStats.totalStaff}
                icon={MdPeople}
                color="blue"
              />
              <StatCard
                label="Salary Paid (This Month)"
                value={formatCurrency(data.staffStats.totalSalaryPaid)}
                icon={MdPayment}
                color="green"
              />
              <StatCard
                label="Salary Pending"
                value={formatCurrency(data.staffStats.totalSalaryPending)}
                icon={MdCurrencyRupee}
                color="yellow"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Works */}
            <div className="card p-5">
              <h3 className="font-display text-lg text-white tracking-widest mb-4">
                RECENT WORKS
              </h3>
              {data.recentWorks.length === 0 ? (
                <p className="text-dark-400 text-sm font-body text-center py-6">No work records yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentWorks.map((w) => (
                    <div
                      key={w._id}
                      className="flex items-start justify-between p-3 bg-dark-700/50 rounded-lg border border-dark-700"
                    >
                      <div>
                        <p className="text-white text-sm font-medium font-body">
                          {w.workDescription}
                        </p>
                        <p className="text-dark-400 text-xs mt-0.5 font-body">
                          {w.customerName} · {w.vehicleName} {w.vehicleModel}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={
                            w.status === "Done"
                              ? "badge-done"
                              : w.status === "Cancelled"
                              ? "badge-cancelled"
                              : "badge-pending"
                          }
                        >
                          {w.status}
                        </span>
                        <span className="text-dark-500 text-xs font-mono">
                          {formatDate(w.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Salary Transactions */}
            <div className="card p-5">
              <h3 className="font-display text-lg text-white tracking-widest mb-4">
                RECENT SALARY PAYMENTS
              </h3>
              {data.recentSalaryTransactions.length === 0 ? (
                <p className="text-dark-400 text-sm font-body text-center py-6">No salary records yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentSalaryTransactions.map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg border border-dark-700"
                    >
                      <div>
                        <p className="text-white text-sm font-medium font-body">
                          {t.staff?.name || "—"}
                        </p>
                        <p className="text-dark-400 text-xs mt-0.5 font-body">
                          {t.notes || "Salary payment"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-mono text-sm font-semibold">
                          {formatCurrency(t.amountPaid)}
                        </p>
                        <p className="text-dark-500 text-xs font-mono mt-0.5">
                          {formatDate(t.paymentDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-dark-400 font-body">
          Failed to load dashboard data.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
