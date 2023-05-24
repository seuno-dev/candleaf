import { rest } from "msw";
import baseUrl from "../url";
import { categories } from "../db/categories";

export const categoriesHandlers = [
  rest.get(baseUrl("/store/categories/"), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(categories));
  }),
];
