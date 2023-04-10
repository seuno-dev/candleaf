export type OrderItemResponse = {
  id: string;
  order_id: string;
  product: SimpleProductResponse;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export type OrderResponse = {
  id: string;
  items: OrderItemResponse[];
  total_price: number;
  order_time: string;
};

export type OrderListResponse = {
  results: OrderResponse[];
  total_pages: number;
};

export type CreatePaymentResponse = {
  client_secret: string;
};

export type SubmitOrderResponse = {
  order_id: string;
};

export type SimpleProductResponse = {
  id: number;
  title: string;
  unit_price: number;
  inventory: number;
  image: ProductImageResponse;
};

export type CartItemResponse = {
  id: number;
  product: SimpleProductResponse;
  quantity: number;
  total_price: number;
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
export type ProductListResponse = {
  results: ProductResponse[];
  total_pages: number;
};

export type UserResponse = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};
