import { rest } from "msw";
import baseUrl from "../url";
import { password, username } from "../db/auth";
import { Credential } from "../../../types";

export const handlers = [
  rest.post(baseUrl("auth/jwt/create/"), async (req, res, ctx) => {
    const credential: Credential = await req.json();

    if (credential.username === username && credential.password === password) {
      return res(
        ctx.status(200),
        ctx.json({
          refresh:
            "refreshGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          access:
            "accessciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        })
      );
    }
  }),
];
