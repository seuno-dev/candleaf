import { client, login, logout, REFRESH_KEY } from "./axios";
import {
  Category,
  CreatePayment,
  OrderList,
  SubmitOrder,
  User,
} from "../types";

export { client, login, logout };

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};

export const retrieveProfile = async (): Promise<User> => {
  const response = await client.get<User>("/auth/users/me/");
  return response.data;
};

export const retrieveCategoryList = async (): Promise<Category[]> => {
  const response = await client.get<Category[]>("/store/categories/");
  return response.data;
};

export const submitOrder = async () => {
  const response = await client.post<SubmitOrder>("/store/orders/");
  return response.data.orderId;
};

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

export const retrieveOrderList = async (): Promise<OrderList> => {
  const response = await client.get<OrderList>("/store/orders/");
  return response.data;
};
