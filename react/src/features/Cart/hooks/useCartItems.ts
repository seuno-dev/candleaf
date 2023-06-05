import { useQuery } from "@tanstack/react-query";
import { retrieveCartItems } from "../api";

const useCartItems = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: retrieveCartItems,
  });

export default useCartItems;
