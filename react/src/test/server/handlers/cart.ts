import { rest } from "msw";
import baseUrl from "../url";

export const cartHandlers = [
  rest.post(baseUrl("/store/cart-items/"), (req, res, context) => {
    return res(context.status(201));
  }),
];
