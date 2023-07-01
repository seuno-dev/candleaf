import { CartItem } from "../types";

export const getTotalPrice = (cartItems: CartItem[]) =>
  cartItems.reduce(
    (previousItem, currentItem) => previousItem + currentItem.totalPrice,
    0
  );
