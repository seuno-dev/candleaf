import { setupWorker } from "msw";
import { productsHandler } from "./server/handlers/products";
import { authHandlers } from "./server/handlers/auth";
import { cartHandlers } from "./server/handlers/cart";
import { profileHandlers } from "./server/handlers/profile";

export const worker = setupWorker(
  ...authHandlers,
  ...cartHandlers,
  ...productsHandler,
  ...profileHandlers
);
