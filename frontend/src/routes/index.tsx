import {
  isRouteErrorResponse,
  Navigate,
  Outlet,
  RouteObject,
  useRouteError,
} from "react-router-dom";
import AuthRoutes from "../features/Auth/routes";
import ProductRoutes from "../features/Products/routes";
import React from "react";
import CartRoutes from "../features/Cart/routes";
import OrderRoutes from "../features/Order/routes";
import Navbar from "../components/Elements/Navbar";
import PaymentRoutes from "../features/Payment/routes";
import ProfileRoutes from "../features/Profile/routes";
import { getAuthenticationStatus } from "../api";
import { Typography } from "@material-tailwind/react";
import HomeRoutes from "../features/Home/routes";
import { Box, VStack } from "@chakra-ui/react";
import Footer from "../components/Elements/Footer";

const App = () => {
  return (
    <VStack w="full" spacing={0}>
      <Navbar />
      <Box as="main" mt="navbarH" w="100%">
        <Outlet />
      </Box>
      <Footer />
    </VStack>
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

const getRoutes = (): RouteObject[] => [
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
      { path: "/", children: HomeRoutes },
      { path: "profile/", children: ProfileRoutes },
      { path: "products/", children: ProductRoutes },
      { path: "cart/", element: requireAuthenticated(CartRoutes) },
      { path: "orders/", element: requireAuthenticated(OrderRoutes) },
      {
        path: "/payment/",
        element: requireAuthenticated(PaymentRoutes),
      },
    ],
  },
];

export default getRoutes;
