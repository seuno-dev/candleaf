import { useQuery } from "@tanstack/react-query";
import { retrieveFeaturedProducts } from "../api";

const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["featured_products"],
    queryFn: retrieveFeaturedProducts,
  });

export default useFeaturedProducts;
