import { useEffect, useState } from "react";
import {
  CartItemListResponse,
  retrieveCartItemList,
  updateCartItemQuantity,
} from "../../services/api";

export const useCart = () => {
  const [cartItemList, setCartItemList] = useState<CartItemListResponse[]>([]);

  const updateItemQuantity = async (id: number, newQuantity: number) => {
    return await updateCartItemQuantity(id, newQuantity);
  };

  useEffect(() => {
    retrieveCartItemList().then((items) => setCartItemList(items));
  }, []);

  return { setCartItemList, cartItemList, updateItemQuantity };
};
