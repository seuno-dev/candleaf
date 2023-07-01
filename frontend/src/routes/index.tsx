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
import HomeRoutes from "../features/Home/routes";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
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
    <VStack w="full" spacing={0}>
      <Navbar />
      <Container
        mt="navbarH"
        py="50px"
        minH="200px"
        w="100%"
        maxW="container.xl"
      >
        <VStack alignItems="start" justifyContent="start">
          <Heading>Oops</Heading>
          <Text>
            {isRouteErrorResponse(error)
              ? "The page doesn't exist"
              : "Something unexpected happened"}
          </Text>
        </VStack>
      </Container>
      <Footer />
    </VStack>
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
      { path: "cart/*", element: requireAuthenticated(CartRoutes) },
      { path: "orders/*", element: requireAuthenticated(OrderRoutes) },
      {
        path: "payment/*",
        element: requireAuthenticated(PaymentRoutes),
      },
    ],
  },
];

export default getRoutes;
