import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdCheckCircle,
  MdAddBox,
  MdContactPhone,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { to: "/staff", label: "Staff Info", icon: MdPeople },
  { to: "/work-done", label: "Work Done", icon: MdCheckCircle },
  { to: "/new-work", label: "New Work", icon: MdAddBox },
  { to: "/contact", label: "Contact", icon: MdContactPhone },
];

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <img
                src={logo}
                alt="SHREE RAM Force Motors"
                className="w-9 h-9 rounded-lg object-contain"
              />
              <div className="hidden sm:block">
                <p className="font-display text-white tracking-widest text-lg leading-none">
                  SHREE RAM
                </p>
                <p className="text-brand-400 text-xs font-mono tracking-widest leading-none mt-0.5">
                  FORCE MOTORS
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                        : "text-dark-300 hover:text-white hover:bg-dark-700"
                    }`
                  }
                >
                  <Icon className="text-base" />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Logout */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <MdLogout className="text-base" />
                Logout
              </button>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-dark-300 hover:text-white p-2 rounded-lg hover:bg-dark-700 transition-all"
              >
                {mobileOpen ? (
                  <MdClose className="text-xl" />
                ) : (
                  <MdMenu className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-dark-900 border-t border-dark-700 px-4 pb-4 pt-2 animate-slide-down">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                    isActive
                      ? "bg-brand-500/20 text-brand-400"
                      : "text-dark-300 hover:text-white hover:bg-dark-700"
                  }`
                }
              >
                <Icon className="text-lg" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full mt-1"
            >
              <MdLogout className="text-lg" />
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
