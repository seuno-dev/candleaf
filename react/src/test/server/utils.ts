import { ResponseComposition, RestContext, RestRequest } from "msw";
import { access, customer } from "./db/credential";

export const getCustomer = (request: RestRequest) => {
  const token = request.headers.get("Authorization");
  if (!token) {
    throw new AuthError("No authorization token is provided");
  }
  if (token.substring(4) == access) {
    return customer;
  } else {
    throw new AuthError("The authorization token is invalid");
  }
};

export const errorResponse = (
  e: unknown,
  res: ResponseComposition,
  context: RestContext
) => {
  if (e instanceof AuthError) {
    return res(context.status(401), context.json({ message: e.message }));
  } else if (e instanceof BadRequestError) {
    return res(
      context.status(400),
      context.json({
        message: e.message ? e.message : "Missing required parameters.",
      })
    );
  } else {
    return res(context.status(500));
  }
};
