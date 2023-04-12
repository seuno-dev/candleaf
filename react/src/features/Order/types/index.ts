import { SimpleProduct } from "../../Products/types";

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

export type SubmitOrder = {
  orderId: string;
};
