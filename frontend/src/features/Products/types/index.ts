import { SimpleReview } from "../../../types";

export type ProductImage = {
  id: number;
  image: string;
};

export type SimpleProduct = {
  id: number;
  title: string;
  slug: string;
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
  images: ProductImage[];
  averageRating: number | null;
  reviewCount: number;
  reviews: SimpleReview[];
  wax: string;
  fragrance: string;
  burningTime: number;
  dimension: string;
  weight: number;
};

export type ProductList = {
  results: Product[];
  totalPages: number;
};

export type ProductFilterParams = {
  page: number;
  title: string | undefined;
  burningTimeMin: string | undefined;
  burningTimeMax: string | undefined;
  priceMin: string | undefined;
  priceMax: string | undefined;
};
