export const formatCurrency = (amount) => {
  const n = Number(amount || 0);
  return n.toLocaleString("en-BD");
};

export default formatCurrency;
