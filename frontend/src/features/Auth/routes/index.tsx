import React from "react";
import { RouteObject } from "react-router-dom";
import Login from "./Login";
import ProductSearch from "../../Products/routes/ProductSearch";
import GoogleOAuthCallback from "./GoogleOAuthCallback";
import SignUp from "./SignUp";

const AuthRoutes: RouteObject[] = [
  {
    index: true,
    element: <ProductSearch />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "o/",
    children: [
      {
        path: "google-oauth2/callback/",
        element: <GoogleOAuthCallback />,
      },
    ],
  },
];

export default AuthRoutes;
