import { useEffect, useState } from "react";
import { retrieveProductDetail, retrieveProductList } from "../../api/api";
import { Product } from "../../types/store";

export const useProductsList = () => {
  const [productList, setProductList] = useState<Product[] | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const loadProductList = (search: string, page: number) => {
    retrieveProductList(search, page).then((response) => {
      setProductList(response.data);
      setPageCount(response.totalPages);
    });
  };

  return { productList, pageCount, loadProductList };
};

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
