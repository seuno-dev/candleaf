import React from "react";
import { RouteObject } from "react-router-dom";
import Profile from "./Profile";

const ProfileRoutes: RouteObject[] = [
  {
    index: true,
    element: <Profile />,
  },
];

export default ProfileRoutes;
