import React from "react";
import useProductsList from "./hooks";
import ProductCard from "../../components/ProductCard";

function Products() {
  const { productList } = useProductsList();
  return (
    <div>
      <ul>
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.unit_price}
            imageUrl={
              product.images.length > 0 ? product.images[0].image : "logo512.png"
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default Products;
