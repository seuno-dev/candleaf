import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem, WriteCartItem } from "../types";
import { updateCartItemQuantity } from "../api";
import { CACHE_KEY_CART } from "../constant";

interface Context {
  previousCartItems: CartItem[];
}

const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<WriteCartItem, Error, CartItem, Context>({
    mutationFn: (cartItem: CartItem) =>
      updateCartItemQuantity({
        id: cartItem.id,
        productId: cartItem.product.id,
        quantity: cartItem.quantity,
      }),
    onMutate: (newCartItem: CartItem) => {
      const previousCartItems =
        queryClient.getQueryData<CartItem[]>(CACHE_KEY_CART) || [];

      queryClient.setQueryData<CartItem[]>(CACHE_KEY_CART, (cartItems = []) =>
        cartItems.map((cartItem) => {
          if (cartItem.id == newCartItem.id) {
            return newCartItem;
          }
          return cartItem;
        })
      );

      return { previousCartItems };
    },
    onSuccess: (savedCartItem, newCartItem) => {
      queryClient.setQueryData<CartItem[]>(CACHE_KEY_CART, (cartItems = []) =>
        cartItems.map((cartItem) => {
          if (cartItem.id === savedCartItem.id) {
            return {
              ...cartItem,
              quantity: savedCartItem.quantity,
              totalPrice: savedCartItem.quantity * cartItem.product.unitPrice,
            };
          }
          return cartItem;
        })
      );
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

export default useUpdateCartItem;
