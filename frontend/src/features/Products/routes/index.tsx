import React from "react";
import { RouteObject } from "react-router-dom";
import ProductSearch from "./ProductSearch";
import ProductDetail from "./ProductDetail";

const ProductRoutes: RouteObject[] = [
  {
    index: true,
    element: <ProductSearch />,
  },
  {
    path: ":slug",
    element: <ProductDetail />,
  },
];
export default ProductRoutes;
