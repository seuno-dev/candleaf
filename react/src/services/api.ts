import { login, logout, instance, REFRESH_KEY } from "./client";

export { login, logout };

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};

export type User = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};
export const retrieveProfile = async () => {
  const response = await instance.get<User>("/auth/users/me/");
  return response.data;
};

export type ProductImageResponse = {
  id: number;
  image: string;
};
export type ProductResponse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  unit_price: number;
  inventory: number;
  collection: number;
  images: ProductImageResponse[];
};
export type ProductListResponse = ProductResponse[];
export const retrieveProductsList = async () => {
  const response = await instance.get<ProductListResponse>("/store/products/");
  return response.data;
};

export const retrieveProductDetail = async (slug: string) => {
  const response = await instance.get<ProductResponse>(
    `/store/products/${slug}/`
  );
  return response.data;
};

export const createCartItem = async (productId: number) => {
  try {
    const response = await instance.post("/store/cart-items/", {
      product_id: productId,
      quantity: 1,
    });
    return response.status === 201;
  } catch (e) {
    return false;
  }
};

type SimpleProduct = {
  id: number;
  title: string;
  unit_price: number;
  inventory: number;
};
export type CartItemListResponse = {
  id: number;
  product: SimpleProduct;
  quantity: number;
  total_price: number;
};
export const retrieveCartItemList = async () => {
  const response = await instance.get<CartItemListResponse[]>(
    "/store/cart-items/"
  );
  return response.data;
};

export const updateCartItemQuantity = async (
  id: number,
  newQuantity: number
) => {
  const response = await instance.patch(`/store/cart-items/${id}/`, {
    quantity: newQuantity,
  });
  return response.status === 200;
};
