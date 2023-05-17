import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "../types";
import { deleteCartItem } from "../api";
import { CACHE_KEY_CART } from "../constant";

interface Context {
  previousCartItems: CartItem[];
}

const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, CartItem, Context>({
    mutationFn: (cartItem: CartItem) => deleteCartItem(cartItem),
    onMutate: (cartItemToDelete: CartItem) => {
      const previousCartItems =
        queryClient.getQueryData<CartItem[]>(CACHE_KEY_CART) || [];

      queryClient.setQueryData<CartItem[]>(CACHE_KEY_CART, (cartItems = []) =>
        cartItems.filter((cartItem) => cartItem !== cartItemToDelete)
      );

      return { previousCartItems };
    },
    onError: (error, newCartItem, context) => {
      if (!context) return;

      queryClient.setQueryData<CartItem[]>(
        CACHE_KEY_CART,
        context.previousCartItems
      );
    },
  });
};

export default useDeleteCartItem;
