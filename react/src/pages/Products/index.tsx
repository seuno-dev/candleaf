import React, { useEffect } from "react";
import { useProductList } from "./hooks";
import ProductCard from "./ProductCard";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { toCurrencyString } from "../../utils/currency";

function Products() {
  const [searchParams] = useSearchParams();
  const { productList, pageCount, loadProductList } = useProductList();

  const handlePageClick = (e: { selected: number }) => {
    const search = searchParams.get("search");
    const newPage = e.selected + 1;

    loadProductList(search ? search : "", e.selected + 1);
    const url = new URL(window.location.toString());
    url.searchParams.set("page", newPage.toString());
    window.history.pushState(null, "", url.toString());
  };

  useEffect(() => {
    const search = searchParams.get("search");
    loadProductList(search ? search : "", 1);
  }, [searchParams]);

  return (
    <div className="container mx-auto mt-5 flex flex-col">
      <ul className="mx-auto flex flex-row flex-wrap gap-1">
        {productList?.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`}>
            <ProductCard
              title={product.title}
              price={toCurrencyString(product.unitPrice)}
              imageUrl={
                product.images.length > 0
                  ? product.images[0].url
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

export default Products;
