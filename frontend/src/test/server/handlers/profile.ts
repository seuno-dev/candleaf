import { rest } from "msw";
import { errorResponse, getCustomer } from "../utils";
import baseUrl from "../url";

interface ProfileUpdateMock {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}

export const profileHandlers = [
  rest.get(baseUrl("/store/customers/me/"), async (req, res, context) => {
    try {
      const customer = getCustomer(req);
      return res(context.status(200), context.json(customer));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
  rest.put(baseUrl("/store/customers/me/"), async (req, res, context) => {
    try {
      getCustomer(req);

      const newProfile = await req.json<ProfileUpdateMock>();

      return res(context.status(200), context.json(newProfile));

      // noinspection ExceptionCaughtLocallyJS
      // throw new BadRequestError();
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
];
