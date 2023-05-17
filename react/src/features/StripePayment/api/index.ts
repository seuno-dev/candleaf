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
