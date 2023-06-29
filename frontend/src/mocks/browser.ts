import { setupWorker } from "msw";
import { authHandlers } from "../test/server/handlers/auth";
import { productsHandler } from "../test/server/handlers/products";
import { profileHandlers } from "../test/server/handlers/profile";
import { cartHandlers } from "../test/server/handlers/cart";

export const worker = setupWorker(
  ...authHandlers,
  ...productsHandler,
  ...profileHandlers,
  ...cartHandlers
);
