import { client } from "../../../api";
import { CartItem } from "../types";

export const retrieveCartItemList = async (): Promise<CartItem[]> => {
  const response = await client.get<CartItem[]>("/store/cart-items/");
  return response.data;
};

export const updateCartItemQuantity = async (
  id: number,
  newQuantity: number
) => {
  const response = await client.patch(`/store/cart-items/${id}/`, {
    quantity: newQuantity,
  });
  return response.status === 200;
};

export const deleteCartItem = async (id: number) => {
  const response = await client.delete(`/store/cart-items/${id}/`);
  return response.status === 204;
};
