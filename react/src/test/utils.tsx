import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../routes";

export const createWrapper = () => {
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

export const renderWithRoute = (route = "/") => {
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
  });

  return render(<RouterProvider router={router} />, {
    wrapper: createWrapper(),
  });
};
