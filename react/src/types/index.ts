export type Category = {
  id: number;
  title: string;
  slug: string;
};

export type ProductImage = {
  id: number;
  image: string;
};

export type SimpleProduct = {
  id: number;
  title: string;
  unitPrice: number;
  inventory: number;
  image: ProductImage;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  unitPrice: number;
  inventory: number;
  category: Category | null;
  images: ProductImage[];
};

export type ProductList = {
  results: Product[];
  totalPages: number;
};

export type ProductFilterParams = {
  page: number;
  title: string | null;
  category: string | null;
  unitPriceLt: string | null;
  unitPriceGt: string | null;
};

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  product: SimpleProduct;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  orderTime: string;
};

export type OrderList = {
  results: Order[];
  totalPages: number;
};

export type CreatePayment = {
  clientSecret: string;
};

export type SubmitOrder = {
  orderId: string;
};

export type CartItem = {
  id: number;
  product: SimpleProduct;
  quantity: number;
  totalPrice: number;
};
