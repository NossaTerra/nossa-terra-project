import { TRPCError } from "@trpc/server";
import { t, middleware } from "./trpc";
import { RoleTypeSchema, type Role } from "../auth/types";
import { type ZodEnum } from "zod";

const isAuthMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // The non-nullable "session" and "user" types are better inferred
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

function rolesFilterMiddleware<TRoles extends [Role, ...Role[]]>(
  roleParser: ZodEnum<TRoles>,
) {
  return middleware(({ ctx, next }) => {
    const roleParse = roleParser.safeParse(ctx.session?.user?.role);
    if (!ctx.session || !ctx.session.user || !roleParse.success) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = {
      ...ctx.session.user,
      role: roleParse.data,
    };

    return next({
      ctx: {
        // The non-nullable "session" and "user" types are better inferred
        user,
        session: {
          ...ctx.session,
          user,
        },
      },
    });
  });
}

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthMiddleware);

export const commonProcedure = t.procedure.use(
  rolesFilterMiddleware(RoleTypeSchema.Common),
);
export const buyerOnlyProcedure = t.procedure.use(
  rolesFilterMiddleware(RoleTypeSchema.BuyerOnly),
);
export const backofficeProcedure = t.procedure.use(
  rolesFilterMiddleware(RoleTypeSchema.Backoffice),
);
export const adminProcedure = t.procedure.use(
  rolesFilterMiddleware(RoleTypeSchema.Admin),
);
