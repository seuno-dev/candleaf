import { useQuery } from "@tanstack/react-query";
import { retrieveProductDetail } from "../api";
import { Product } from "../types";

const useProduct = (slug: string) =>
  useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => retrieveProductDetail(slug),
  });

export default useProduct;
