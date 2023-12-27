import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "~/server/db";
import { auth } from "../auth/lucia";

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

  const innerContext = createInnerContext();

  return {
    authRequest,
    req,
    res,
    session,
    user: session?.user ?? null,
    ...innerContext,
  };
};
