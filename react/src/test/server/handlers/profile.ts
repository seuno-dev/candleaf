import { rest } from "msw";
import { errorResponse, getCustomer } from "../utils";
import baseUrl from "../url";

export const profileHandlers = [
  rest.get(baseUrl("/store/customers/me/"), async (req, res, context) => {
    try {
      const customer = getCustomer(req);
      return res(context.status(200), context.json(customer));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
];
