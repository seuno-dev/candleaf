import { useEffect, useState } from "react";
import { Product } from "../../types";
import { retrieveProductDetail } from "../../api/api";

export const useProductDetail = (slug: string) => {
  const [product, setProduct] = useState<Product>({
    collection: 0,
    description: "",
    id: 0,
    images: [],
    inventory: 0,
    title: "",
    slug: "",
    unitPrice: 0,
  });

  useEffect(() => {
    retrieveProductDetail(slug).then((product) => setProduct(product));
  }, []);

  return { product };
};
