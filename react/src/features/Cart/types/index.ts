import { SimpleProduct } from "../../Products/types";

export type CartItem = {
  id: number;
  product: SimpleProduct;
  quantity: number;
  totalPrice: number;
};

export type WriteCartItem = {
  id: number;
  productId: number;
  quantity: number;
}
