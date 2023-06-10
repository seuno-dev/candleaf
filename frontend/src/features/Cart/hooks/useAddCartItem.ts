import { useMutation } from "@tanstack/react-query";
import { WriteCartItem } from "../types";
import { createCartItem } from "../api";

const useAddCartItem = () =>
  useMutation({
    mutationFn: (cartItem: WriteCartItem) => createCartItem(cartItem),
  });

export default useAddCartItem;
