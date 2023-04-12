import { client } from "../../../api";
import { CreatePayment } from "../types";

export const createPayment = async (orderId: string) => {
  const response = await client.post<CreatePayment>(
    "/store/orders/create_payment",
    {
      order_id: orderId,
    }
  );
  return response.data.clientSecret;
};

export const submitPayment = async (paymentMethodId: string) => {
  const response = await client.post("/store/payments/", {
    payment_method_id: paymentMethodId,
  });
  return response.status === 200;
};
