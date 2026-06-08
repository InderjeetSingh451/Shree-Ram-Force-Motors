import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdDirectionsCar, MdLogin } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form.email, form.password);
    if (success) navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #f97316 0px,
            #f97316 1px,
            transparent 1px,
            transparent 50px
          )`,
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-700/10 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow mb-4">
              <MdDirectionsCar className="text-3xl text-white" />
            </div>
            <h1 className="font-display text-3xl text-white tracking-widest">
              SHREE RAM
            </h1>
            <p className="text-brand-400 font-mono text-xs tracking-widest mt-1">
              FORCE MOTORS
            </p>
            <p className="text-dark-400 text-sm mt-3 font-body">
              Admin Login Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@srfm.com"
                  className="input-field pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-16"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 text-xs font-mono transition-colors"
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <MdLogin className="text-lg" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-dark-700 text-center">
            <p className="text-dark-500 text-xs font-mono">
              SHIV NAGAR · KANGANPUR ROAD · SIRSA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
