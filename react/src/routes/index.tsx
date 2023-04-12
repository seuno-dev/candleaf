import { Outlet, useRoutes } from "react-router-dom";
import AuthRoutes from "../features/Auth/routes";
import ProductRoutes from "../features/Products/routes";
import React from "react";
import Navbar from "../components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export const AppRoutes = () => {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthRoutes />,
    },
    {
      path: "/",
      element: <App />,
      children: [{ path: "/products/*", element: <ProductRoutes /> }],
    },
  ]);
};
