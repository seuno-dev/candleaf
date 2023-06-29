import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { profileHandlers } from "./handlers/profile";
import { productsHandler } from "./handlers/products";
import { cartHandlers } from "./handlers/cart";

export const server = setupServer(
  ...authHandlers,
  ...productsHandler,
  ...profileHandlers,
  ...cartHandlers
);
