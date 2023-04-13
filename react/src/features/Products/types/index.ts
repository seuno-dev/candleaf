import { Category } from "../../../types";

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
  priceMin: string | null;
  priceMax: string | null;
};
