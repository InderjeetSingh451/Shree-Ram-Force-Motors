import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDirectionsCar } from "react-icons/md";
import logo from "../assets/logo.png";
const Intro = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("srfm_token");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 3600); // slightly after animation ends at 3s

    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div className="intro-screen fixed inset-0 z-[100] bg-dark-950 flex flex-col items-center justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #f97316 0px,
              #f97316 1px,
              transparent 1px,
              transparent 40px
            )`,
          }}
        />
      </div>

      {/* Glow */}
      <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6 text-center px-8">
        {/* Logo icon */}
        <div className="intro-logo w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow-lg">
          <img
            src={logo}
            alt="SHREE RAM Force Motors"
            className="w-24 h-24 rounded-lg object-contain"
          />
        </div>

        {/* Name */}
        <div>
          <h1 className="intro-title font-display text-5xl sm:text-7xl text-white tracking-[0.2em] leading-none">
            SHREE RAM
          </h1>
          <h2 className="intro-subtitle font-display text-2xl sm:text-4xl text-brand-400 tracking-[0.4em] mt-1">
            FORCE MOTORS
          </h2>
          <p className="intro-subtitle text-dark-400 font-body text-sm mt-3 tracking-widest uppercase font-mono">
            Auto Market, Sirsa
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-0.5 bg-dark-700 rounded-full overflow-hidden mt-4">
          <div className="intro-progress h-full bg-gradient-to-r from-brand-500 to-brand-300 rounded-full" />
        </div>
        <p className="text-dark-500 text-xs font-mono tracking-widest animate-pulse">
          INITIALIZING...
        </p>
      </div>
    </div>
  );
};

export default Intro;
