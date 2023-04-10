import { instance, login, logout, REFRESH_KEY } from "./client";
import {
  CartItemResponse,
  CreatePaymentResponse,
  OrderListResponse,
  ProductListResponse,
  ProductResponse,
  SubmitOrderResponse,
  UserResponse,
} from "./types";
import {
  CartItem,
  OrderList,
  Product,
  ProductImage,
  ProductList,
  User,
} from "../types/store";

export { login, logout };

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};

export const retrieveProfile = async (): Promise<User> => {
  const response = await instance.get<UserResponse>("/auth/users/me/");
  return {
    username: response.data.username,
    firstName: response.data.first_name,
    lastName: response.data.last_name,
    email: response.data.email,
  };
};

export const retrieveProductList = async (
  search: string,
  page: number
): Promise<ProductList> => {
  const response = await instance.get<ProductListResponse>("/store/products/", {
    params: {
      page: page,
      search: search,
    },
  });
  const productList: Product[] = response.data.results.map(
    (productResponse) => {
      const images: ProductImage[] = productResponse.images.map((image) => ({
        id: image.id,
        url: image.image,
      }));
      return {
        id: productResponse.id,
        title: productResponse.title,
        slug: productResponse.slug,
        description: productResponse.description,
        unitPrice: productResponse.unit_price,
        inventory: productResponse.inventory,
        collection: productResponse.collection,
        images: images,
      };
    }
  );
  return {
    data: productList,
    totalPages: response.data.total_pages,
  };
};

export const retrieveProductDetail = async (slug: string): Promise<Product> => {
  const response = await instance.get<ProductResponse>(
    `/store/products/${slug}/`
  );
  return {
    id: response.data.id,
    title: response.data.title,
    slug: response.data.slug,
    description: response.data.description,
    unitPrice: response.data.unit_price,
    inventory: response.data.inventory,
    collection: response.data.collection,
    images: response.data.images.map((image) => ({
      id: image.id,
      url: image.image,
    })),
  };
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

export const retrieveCartItemList = async (): Promise<CartItem[]> => {
  const response = await instance.get<CartItemResponse[]>("/store/cart-items/");
  return response.data.map((cartItemResponse) => ({
    id: cartItemResponse.id,
    product: {
      id: cartItemResponse.product.id,
      title: cartItemResponse.product.title,
      unitPrice: cartItemResponse.product.unit_price,
      inventory: cartItemResponse.product.inventory,
      image: {
        id: cartItemResponse.product.image.id,
        url: cartItemResponse.product.image.image,
      },
    },
    quantity: cartItemResponse.quantity,
    totalPrice: cartItemResponse.total_price,
  }));
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
  const response = await instance.post<SubmitOrderResponse>("/store/orders/");
  return response.data.order_id;
};

export const createPayment = async (orderId: string) => {
  const response = await instance.post<CreatePaymentResponse>(
    "/store/orders/create_payment",
    {
      order_id: orderId,
    }
  );
  return response.data.client_secret;
};

export const submitPayment = async (paymentMethodId: string) => {
  const response = await instance.post("/store/payments/", {
    payment_method_id: paymentMethodId,
  });
  return response.status === 200;
};

export const retrieveOrderList = async (): Promise<OrderList> => {
  const response = await instance.get<OrderListResponse>("/store/orders/");
  return {
    data: response.data.results.map((orderResponse) => ({
      id: orderResponse.id,
      totalPrice: orderResponse.total_price,
      orderTime: orderResponse.order_time,
      items: orderResponse.items.map((itemResponse) => ({
        id: itemResponse.id,
        orderId: itemResponse.order_id,
        unitPrice: itemResponse.unit_price,
        quantity: itemResponse.quantity,
        totalPrice: itemResponse.total_price,
        product: {
          id: itemResponse.product.id,
          title: itemResponse.product.title,
          unitPrice: itemResponse.product.unit_price,
          inventory: itemResponse.product.inventory,
          image: {
            id: itemResponse.product.image.id,
            url: itemResponse.product.image.image,
          },
        },
      })),
    })),
    totalPages: response.data.total_pages,
  };
};
