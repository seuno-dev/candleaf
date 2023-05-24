import { setupServer } from "msw/node";
import { handlers } from "./handlers/auth";

export const server = setupServer(...handlers);
