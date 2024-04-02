import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { db } from "../../db";

import { google } from "@lucia-auth/oauth/providers";
import { env } from "~/env";

export const auth = lucia({
  adapter: prisma(db),
  env: "DEV", // "PROD" if deployed to HTTPS
  middleware: nextjs_future(),

  getUserAttributes: (data) => data,
});

export const googleAuth = google(auth, {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${env.APP_URL}api/login/google/callback`,
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
});

export type Auth = typeof auth;
