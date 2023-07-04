import { setupWorker } from "msw";
import { productsHandler } from "./server/handlers/products";
import { authHandlers } from "./server/handlers/auth";
import { cartHandlers } from "./server/handlers/cart";
import { profileHandlers } from "./server/handlers/profile";
import { orderHandler } from "./server/handlers/order";

export const worker = setupWorker(
  ...authHandlers,
  ...cartHandlers,
  ...orderHandler,
  ...productsHandler,
  ...profileHandlers
);
