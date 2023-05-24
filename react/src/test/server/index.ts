import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { categoriesHandlers } from "./handlers/categories";

export const server = setupServer(...authHandlers, ...categoriesHandlers);
