import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { categoriesHandlers } from "./handlers/categories";
import { profileHandlers } from "./handlers/profile";
import { productsHandler } from "./handlers/products";
import { cartHandlers } from "./handlers/cart";

export const server = setupServer(
  ...authHandlers,
  ...categoriesHandlers,
  ...productsHandler,
  ...profileHandlers,
  ...cartHandlers
);
