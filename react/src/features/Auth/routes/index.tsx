import React from "react";
import { RouteObject } from "react-router-dom";
import Login from "./Login";
import ProductSearch from "../../Products/routes/ProductSearch";

const AuthRoutes: RouteObject[] = [
  {
    index: true,
    element: <ProductSearch />,
  },
  {
    path: "login",
    element: <Login />,
  },
];

export default AuthRoutes;
