import { Product } from "../../Products/types";
import { client } from "../../../api";

export const retrieveFeaturedProducts = async (): Promise<Product[]> => {
  const response = await client.get<Product[]>("/store/products/featured/");
  return response.data;
};
