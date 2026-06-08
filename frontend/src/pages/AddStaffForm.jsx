import { useState } from "react";
import { MdCloudUpload, MdPerson } from "react-icons/md";
import api from "../services/api";
import { toast } from "react-toastify";

const AddStaffForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    joiningDate: "",
    monthlySalary: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gender) {
      toast.error("Please select gender");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append("imageUrl", imageFile);

      const res = await api.post("/api/staff/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onSuccess();
      } else {
        toast.error(res.data.message || "Failed to add staff");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-xl bg-dark-700 border-2 border-dashed border-dark-600 flex items-center justify-center overflow-hidden hover:border-brand-500/50 transition-all cursor-pointer relative">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <MdPerson className="text-4xl text-dark-500" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-center">
          <label className="cursor-pointer text-brand-400 text-sm font-body hover:text-brand-300 transition-colors flex items-center gap-1.5 justify-center">
            <MdCloudUpload />
            {imageFile ? imageFile.name : "Upload Profile Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
          <p className="text-dark-500 text-xs mt-1">Optional · Max 5MB</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Rajesh Kumar"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="rajesh@example.com"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">Phone Number *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="98XXXXXXXX"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">Gender *</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="label">Joining Date *</label>
          <input
            name="joiningDate"
            type="date"
            value={form.joiningDate}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">Monthly Salary (₹) *</label>
          <input
            name="monthlySalary"
            type="number"
            value={form.monthlySalary}
            onChange={handleChange}
            placeholder="10000"
            className="input-field"
            required
            min="1"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Home address..."
            className="input-field resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
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
              Adding...
            </>
          ) : (
            "Add Staff Member"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddStaffForm;
