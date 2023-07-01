import { client } from "../../../api";
import { FeaturedProduct } from "../types";

export const retrieveFeaturedProducts = async (): Promise<
  FeaturedProduct[]
> => {
  const response = await client.get<FeaturedProduct[]>(
    "/store/products/featured/"
  );
  return response.data;
};
