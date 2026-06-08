import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdPerson,
  MdCurrencyRupee,
  MdPayment,
  MdWarning,
  MdExpandMore,
  MdExpandLess,
  MdDelete,
} from "react-icons/md";
import api from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import {
  formatCurrency,
  formatDate,
  formatDateRange,
  getInitials,
  calcRemaining,
} from "../utils/helpers";

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [salaryForm, setSalaryForm] = useState({
    amountPaid: "",
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [savingsalary, setSalarySaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/staff/${id}`);
      if (res.data.success) {
        setData(res.data);
      } else {
        toast.error("Staff not found");
        navigate("/staff");
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleGiveSalary = async (e) => {
    e.preventDefault();
    if (!salaryForm.amountPaid || Number(salaryForm.amountPaid) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSalarySaving(true);
    try {
      const res = await api.post(`/api/staff/${id}/give-salary`, {
        amountPaid: Number(salaryForm.amountPaid),
        paymentDate: salaryForm.paymentDate,
        notes: salaryForm.notes,
      });
      if (res.data.success) {
        toast.success("Salary recorded!");
        setShowSalaryModal(false);
        setSalaryForm({
          amountPaid: "",
          paymentDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
        fetchProfile();
      } else {
        toast.error(res.data.message || "Failed to record salary");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSalarySaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove this staff member?")) return;
    try {
      await api.delete(`/api/staff/${id}`);
      toast.success("Staff removed");
      navigate("/staff");
    } catch {
      toast.error("Failed to remove staff");
    }
  };

  if (loading)
    return (
      <div className="pt-24">
        <Loader text="Loading profile..." />
      </div>
    );
  if (!data) return null;

  const { staff, salaryPeriods, totalSalaryGiven, remainingSalary } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate("/staff")}
        className="flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors text-sm font-body"
      >
        <MdArrowBack />
        Back to Staff
      </button>

      {/* Profile Card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {staff.imageUrl ? (
              <img
                src={staff.imageUrl}
                alt={staff.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-dark-600"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center">
                <span className="font-display text-3xl text-brand-400">
                  {getInitials(staff.name)}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-3xl text-white tracking-wider">
                  {staff.name}
                </h1>
                <span className="text-brand-400 text-sm font-mono bg-brand-500/10 px-2 py-0.5 rounded mt-1 inline-block">
                  {staff.gender}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowSalaryModal(true)}
                  className="btn-success text-sm"
                >
                  <MdPayment />
                  Give Salary
                </button>
                <button onClick={handleDelete} className="btn-danger text-sm">
                  <MdDelete />
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-dark-300 text-sm font-body">
                <MdEmail className="text-brand-500 flex-shrink-0" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-dark-300 text-sm font-body">
                <MdPhone className="text-brand-500 flex-shrink-0" />
                {staff.phone}
              </div>
              {staff.address && (
                <div className="flex items-center gap-2 text-dark-300 text-sm font-body sm:col-span-2">
                  <MdLocationOn className="text-brand-500 flex-shrink-0" />
                  {staff.address}
                </div>
              )}
              <div className="flex items-center gap-2 text-dark-300 text-sm font-body">
                <MdCalendarToday className="text-brand-500 flex-shrink-0" />
                Joined: {formatDate(staff.joiningDate)}
              </div>
              <div className="flex items-center gap-2 text-dark-300 text-sm font-body">
                <MdCurrencyRupee className="text-brand-500 flex-shrink-0" />
                Monthly: {formatCurrency(staff.monthlySalary)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 border-green-500/20">
          <p className="text-xs font-mono text-dark-400 uppercase tracking-widest">
            Total Salary Given
          </p>
          <p className="text-2xl font-display text-green-400 mt-1">
            {formatCurrency(totalSalaryGiven)}
          </p>
        </div>
        <div
          className={`card p-5 ${remainingSalary > 0 ? "border-yellow-500/20" : "border-dark-700"}`}
        >
          <p className="text-xs font-mono text-dark-400 uppercase tracking-widest">
            Remaining Salary
          </p>
          <p
            className={`text-2xl font-display mt-1 ${remainingSalary > 0 ? "text-yellow-400" : "text-dark-400"}`}
          >
            {formatCurrency(remainingSalary)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-mono text-dark-400 uppercase tracking-widest">
            Monthly Salary
          </p>
          <p className="text-2xl font-display text-brand-400 mt-1">
            {formatCurrency(staff.monthlySalary)}
          </p>
        </div>
      </div>

      {/* Remaining Alert */}
      {remainingSalary > 0 && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <MdWarning className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 font-semibold text-sm font-body">
              Salary Pending
            </p>
            <p className="text-yellow-400/80 text-xs font-body mt-0.5">
              {formatCurrency(remainingSalary)} is still pending for this staff
              member.
            </p>
          </div>
        </div>
      )}

      {/* Salary History */}
      <div className="card p-5">
        <h2 className="font-display text-xl text-white tracking-widest mb-5">
          SALARY HISTORY
        </h2>
        {salaryPeriods.length === 0 ? (
          <p className="text-dark-400 text-sm font-body text-center py-8">
            No salary records yet
          </p>
        ) : (
          <div className="space-y-3">
            {salaryPeriods.map((period, idx) => {
              const net = calcRemaining(period);
              const isExpanded = expandedPeriod === period._id;
              return (
                <div
                  key={period._id}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    idx === 0
                      ? "border-brand-500/30 bg-brand-500/5"
                      : "border-dark-700 bg-dark-700/30"
                  }`}
                >
                  {/* Period Header */}
                  <button
                    onClick={() =>
                      setExpandedPeriod(isExpanded ? null : period._id)
                    }
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-700/30 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      {idx === 0 && (
                        <span className="badge-pending text-xs">Current</span>
                      )}
                      <span className="text-white text-sm font-body font-medium">
                        {formatDateRange(period.periodStart, period.periodEnd)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-dark-400 text-xs font-mono">
                          Due:{" "}
                          {formatCurrency(
                            period.salaryDue + period.remainingFromPrevious,
                          )}
                        </p>
                        <p className="text-green-400 text-xs font-mono">
                          Paid: {formatCurrency(period.totalPaid)}
                        </p>
                      </div>
                      <div
                        className={`text-sm font-mono font-bold ${net > 0 ? "text-yellow-400" : "text-green-400"}`}
                      >
                        {net > 0 ? `${formatCurrency(net)} left` : "Settled"}
                      </div>
                      {isExpanded ? (
                        <MdExpandLess className="text-dark-400 text-xl flex-shrink-0" />
                      ) : (
                        <MdExpandMore className="text-dark-400 text-xl flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Transactions */}
                  {isExpanded && (
                    <div className="border-t border-dark-700 p-4 space-y-2 animate-slide-down">
                      {/* Summary row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 pb-3 border-b border-dark-700">
                        <div>
                          <p className="text-dark-500 text-xs font-mono">
                            Salary Due
                          </p>
                          <p className="text-white text-sm font-body">
                            {formatCurrency(period.salaryDue)}
                          </p>
                        </div>
                        {period.remainingFromPrevious > 0 && (
                          <div>
                            <p className="text-dark-500 text-xs font-mono">
                              Carried Forward
                            </p>
                            <p className="text-yellow-400 text-sm font-body">
                              {formatCurrency(period.remainingFromPrevious)}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-dark-500 text-xs font-mono">
                            Total Paid
                          </p>
                          <p className="text-green-400 text-sm font-body">
                            {formatCurrency(period.totalPaid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-dark-500 text-xs font-mono">
                            Remaining
                          </p>
                          <p
                            className={`text-sm font-body ${net > 0 ? "text-yellow-400" : "text-green-400"}`}
                          >
                            {formatCurrency(Math.max(0, net))}
                          </p>
                        </div>
                      </div>

                      {/* Transactions */}
                      {period.transactions.length === 0 ? (
                        <p className="text-dark-500 text-xs font-body text-center py-2">
                          No payments in this period
                        </p>
                      ) : (
                        period.transactions.map((t) => (
                          <div
                            key={t._id}
                            className="flex items-center justify-between bg-dark-800 rounded-lg p-3 border border-dark-700"
                          >
                            <div>
                              <p className="text-dark-300 text-xs font-body">
                                {t.notes || "Salary payment"}
                              </p>
                              <p className="text-dark-500 text-xs font-mono mt-0.5">
                                {formatDate(t.paymentDate)}
                              </p>
                            </div>
                            <p className="text-green-400 font-mono font-semibold text-sm">
                              +{formatCurrency(t.amountPaid)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Give Salary Modal */}
      <Modal
        isOpen={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        title="GIVE SALARY"
        size="sm"
      >
        <form onSubmit={handleGiveSalary} className="space-y-4">
          <div className="bg-dark-700/50 rounded-xl p-4 border border-dark-700">
            <div className="flex justify-between text-sm font-body">
              <span className="text-dark-400">Remaining Salary:</span>
              <span
                className={
                  remainingSalary > 0
                    ? "text-yellow-400 font-semibold"
                    : "text-dark-400"
                }
              >
                {formatCurrency(remainingSalary)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-body mt-1">
              <span className="text-dark-400">Monthly Salary:</span>
              <span className="text-white">
                {formatCurrency(staff.monthlySalary)}
              </span>
            </div>
          </div>

          <div>
            <label className="label">Amount (₹) *</label>
            <input
              type="number"
              value={salaryForm.amountPaid}
              onChange={(e) =>
                setSalaryForm({ ...salaryForm, amountPaid: e.target.value })
              }
              placeholder="Enter amount"
              className="input-field"
              min="1"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label">Payment Date *</label>
            <input
              type="date"
              value={salaryForm.paymentDate}
              onChange={(e) =>
                setSalaryForm({ ...salaryForm, paymentDate: e.target.value })
              }
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Notes (Optional)</label>
            <input
              type="text"
              value={salaryForm.notes}
              onChange={(e) =>
                setSalaryForm({ ...salaryForm, notes: e.target.value })
              }
              placeholder="e.g. Advance payment, Bonus..."
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowSalaryModal(false)}
              className="btn-secondary flex-1"
              disabled={savingsalary}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingsalary}
              className="btn-success flex-1 justify-center"
            >
              {savingsalary ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Record Payment"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffProfile;
