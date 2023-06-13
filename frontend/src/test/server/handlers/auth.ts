import { rest } from "msw";
import baseUrl from "../url";
import { access, password, refresh, customer } from "../db/credential";
import { Credential } from "../../../types";

export const authHandlers = [
  rest.post(baseUrl("/auth/jwt/create/"), async (req, res, ctx) => {
    const credential: Credential = await req.json();

    if (credential.email === customer.email && credential.password === password) {
      return res(
        ctx.status(200),
        ctx.json({
          refresh,
          access,
        })
      );
    }
  }),
];
