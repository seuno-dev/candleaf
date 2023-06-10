import { client } from "../../../api";
import { decamelizeKeys } from "humps";
import { Product, ProductFilterParams, ProductList } from "../types";

export const retrieveProductList = async (
  params: ProductFilterParams
): Promise<ProductList> => {
  const response = await client.get<ProductList>("/store/products/", {
    params: decamelizeKeys(params),
  });
  return response.data;
};

export const retrieveProductDetail = async (slug: string): Promise<Product> => {
  const response = await client.get<Product>(`/store/products/${slug}/`);
  return response.data;
};
