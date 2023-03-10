import React from "react";
import { useProductsList } from "./hooks";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

function Products() {
  const { productList } = useProductsList();
  return (
    <div>
      <Navbar />
      <ul className="mx-auto flex flex-row flex-wrap gap-1">
        {productList.map((product) => (
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
    </div>
  );
}

export default Products;
