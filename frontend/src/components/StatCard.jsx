const StatCard = ({ label, value, icon: Icon, color = "brand", sub }) => {
  const colorMap = {
    brand: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="stat-card hover:border-dark-600 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-xs font-mono uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-display tracking-wider text-white mt-1">{value}</p>
          {sub && <p className="text-dark-500 text-xs mt-1 font-body">{sub}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
