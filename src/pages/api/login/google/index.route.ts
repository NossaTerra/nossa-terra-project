import { googleAuth } from "~/server/api/auth/lucia";
import { serializeCookie } from "lucia/utils";

import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405);
  const [url, state] = await googleAuth.getAuthorizationUrl();
  const stateCookie = serializeCookie("google_oauth_state", state, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  return res
    .status(302)
    .setHeader("Set-Cookie", stateCookie)
    .setHeader("Location", url.toString())
    .end();
};

export default handler;
