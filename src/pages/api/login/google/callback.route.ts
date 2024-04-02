import { auth, googleAuth } from "~/server/api/auth/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { parseCookie } from "lucia/utils";

import type { NextApiRequest, NextApiResponse } from "next";
import { makeSignUpQueryParams } from "~/pages/signup/useSignUpState";
import { db } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405);
  const cookies = parseCookie(req.headers.cookie ?? "");
  const storedState = cookies.google_oauth_state;
  const state = req.query.state;
  const code = req.query.code;

  if (
    !storedState ||
    !state ||
    storedState !== state ||
    typeof code !== "string"
  ) {
    return res.status(400).end();
  }

  try {
    const { googleUser, googleTokens } =
      await googleAuth.validateCallback(code);

    if (!googleUser.email) {
      throw new Error("This GoogleUser has no email");
    }

    let existingKey: Awaited<ReturnType<typeof auth.getKey>> | null = null;
    try {
      existingKey = await auth.getKey("google", googleUser.email);
    } catch (e) {
      existingKey = null;
    }
    const existingUser = await db.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    if (existingUser) {
      if (!existingKey) {
        await auth.createKey({
          userId: existingUser.id,
          providerId: "google",
          providerUserId: existingUser.email,
          password: null,
        });
      }

      const session = await auth.createSession({
        userId: existingUser.id,
        attributes: {},
      });
      const authRequest = auth.handleRequest({ req, res });
      authRequest.setSession(session);

      return res.status(302).setHeader("Location", "/").end();
    }

    const queryParams = makeSignUpQueryParams({
      oauth_provider: "google",

      username: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
    });

    return res
      .status(302)
      .setHeader("Location", `/signup?${queryParams}`)
      .setHeader("Set-Cookie", [
        `google_access_token=${googleTokens.accessToken}; HttpOnly; Path=/; SameSite=Strict`,
        `google_refresh_token=${googleTokens.refreshToken}; HttpOnly; Path=/; SameSite=Strict`,
        `google_access_token_expires_in=${googleTokens.accessTokenExpiresIn}; HttpOnly; Path=/; SameSite=Strict`,
      ])
      .end();
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return res.status(400).end();
    }
    return res.status(500).end();
  }
};

export default handler;
