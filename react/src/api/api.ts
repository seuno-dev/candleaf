import { decamelizeKeys } from "humps";
import { instance, login, logout, REFRESH_KEY } from "./axios";
import {
  CartItem,
  Category,
  CreatePayment,
  OrderList,
  Product,
  ProductFilterParams,
  ProductList,
  SubmitOrder,
  User,
} from "../types";

export { login, logout };

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};

export const retrieveProfile = async (): Promise<User> => {
  const response = await instance.get<User>("/auth/users/me/");
  return response.data;
};

export const retrieveProductList = async (
  params: ProductFilterParams
): Promise<ProductList> => {
  const response = await instance.get<ProductList>("/store/products/", {
    params: decamelizeKeys(params),
  });
  return response.data;
};

export const retrieveProductDetail = async (slug: string): Promise<Product> => {
  const response = await instance.get<Product>(`/store/products/${slug}/`);
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

export const retrieveCategoryList = async (): Promise<Category[]> => {
  const response = await instance.get<Category[]>("/store/categories/");
  return response.data;
};

export const retrieveCartItemList = async (): Promise<CartItem[]> => {
  const response = await instance.get<CartItem[]>("/store/cart-items/");
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

export const deleteCartItem = async (id: number) => {
  const response = await instance.delete(`/store/cart-items/${id}/`);
  return response.status === 204;
};

export const submitOrder = async () => {
  const response = await instance.post<SubmitOrder>("/store/orders/");
  return response.data.orderId;
};

export const createPayment = async (orderId: string) => {
  const response = await instance.post<CreatePayment>(
    "/store/orders/create_payment",
    {
      order_id: orderId,
    }
  );
  return response.data.clientSecret;
};

export const submitPayment = async (paymentMethodId: string) => {
  const response = await instance.post("/store/payments/", {
    payment_method_id: paymentMethodId,
  });
  return response.status === 200;
};

export const retrieveOrderList = async (): Promise<OrderList> => {
  const response = await instance.get<OrderList>("/store/orders/");
  return response.data;
};
