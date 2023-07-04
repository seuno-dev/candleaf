import { rest } from "msw";
import baseUrl from "../url";
import { access, email, password, refresh } from "../db/credential";
import { Credential } from "../../../types";

export const authHandlers = [
  rest.post(baseUrl("/auth/jwt/create/"), async (req, res, ctx) => {
    const credential: Credential = await req.json();

    console.log("creed", credential);

    if (credential.email === email && credential.password === password) {
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
