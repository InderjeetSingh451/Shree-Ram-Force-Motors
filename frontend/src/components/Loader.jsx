const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 border-2 border-dark-600 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-dark-400 font-body text-sm">{text}</p>
    </div>
  );
};

export default Loader;
