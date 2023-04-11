import { useState } from "react";
import { retrieveProductList } from "../../api/api";
import { Product } from "../../types";

export const useProductList = () => {
  const [products, setProductList] = useState<Product[]>([]);
  const [pageCount, setPageCount] = useState(0);

  const loadProductList = (
    search: string,
    categoryId: string,
    page: number
  ) => {
    retrieveProductList(search, categoryId, page).then((_productList) => {
      setProductList(_productList.results);
      setPageCount(_productList.totalPages);
    });
  };

  return { productList: products, pageCount, loadProductList };
};
