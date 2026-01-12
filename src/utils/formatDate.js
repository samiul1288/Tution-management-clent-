export const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default formatDate;
