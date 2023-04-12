import { SimpleProduct } from "../../Products/types";

export type CartItem = {
  id: number;
  product: SimpleProduct;
  quantity: number;
  totalPrice: number;
};
