import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { categoriesHandlers } from "./handlers/categories";
import { profileHandlers } from "./handlers/profile";

export const server = setupServer(
  ...authHandlers,
  ...categoriesHandlers,
  ...profileHandlers
);
