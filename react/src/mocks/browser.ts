import { setupWorker } from "msw";
import { authHandlers } from "../test/server/handlers/auth";
import { categoriesHandlers } from "../test/server/handlers/categories";
import { productsHandler } from "../test/server/handlers/products";
import { profileHandlers } from "../test/server/handlers/profile";
import { cartHandlers } from "../test/server/handlers/cart";

export const worker = setupWorker(
  ...authHandlers,
  ...categoriesHandlers,
  ...productsHandler,
  ...profileHandlers,
  ...cartHandlers
);
