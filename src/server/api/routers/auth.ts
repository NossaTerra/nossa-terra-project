import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { publicProcedure } from "../trpc/procedures/public";
import { TRPCError } from "@trpc/server";
import { auth } from "../auth/lucia";
import { protectedProcedured } from "../trpc/procedures/protected";
import { userRolesSchema } from "../auth/types";

export const authRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx: { user } }) => user),

  checkUserExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx: { db }, input: { email } }) => {
      const user = await db.user.findUnique({ where: { email } });
      return !!user;
    }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        // TODO: Enforce better register rules
        name: z.string().min(2).max(255),
        password: z.string().min(2).max(255),
        cpf: z.string().min(2).max(255),
        role: userRolesSchema,
      }),
    )
    .mutation(({ input: { name, email, password, role, cpf } }) => {
      try {
        const user = auth.createUser({
          attributes: { email, name, role, isActive: false, cpf },
          key: {
            password,
            providerId: "email",
            providerUserId: email,
          },
        });
        return user;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx: { authRequest }, input: { email, password } }) => {
      try {
        const key = await auth.useKey("email", email, password);
        const session = await auth.createSession({
          userId: key.userId,
          attributes: {},
        });
        authRequest.setSession(session);
        return session;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),

  logout: protectedProcedured.mutation(
    async ({ ctx: { authRequest, session } }) => {
      await auth.invalidateSession(session.sessionId);
      authRequest.setSession(null);
    },
  ),
});
