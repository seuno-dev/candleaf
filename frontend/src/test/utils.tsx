import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { render } from "@testing-library/react";
import {
  BrowserRouter,
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import getRoutes from "../routes";
import { ACCESS_KEY, REFRESH_KEY } from "../api/client";
import { access, refresh } from "./server/db/credential";

export const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const createRouterWrapper = () => {
  const QueryWrapper = createQueryWrapper();
  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryWrapper>{children}</QueryWrapper>
    </BrowserRouter>
  );
};

export const authenticate = () => {
  console.log("Test: Authenticating");
  localStorage.setItem(REFRESH_KEY, refresh);
  localStorage.setItem(ACCESS_KEY, access);
};

export const renderWithRoute = (route = "/") => {
  const router = createMemoryRouter(getRoutes(), {
    initialEntries: [route],
  });

  return render(<RouterProvider router={router} />, {
    wrapper: createQueryWrapper(),
  });
};

export const renderWithRouteAuthenticated = (route = "/") => {
  authenticate();
  return renderWithRoute(route);
};
