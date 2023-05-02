import { useQuery } from "@tanstack/react-query";
import { retrieveProductList } from "../api";
import { ProductFilterParams } from "../types";

const useProducts = (query: ProductFilterParams) =>
  useQuery({
    queryKey: [
      "products",
      query.page,
      query.title,
      query.category,
      query.priceMin,
      query.priceMax,
    ],
    queryFn: () => retrieveProductList(query),
  });

export default useProducts;
