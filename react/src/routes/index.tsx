import {
  createBrowserRouter,
  isRouteErrorResponse,
  Navigate,
  Outlet,
  useRouteError,
} from "react-router-dom";
import AuthRoutes from "../features/Auth/routes";
import ProductRoutes from "../features/Products/routes";
import React from "react";
import CartRoutes from "../features/Cart/routes";
import OrderRoutes from "../features/Order/routes";
import Navbar from "../components/Elements/Navbar";
import StripePaymentRoutes from "../features/StripePayment/routes";
import ProfileRoutes from "../features/Profile/routes";
import { getAuthenticationStatus } from "../api";
import { Typography } from "@material-tailwind/react";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const Error = () => {
  const error = useRouteError();
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <Typography variant="h5">Oops</Typography>
        <Typography>
          {isRouteErrorResponse(error)
            ? "The page doesn't exist"
            : "Something unexpected happened"}
        </Typography>
      </div>
    </>
  );
};

const requireAuthenticated = (Component: React.FC) => {
  return getAuthenticationStatus() ? (
    <Component />
  ) : (
    <Navigate to="/auth/login" />
  );
};

const router = createBrowserRouter([
  {
    path: "/auth/",
    children: AuthRoutes,
    errorElement: <Error />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Navigate to="/products" /> },
      { path: "profile/", children: ProfileRoutes },
      { path: "products/", children: ProductRoutes },
      { path: "cart/", element: requireAuthenticated(CartRoutes) },
      { path: "orders/", element: requireAuthenticated(OrderRoutes) },
      {
        path: "payment/",
        element: requireAuthenticated(StripePaymentRoutes),
      },
    ],
  },
]);

export default router;
