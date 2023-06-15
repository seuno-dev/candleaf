import React from "react";
import Home from "./Home";
import { RouteObject } from "react-router-dom";

const HomeRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
];
export default HomeRoutes;
