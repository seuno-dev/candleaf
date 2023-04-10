import { createPayment, submitPayment } from "../../api/api";

export const usePayment = () => {
  const doPayment = async (paymentMethodId: string) => {
    return await submitPayment(paymentMethodId);
  };

  const getClientSecret = async (orderId: string) => {
    return await createPayment(orderId);
  };

  return { getClientSecret, doPayment };
};
