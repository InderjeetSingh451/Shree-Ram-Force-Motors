import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdAddBox,
  MdPerson,
  MdPhone,
  MdLocationOn,
  MdDirectionsCar,
  MdBuild,
} from "react-icons/md";
import api from "../services/api";
import { toast } from "react-toastify";

const NewWork = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    workDescription: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    vehicleName: "",
    vehicleModel: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/work/add", form);
      if (res.data.success) {
        toast.success("Work order created successfully!");
        setForm({
          workDescription: "",
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          vehicleName: "",
          vehicleModel: "",
        });
        navigate("/work-done");
      } else {
        toast.error(res.data.message || "Failed to create work order");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors text-sm font-body"
      >
        <MdArrowBack />
        Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center">
          <MdAddBox className="text-brand-400 text-xl" />
        </div>
        <div>
          <h1 className="page-title">NEW WORK ORDER</h1>
          <p className="text-dark-400 text-sm font-body">Create a new workshop job entry</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Details */}
          <div>
            <h2 className="text-sm font-mono text-dark-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <MdBuild className="text-brand-500" />
              Work Details
            </h2>
            <div>
              <label className="label">Work Description *</label>
              <textarea
                name="workDescription"
                value={form.workDescription}
                onChange={handleChange}
                placeholder="Describe the work to be done (e.g., Engine oil change, Brake pad replacement...)"
                className="input-field resize-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h2 className="text-sm font-mono text-dark-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <MdPerson className="text-brand-500" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Customer Name *</label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Customer's full name"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Mobile Number *</label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Customer Address</label>
                <div className="relative">
                  <MdLocationOn className="absolute left-3 top-3 text-dark-400" />
                  <textarea
                    name="customerAddress"
                    value={form.customerAddress}
                    onChange={handleChange}
                    placeholder="Customer's address"
                    className="input-field pl-10 resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <h2 className="text-sm font-mono text-dark-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <MdDirectionsCar className="text-brand-500" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Vehicle Name</label>
                <div className="relative">
                  <MdDirectionsCar className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    name="vehicleName"
                    value={form.vehicleName}
                    onChange={handleChange}
                    placeholder="e.g. Force Traveller"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="label">Vehicle Model / Number</label>
                <input
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g. HR-26-AB-1234"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Status info */}
          <div className="flex items-center gap-2 bg-dark-700/50 border border-dark-700 rounded-xl p-4">
            <div className="badge-pending">Pending</div>
            <p className="text-dark-400 text-sm font-body">
              Work will be saved as <span className="text-yellow-400">Pending</span>. You can mark it as Done or Cancelled later.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <MdAddBox />
                  Create Work Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWork;
