import { client } from "../../../api";
import {
  CreateReview,
  Order,
  OrderList,
  OrderTimeFilter,
  SubmitOrder,
} from "../types";
import { decamelizeKeys } from "humps";

export const submitOrder = async () => {
  const response = await client.post<SubmitOrder>("/store/orders/");
  return response.data.orderId;
};

export const retrieveOrderList = async (
  params: OrderTimeFilter
): Promise<OrderList> => {
  const response = await client.get<OrderList>("/store/orders/", {
    params: decamelizeKeys(params),
  });
  return response.data;
};

export const retrieveOrder = async (id: number): Promise<Order> => {
  const response = await client.get<Order>(`/store/orders/${id}/`);
  return response.data;
};

export const submitReview = async (review: CreateReview) => {
  const response = await client.post<CreateReview>(
    "/store/reviews/",
    decamelizeKeys(review)
  );
  return response.status == 201;
};
