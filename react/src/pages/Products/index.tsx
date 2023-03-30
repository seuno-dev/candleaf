import React from "react";
import { useProductsList } from "./hooks";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

function Products() {
  const { productList, pageCount, loadProductList } = useProductsList();

  const handlePageClick = (e: { selected: number }) => {
    loadProductList(e.selected + 1);
  };

  return (
    <div className="flex flex-col">
      <ul className="mx-auto flex flex-row flex-wrap gap-1">
        {productList?.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`}>
            <ProductCard
              title={product.title}
              price={product.unit_price}
              imageUrl={
                product.images.length > 0
                  ? product.images[0].image
                  : "logo512.png"
              }
            />
          </Link>
        ))}
      </ul>
      <div className="flex flex-row justify-center">
        <Pagination onPageChange={handlePageClick} pageCount={pageCount} />
      </div>
    </div>
  );
}

export default Products;
