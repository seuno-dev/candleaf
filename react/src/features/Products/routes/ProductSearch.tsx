import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { toCurrencyString } from "../../../utils/currency";
import { retrieveProductList } from "../api";
import { Product } from "../types";

function ProductSearch() {
  const [searchParams] = useSearchParams();
  const [products, setProductList] = useState<Product[]>([]);
  const [pageCount, setPageCount] = useState(0);

  const loadPage = (page: number) => {
    const title = searchParams.get("title");
    const category = searchParams.get("category");
    const unitPriceLt = searchParams.get("unit_price_lt");
    const unitPriceGt = searchParams.get("unit_price_gt");

    retrieveProductList({
      page,
      title,
      category,
      unitPriceLt,
      unitPriceGt,
    }).then((productList) => {
      setProductList(productList.results);
      setPageCount(productList.totalPages);
    });
  };

  const handlePageClick = (e: { selected: number }) => {
    const newPage = e.selected + 1;
    loadPage(newPage);
    const url = new URL(window.location.toString());
    url.searchParams.set("page", newPage.toString());
    window.history.pushState(null, "", url.toString());
  };

  useEffect(() => {
    loadPage(1);
  }, [searchParams]);

  return (
    <div className="container mx-auto mt-5 flex flex-col">
      <ul className="flex flex-row flex-wrap gap-1">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`}>
            <ProductCard
              title={product.title}
              price={toCurrencyString(product.unitPrice)}
              imageUrl={
                product.images.length > 0
                  ? product.images[0].image
                  : "logo512.png"
              }
            />
          </Link>
        ))}
      </ul>
      <div className="mt-5 flex flex-row justify-center">
        <Pagination onPageChange={handlePageClick} pageCount={pageCount} />
      </div>
    </div>
  );
}

export default ProductSearch;
