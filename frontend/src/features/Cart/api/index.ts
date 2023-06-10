import { client } from "../../../api";
import { CartItem, WriteCartItem } from "../types";
import { decamelizeKeys } from "humps";

export const retrieveCartItems = async (): Promise<CartItem[]> => {
  const response = await client.get<CartItem[]>("/store/cart-items/");
  return response.data;
};

export const createCartItem = async (cartItem: WriteCartItem) => {
  const response = await client.post(
    "/store/cart-items/",
    decamelizeKeys(cartItem)
  );
  return response.status === 201;
};

export const updateCartItemQuantity = async (cartItem: WriteCartItem) => {
  const response = await client.patch<WriteCartItem>(
    `/store/cart-items/${cartItem.id}/`,
    {
      quantity: cartItem.quantity,
    }
  );
  return response.data;
};

export const deleteCartItem = async (cartItem: CartItem) => {
  const response = await client.delete(`/store/cart-items/${cartItem.id}/`);
  return response.status === 204;
};
