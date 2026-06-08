import { useEffect, useState } from "react";
import {
  MdCheckCircle,
  MdSearch,
  MdFilterList,
  MdClose,
  MdDirectionsCar,
  MdPhone,
  MdBuild,
  MdCurrencyRupee,
  MdCalendarToday,
  MdCancel,
  MdPending,
  MdDone,
  MdAdd,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { formatCurrency, formatDate } from "../utils/helpers";

const STATUS_OPTIONS = ["All", "Pending", "Done", "Cancelled"];

const WorkDone = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedWork, setSelectedWork] = useState(null);
  const [modalType, setModalType] = useState(null); // 'done' | 'cancel' | 'view'
  const [doneForm, setDoneForm] = useState({
    paymentReceived: "",
    outsideExpense: "",
    remainingPayment: "",
    completionDate: new Date().toISOString().split("T")[0],
  });
  const [cancelForm, setCancelForm] = useState({ cancellationRemarks: "" });
  const [saving, setSaving] = useState(false);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.get("/api/work/", { params });
      if (res.data.success) setWorks(res.data.works);
    } catch {
      toast.error("Failed to load works");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorks();
  };

  const openModal = (work, type) => {
    setSelectedWork(work);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
    setDoneForm({ paymentReceived: "", outsideExpense: "", remainingPayment: "", completionDate: new Date().toISOString().split("T")[0] });
    setCancelForm({ cancellationRemarks: "" });
  };

  const handleMarkDone = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/api/work/${selectedWork._id}/done`, {
        paymentReceived: Number(doneForm.paymentReceived) || 0,
        outsideExpense: Number(doneForm.outsideExpense) || 0,
        remainingPayment: Number(doneForm.remainingPayment) || 0,
        completionDate: doneForm.completionDate,
      });
      if (res.data.success) {
        toast.success("Work marked as Done!");
        closeModal();
        fetchWorks();
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCancelled = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/api/work/${selectedWork._id}/cancel`, cancelForm);
      if (res.data.success) {
        toast.success("Work marked as Cancelled!");
        closeModal();
        fetchWorks();
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === "Done") return <span className="badge-done">{status}</span>;
    if (status === "Cancelled") return <span className="badge-cancelled">{status}</span>;
    return <span className="badge-pending">{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">WORK DONE</h1>
          <p className="text-dark-400 text-sm font-body mt-1">Last 12 months history</p>
        </div>
        <button onClick={() => navigate("/new-work")} className="btn-primary">
          <MdAdd />
          New Work
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-xl" />
            <input
              type="text"
              placeholder="Search by work or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); fetchWorks(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
              >
                <MdClose />
              </button>
            )}
          </div>
          <button type="submit" className="btn-secondary px-4">
            <MdSearch />
          </button>
        </form>

        <div className="flex gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-body ${
                statusFilter === s
                  ? "bg-brand-500 text-white"
                  : "bg-dark-700 text-dark-300 hover:text-white border border-dark-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Work List */}
      {loading ? (
        <Loader text="Loading work records..." />
      ) : works.length === 0 ? (
        <div className="text-center py-20">
          <MdCheckCircle className="text-6xl text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 font-body text-lg">No work records found</p>
          <button onClick={() => navigate("/new-work")} className="btn-primary mx-auto mt-4">
            <MdAdd />
            Create First Work Order
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {works.map((w) => (
            <div
              key={w._id}
              className="card p-5 hover:border-dark-600 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 flex-wrap">
                    <h3 className="font-body font-semibold text-white text-base leading-tight flex-1">
                      {w.workDescription}
                    </h3>
                    <StatusBadge status={w.status} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-1.5 text-dark-400 text-sm">
                      <MdPending className="text-brand-500 flex-shrink-0 text-base" />
                      <span className="truncate font-body">{w.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-dark-400 text-sm">
                      <MdPhone className="text-brand-500 flex-shrink-0 text-base" />
                      <span className="font-mono">{w.customerPhone}</span>
                    </div>
                    {(w.vehicleName || w.vehicleModel) && (
                      <div className="flex items-center gap-1.5 text-dark-400 text-sm">
                        <MdDirectionsCar className="text-brand-500 flex-shrink-0 text-base" />
                        <span className="truncate font-body">{w.vehicleName} {w.vehicleModel}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial info if done */}
                  {w.status === "Done" && (
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-dark-700">
                      <div className="flex items-center gap-1.5 text-sm">
                        <MdCurrencyRupee className="text-green-400 text-base" />
                        <span className="text-green-400 font-mono">{formatCurrency(w.paymentReceived)}</span>
                        <span className="text-dark-500 font-body text-xs">received</span>
                      </div>
                      {w.outsideExpense > 0 && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <MdCurrencyRupee className="text-red-400 text-base" />
                          <span className="text-red-400 font-mono">{formatCurrency(w.outsideExpense)}</span>
                          <span className="text-dark-500 font-body text-xs">outside</span>
                        </div>
                      )}
                      {w.remainingPayment > 0 && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <MdCurrencyRupee className="text-yellow-400 text-base" />
                          <span className="text-yellow-400 font-mono">{formatCurrency(w.remainingPayment)}</span>
                          <span className="text-dark-500 font-body text-xs">remaining</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancellation */}
                  {w.status === "Cancelled" && w.cancellationRemarks && (
                    <p className="text-red-400/70 text-sm mt-2 font-body">
                      Reason: {w.cancellationRemarks}
                    </p>
                  )}
                </div>

                {/* Right */}
                <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-dark-500 text-xs font-mono">
                    <MdCalendarToday className="text-base" />
                    {formatDate(w.createdAt)}
                  </div>

                  {w.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(w, "done")}
                        className="btn-success text-xs py-1.5 px-3"
                      >
                        <MdDone />
                        Mark Done
                      </button>
                      <button
                        onClick={() => openModal(w, "cancel")}
                        className="btn-danger text-xs py-1.5 px-3"
                      >
                        <MdCancel />
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => openModal(w, "view")}
                    className="text-brand-400 text-xs font-body hover:text-brand-300 transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mark Done Modal */}
      <Modal
        isOpen={modalType === "done"}
        onClose={closeModal}
        title="MARK WORK DONE"
        size="sm"
      >
        <form onSubmit={handleMarkDone} className="space-y-4">
          {selectedWork && (
            <div className="bg-dark-700/50 rounded-xl p-3 border border-dark-700">
              <p className="text-white text-sm font-body font-medium">{selectedWork.workDescription}</p>
              <p className="text-dark-400 text-xs mt-0.5 font-body">{selectedWork.customerName}</p>
            </div>
          )}
          <div>
            <label className="label">Payment Received (₹)</label>
            <input
              type="number"
              value={doneForm.paymentReceived}
              onChange={(e) => setDoneForm({ ...doneForm, paymentReceived: e.target.value })}
              placeholder="0"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="label">Outside Expense (₹)</label>
            <input
              type="number"
              value={doneForm.outsideExpense}
              onChange={(e) => setDoneForm({ ...doneForm, outsideExpense: e.target.value })}
              placeholder="0"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="label">Remaining Payment (₹)</label>
            <input
              type="number"
              value={doneForm.remainingPayment}
              onChange={(e) => setDoneForm({ ...doneForm, remainingPayment: e.target.value })}
              placeholder="0"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="label">Completion Date</label>
            <input
              type="date"
              value={doneForm.completionDate}
              onChange={(e) => setDoneForm({ ...doneForm, completionDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-success flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Mark as Done"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={modalType === "cancel"}
        onClose={closeModal}
        title="CANCEL WORK"
        size="sm"
      >
        <form onSubmit={handleMarkCancelled} className="space-y-4">
          {selectedWork && (
            <div className="bg-dark-700/50 rounded-xl p-3 border border-dark-700">
              <p className="text-white text-sm font-body font-medium">{selectedWork.workDescription}</p>
              <p className="text-dark-400 text-xs mt-0.5 font-body">{selectedWork.customerName}</p>
            </div>
          )}
          <div>
            <label className="label">Cancellation Reason (Optional)</label>
            <textarea
              value={cancelForm.cancellationRemarks}
              onChange={(e) => setCancelForm({ cancellationRemarks: e.target.value })}
              placeholder="Why was this work cancelled?"
              className="input-field resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1" disabled={saving}>
              Keep Pending
            </button>
            <button type="submit" disabled={saving} className="btn-danger flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Cancel Work"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={modalType === "view"}
        onClose={closeModal}
        title="WORK DETAILS"
        size="md"
      >
        {selectedWork && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3 className="font-body font-semibold text-white text-lg">{selectedWork.workDescription}</h3>
              <StatusBadge status={selectedWork.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Customer Name", value: selectedWork.customerName, icon: MdPending },
                { label: "Phone", value: selectedWork.customerPhone, icon: MdPhone },
                { label: "Address", value: selectedWork.customerAddress || "—", icon: MdBuild },
                { label: "Vehicle", value: `${selectedWork.vehicleName || ""} ${selectedWork.vehicleModel || ""}`.trim() || "—", icon: MdDirectionsCar },
                { label: "Created", value: formatDate(selectedWork.createdAt), icon: MdCalendarToday },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon className="text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-dark-500 text-xs font-mono">{label}</p>
                    <p className="text-white text-sm font-body">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedWork.status === "Done" && (
              <div className="border-t border-dark-700 pt-4">
                <p className="text-dark-400 text-xs font-mono uppercase tracking-widest mb-3">Payment Details</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <p className="text-dark-400 text-xs font-mono">Received</p>
                    <p className="text-green-400 font-mono font-semibold">{formatCurrency(selectedWork.paymentReceived)}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-dark-400 text-xs font-mono">Outside</p>
                    <p className="text-red-400 font-mono font-semibold">{formatCurrency(selectedWork.outsideExpense)}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                    <p className="text-dark-400 text-xs font-mono">Remaining</p>
                    <p className="text-yellow-400 font-mono font-semibold">{formatCurrency(selectedWork.remainingPayment)}</p>
                  </div>
                </div>
                <p className="text-dark-500 text-xs font-mono mt-2">Completed: {formatDate(selectedWork.completionDate)}</p>
              </div>
            )}

            {selectedWork.status === "Cancelled" && (
              <div className="border-t border-dark-700 pt-4">
                <p className="text-red-400 text-sm font-body">
                  <span className="text-dark-400 font-mono text-xs">Cancelled on: </span>
                  {formatDate(selectedWork.cancellationDate)}
                </p>
                {selectedWork.cancellationRemarks && (
                  <p className="text-red-400/80 text-sm font-body mt-1">
                    Reason: {selectedWork.cancellationRemarks}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkDone;
