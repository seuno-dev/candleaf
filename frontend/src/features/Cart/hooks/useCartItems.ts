import { useQuery } from "@tanstack/react-query";
import { retrieveCartItems } from "../api";
import { CACHE_KEY_CART } from "../constant";

const useCartItems = () =>
  useQuery({
    queryKey: CACHE_KEY_CART,
    queryFn: retrieveCartItems,
  });

export default useCartItems;
