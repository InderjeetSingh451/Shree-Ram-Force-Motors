import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdAdd,
  MdSearch,
  MdPhone,
  MdLocationOn,
  MdArrowForward,
  MdClose,
} from "react-icons/md";
import api from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { getInitials } from "../utils/helpers";
import AddStaffForm from "./AddStaffForm";

const StaffList = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/staff/");
      if (res.data.success) setStaff(res.data.staff);
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filtered = staff.filter((s) =>
    `${s.name} ${s.phone} ${s.address}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchStaff();
    toast.success("Staff member added!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">STAFF INFO</h1>
          <p className="text-dark-400 text-sm font-body mt-1">
            {staff.length} active member{staff.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <MdAdd className="text-lg" />
          Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-xl" />
        <input
          type="text"
          placeholder="Search by name, phone or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 pr-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
          >
            <MdClose />
          </button>
        )}
      </div>

      {/* Staff Grid */}
      {loading ? (
        <Loader text="Loading staff..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <MdPeople className="text-6xl text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 font-body text-lg">
            {search ? "No staff found matching your search" : "No staff members yet"}
          </p>
          {!search && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mx-auto mt-4"
            >
              <MdAdd />
              Add First Staff Member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/staff/${s._id}`)}
              className="card p-5 cursor-pointer hover:border-brand-500/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-dark-600 group-hover:border-brand-500/50 transition-all flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center flex-shrink-0 group-hover:border-brand-500/60 transition-all">
                    <span className="font-display text-xl text-brand-400">
                      {getInitials(s.name)}
                    </span>
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-white tracking-wider truncate">
                    {s.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-dark-400 text-sm mt-1">
                    <MdPhone className="text-brand-500 flex-shrink-0" />
                    <span className="font-mono truncate">{s.phone}</span>
                  </div>
                  {s.address && (
                    <div className="flex items-center gap-1.5 text-dark-400 text-xs mt-1">
                      <MdLocationOn className="text-brand-500 flex-shrink-0" />
                      <span className="truncate">{s.address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                <span className="text-dark-400 text-xs font-mono">
                  ₹{Number(s.monthlySalary).toLocaleString("en-IN")}/mo
                </span>
                <span className="text-brand-400 text-sm flex items-center gap-1 font-body font-medium group-hover:gap-2 transition-all">
                  View Profile <MdArrowForward />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="ADD NEW STAFF"
        size="lg"
      >
        <AddStaffForm onSuccess={handleAddSuccess} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
};

export default StaffList;
