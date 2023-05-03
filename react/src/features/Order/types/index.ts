import { SimpleProduct } from "../../Products/types";
import { SimpleReview } from "../../../types";

export type OrderItem = {
  id: string;
  orderId: string;
  product: SimpleProduct;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  review: SimpleReview | null;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  orderTime: string;
  status: string;
};

export type OrderList = {
  results: Order[];
  totalPages: number;
};

export type SubmitOrder = {
  orderId: string;
};
