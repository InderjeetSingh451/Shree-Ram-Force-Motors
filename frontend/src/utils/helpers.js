// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Format date as DD-MM-YYYY
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Format date range
export const formatDateRange = (start, end) => {
  return `${formatDate(start)} → ${formatDate(end)}`;
};

// Get initials from name
export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Net remaining for a salary period
export const calcRemaining = (period) => {
  if (!period) return 0;
  return (
    (period.salaryDue || 0) +
    (period.remainingFromPrevious || 0) -
    (period.totalPaid || 0)
  );
};
