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

export const useProductDetail = (id: number) => {
  const [product, setProduct] = useState<ProductResponse>({
    collection: 0,
    description: "",
    id: 0,
    images: [],
    inventory: 0,
    title: "",
    unit_price: 0,
  });

  useEffect(() => {
    retrieveProductDetail(id).then((product) => setProduct(product));
  }, []);

  return {
    title: product.title,
    description: product.description,
    images: product.images,
    price: product.unit_price,
  };
};
