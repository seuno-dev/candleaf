export const toCurrencyString = (raw: number) => {
  return raw.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
