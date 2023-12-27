import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { db } from "../../db";

export const auth = lucia({
  adapter: prisma(db),
  env: "DEV", // "PROD" if deployed to HTTPS
  middleware: nextjs_future(),

  getUserAttributes: (data) => data,
});

export type Auth = typeof auth;
