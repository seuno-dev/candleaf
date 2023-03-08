import { useEffect, useState } from "react";
import { ProductListResponse, retrieveProductsList } from "../../services/api";

const useProductsList = () => {
  const [productList, setProductList] = useState<ProductListResponse>([]);

  useEffect(() => {
    retrieveProductsList().then((productList) => setProductList(productList));
  }, []);

  return { productList };
};

export default useProductsList;
