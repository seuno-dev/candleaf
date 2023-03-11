import { useEffect, useState } from "react";
import {
  ProductListResponse,
  ProductResponse,
  retrieveProductDetail,
  retrieveProductsList,
} from "../../services/api";

export const useProductsList = () => {
  const [productList, setProductList] = useState<ProductListResponse>([]);

  useEffect(() => {
    retrieveProductsList().then((productList) => setProductList(productList));
  }, []);

  return { productList };
};

export const useProductDetail = (slug: string) => {
  const [product, setProduct] = useState<ProductResponse>({
    collection: 0,
    description: "",
    id: 0,
    images: [],
    inventory: 0,
    title: "",
    slug: "",
    unit_price: 0,
  });

  useEffect(() => {
    retrieveProductDetail(slug).then((product) => setProduct(product));
  }, []);

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    images: product.images,
    price: product.unit_price,
  };
};
