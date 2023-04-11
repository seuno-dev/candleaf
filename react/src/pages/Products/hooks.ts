import { useState } from "react";
import { retrieveProductList } from "../../api/api";
import { Product } from "../../types";

export const useProductList = () => {
  const [products, setProductList] = useState<Product[] | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const loadProductList = (search: string, page: number) => {
    retrieveProductList(search, page).then((_productList) => {
      setProductList(_productList.results);
      setPageCount(_productList.totalPages);
    });
  };

  return { productList: products, pageCount, loadProductList };
};


