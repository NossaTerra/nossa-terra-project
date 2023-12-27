import { TRPCError } from "@trpc/server";
import { t, middleware } from "../trpc";

const enforceIsBuyer = middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = ctx.session.user;
  if (user.role !== "buyer") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // The "role" type is better inferred
  const typeRichUser = {
    ...user,
    role: user.role,
  };

  const typeRichSession = {
    ...ctx.session,
    user: typeRichUser,
  };

  return next({
    ctx: {
      // The non-nullable "session" and "user" types are better inferred
      session: typeRichSession,
      user: typeRichUser,
    },
  });
});

export const buyerProcedure = t.procedure.use(enforceIsBuyer);
