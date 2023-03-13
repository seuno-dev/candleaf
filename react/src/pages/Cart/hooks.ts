import { useEffect, useState } from "react";
import {
  CartItemResponse,
  deleteCartItem,
  retrieveCartItemList,
  updateCartItemQuantity,
} from "../../services/api";

export const useCart = () => {
  const [cartItemList, setCartItemList] = useState<CartItemResponse[]>([]);

  const updateItemQuantity = async (id: number, newQuantity: number) => {
    return await updateCartItemQuantity(id, newQuantity);
  };

  const deleteItem = async (id: number) => {
    return await deleteCartItem(id);
  };

  useEffect(() => {
    retrieveCartItemList().then((items) => setCartItemList(items));
  }, []);

  return { setCartItemList, cartItemList, updateItemQuantity, deleteItem };
};
