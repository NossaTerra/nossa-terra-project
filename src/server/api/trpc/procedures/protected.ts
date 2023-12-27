import { TRPCError } from "@trpc/server";
import { t, middleware } from "../trpc";

const enforceIsAuthed = middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = ctx.session.user;

  const typeRichSession = {
    ...ctx.session,
    user,
  };

  return next({
    ctx: {
      // The non-nullable "session" and "user" types are better inferred
      session: typeRichSession,
      user,
    },
  });
});

export const protectedProcedured = t.procedure.use(enforceIsAuthed);
