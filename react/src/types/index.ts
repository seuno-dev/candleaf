import { SimpleProduct } from "../features/Products/types";

export type Category = {
  id: number;
  title: string;
  slug: string;
};

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  product: SimpleProduct;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  orderTime: string;
};

export type OrderList = {
  results: Order[];
  totalPages: number;
};

export type CreatePayment = {
  clientSecret: string;
};

export type SubmitOrder = {
  orderId: string;
};
