import React from "react";
import { Route, Routes } from "react-router-dom";
import ProductSearch from "./ProductSearch";
import ProductDetail from "./ProductDetail";

const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<ProductSearch />} />
      <Route path=":slug" element={<ProductDetail />} />
    </Routes>
  );
};

export default ProductRoutes;
