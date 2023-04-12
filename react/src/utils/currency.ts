export const formatCurrency = (raw: number) => {
  return raw.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
