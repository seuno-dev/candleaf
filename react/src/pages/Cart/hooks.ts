import { useEffect, useState } from "react";
import {
  CartItemResponse,
  deleteCartItem,
  retrieveCartItemList,
  updateCartItemQuantity,
  submitOrder,
} from "../../services/api";

export const useCart = () => {
  const [cartItemList, setCartItemList] = useState<CartItemResponse[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const updateItemQuantity = async (id: number, newQuantity: number) => {
    return await updateCartItemQuantity(id, newQuantity);
  };

  const deleteItem = async (id: number) => {
    return await deleteCartItem(id);
  };

  const createOrder = async () => {
    return await submitOrder();
  };

  useEffect(() => {
    retrieveCartItemList().then((items) => setCartItemList(items));
  }, []);

  useEffect(() => {
    setTotalPrice(
      cartItemList.reduce(
        (previousItem, currentItem) => previousItem + currentItem.total_price,
        0
      )
    );
  }, [cartItemList]);

  return {
    setCartItemList,
    cartItemList,
    updateItemQuantity,
    deleteItem,
    totalPrice,
    createOrder,
  };
};
