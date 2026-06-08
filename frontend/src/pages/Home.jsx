import { useNavigate } from "react-router-dom";
import {
  MdDirectionsCar,
  MdBuild,
  MdPeople,
  MdStar,
  MdPhone,
  MdLocationOn,
  MdSpeed,
  MdVerified,
  MdHandyman,
  MdArrowForward,
} from "react-icons/md";

const highlights = [
  {
    icon: MdBuild,
    title: "Expert Repairs",
    desc: "Full-service mechanical and electrical repairs for all Force Motors vehicles.",
  },
  {
    icon: MdVerified,
    title: "Genuine Parts",
    desc: "Only authentic Force Motors spare parts used in every repair.",
  },
  {
    icon: MdSpeed,
    title: "Fast Turnaround",
    desc: "Quick diagnostics and efficient service to get you back on road.",
  },
  {
    icon: MdHandyman,
    title: "Skilled Technicians",
    desc: "Experienced team with deep expertise in Force Motors vehicles.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #f97316 0px,
              #f97316 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/5 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 mb-6">
              <MdStar className="text-brand-400 text-sm" />
              <span className="text-brand-300 text-xs font-mono tracking-widest uppercase">
                Authorized Workshop
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wider leading-none mb-3">
              SHREE RAM
            </h1>
            <h2 className="font-display text-3xl sm:text-5xl text-brand-400 tracking-widest leading-none mb-6">
              FORCE MOTORS
            </h2>
            <p className="text-dark-300 font-body text-lg leading-relaxed mb-8 max-w-md">
              Your trusted Force Motors workshop in Sirsa. Expert service,
              genuine parts, and experienced technicians for all your vehicle
              needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/new-work")}
                className="btn-primary px-6 py-3 text-base shadow-glow"
              >
                <MdBuild />
                New Work Order
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-secondary px-6 py-3 text-base"
              >
                <MdArrowForward />
                View Dashboard
              </button>
            </div>
            <div className="flex items-center gap-2 mt-6 text-dark-400 text-sm font-body">
              <MdLocationOn className="text-brand-500" />
              Shiv Nagar, Kanganpur Road, Sirsa
            </div>
          </div>

          {/* Right — large icon */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-brand-500/10 rounded-3xl border border-brand-500/20 flex items-center justify-center shadow-glow-lg">
                <MdDirectionsCar className="text-[120px] text-brand-400 opacity-80" />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-dark-700 border border-dark-600 rounded-2xl flex items-center justify-center">
                <MdBuild className="text-3xl text-brand-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-dark-700 border border-dark-600 rounded-xl flex items-center justify-center">
                <MdVerified className="text-2xl text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl text-white tracking-widest mb-2">
            WHY CHOOSE US
          </h2>
          <p className="text-dark-400 font-body">
            Trusted by customers across Sirsa for quality service
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card p-6 hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-all">
                <Icon className="text-2xl text-brand-400" />
              </div>
              <h3 className="font-display text-lg text-white tracking-wider mb-2">
                {title}
              </h3>
              <p className="text-dark-400 text-sm font-body leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <h3 className="font-display text-2xl text-white tracking-widest">
              MANAGE YOUR WORKSHOP
            </h3>
            <p className="text-brand-200 font-body mt-1">
              Track work orders, staff, and business analytics from one place.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/staff")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-body"
            >
              <MdPeople />
              Staff
            </button>
            <button
              onClick={() => navigate("/work-done")}
              className="bg-white text-brand-700 hover:bg-brand-50 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-body"
            >
              View Records
              <MdArrowForward />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
