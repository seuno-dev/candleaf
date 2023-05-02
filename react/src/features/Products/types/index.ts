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
  averageRating: number | null;
  ratingCount: number;
};

export type ProductList = {
  results: Product[];
  totalPages: number;
};

export type ProductFilterParams = {
  page: number;
  title: string | undefined;
  category: string | undefined;
  priceMin: string | undefined;
  priceMax: string | undefined;
};
