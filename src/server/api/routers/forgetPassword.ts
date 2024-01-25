import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { auth } from "../auth/lucia";
import { publicProcedure } from "../trpc/procedures";
import { generateRandomString, isWithinExpiration } from "lucia/utils";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { resetPasswordEmail } from "~/utils/resetPasswordEmail";

export const forgetPasswordRouter = createTRPCRouter({
  generatePasswordResetToken: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx: { db }, input: { userId } }) => {
      const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

      try {
        const storedUserTokens = await db.passwordResetToken.findMany({
          where: {
            user_id: userId,
            expires: {
              gte: new Date().getTime() - EXPIRES_IN / 2,
            },
          },
        });

        if (storedUserTokens.length > 0) {
          const reusableStoredToken = storedUserTokens.find((token) => {
            return token.expires >= new Date().getTime() - EXPIRES_IN / 2;
          });

          if (reusableStoredToken) {
            return reusableStoredToken.id;
          }
        }

        const token = generateRandomString(63);

        await db.passwordResetToken.create({
          data: {
            id: token,
            expires: new Date().getTime() + EXPIRES_IN,
            user_id: userId,
          },
        });

        return token;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  validatePasswordResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx: { db }, input: { token } }) => {
      try {
        const storedToken = await db.$transaction(async (trx) => {
          const storedToken = await trx.passwordResetToken.findFirst({
            where: {
              id: token,
            },
          });

          if (!storedToken) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
          }

          await trx.passwordResetToken.delete({
            where: {
              id: storedToken.id,
            },
          });

          return storedToken;
        });

        const tokenExpires = Number(storedToken.expires); // bigint => number conversion

        if (!isWithinExpiration(tokenExpires)) {
          throw new TRPCError({ code: "PRECONDITION_FAILED" });
        }

        return storedToken.user_id;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  sendResetPasswordEmail: publicProcedure
    .input(z.object({ email: z.string().email(), token: z.string() }))
    .mutation(async ({ ctx: { }, input: { email, token } }) => {
      const emailHtml = resetPasswordEmail(token);

      try {
        const transporter = nodemailer.createTransport(
          nodemailerSendgrid({
            apiKey: env.SENDGRID_API_KEY,
          }),
        );

        await transporter.sendMail({
          from: '"Nossa Terra" <nossaterra.dev@gmail.com>',
          to: email,
          subject: "Redefinição de senha",
          html: emailHtml,
        });
      } catch (e) {
        console.error("Error sending email: ");
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string().min(8).max(30),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { authRequest }, input: { password, userId } }) => {
      try {
        let user = await auth.getUser(userId);
        await auth.invalidateAllUserSessions(user.userId);
        await auth.updateKeyPassword("email", user.email, password);
        user = await auth.updateUserAttributes(user.userId, {});
        const newSession = await auth.createSession({
          userId: user.userId,
          attributes: {},
        });
        authRequest.setSession(newSession);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired password reset link",
        });
      }
    }),
});
