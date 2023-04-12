import { client } from "../../../api";
import { OrderList, SubmitOrder } from "../types";

export const submitOrder = async () => {
  const response = await client.post<SubmitOrder>("/store/orders/");
  return response.data.orderId;
};

export const retrieveOrderList = async (): Promise<OrderList> => {
  const response = await client.get<OrderList>("/store/orders/");
  return response.data;
};
