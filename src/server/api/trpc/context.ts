import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "~/server/db";
import { auth } from "../auth/lucia";
import { parseCookie } from "lucia/utils";

const createInnerContext = () => {
  return {
    db,
  };
};

export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const authRequest = auth.handleRequest({ req, res });
  const session = await authRequest.validate();

  const cookies = parseCookie(req.headers.cookie ?? "");

  return {
    authRequest,
    cookies,
    req,
    res,
    session,
    user: session?.user ?? null,
    ...createInnerContext(),
  };
};

export type TRPCContext =
  ReturnType<typeof createTRPCContext> extends Promise<infer T> ? T : never;
