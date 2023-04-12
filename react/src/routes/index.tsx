import { Outlet, useRoutes } from "react-router-dom";
import AuthRoutes from "../features/Auth/routes";
import ProductRoutes from "../features/Products/routes";
import React from "react";
import Navbar from "../components/Navbar";
import CartRoutes from "../features/Cart/routes";
import OrderRoutes from "../features/Order/routes";
import StripePaymentRoutes from "../features/StripePayment/routes";

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
      children: [
        { path: "/products/*", element: <ProductRoutes /> },
        { path: "/cart/*", element: <CartRoutes /> },
        { path: "/orders/*", element: <OrderRoutes /> },
        { path: "/payment/*", element: <StripePaymentRoutes /> },
      ],
    },
  ]);
};
