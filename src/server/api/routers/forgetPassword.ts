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
import { type TRPCContext } from "../trpc/context";

export const forgetPasswordRouter = createTRPCRouter({
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
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx: { db }, input: { email } }) => {
      try {
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User with this email not found",
          });
        }

        const token = await getTokenResetPassword({
          userId: user.id,
          db,
        });
        const emailHtml = resetPasswordEmail(token);

        const transporter = nodemailer.createTransport(
          nodemailerSendgrid({
            apiKey: env.SENDGRID_API_KEY,
          }),
        );

        transporter
          .sendMail({
            from: '"Nossa Terra" <nossaterra.dev@gmail.com>',
            to: email,
            subject: "Redefinição de senha",
            html: emailHtml,
          })
          .catch((error) => {
            console.error("Error sending email: ", error);
          });
      } catch (e) {
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

async function getTokenResetPassword({
  userId,
  db,
}: {
  userId: string;
  db: TRPCContext["db"];
}) {
  const EXPIRES_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  const thresholdTime = new Date().getTime() - EXPIRES_DURATION / 2;

  try {
    const usableToken = await db.passwordResetToken.findFirst({
      where: {
        user_id: userId,
        expires: {
          gte: thresholdTime,
        },
      },
    });

    if (usableToken) {
      return usableToken.id;
    }

    const newToken = generateRandomString(63);

    await db.passwordResetToken.create({
      data: {
        id: newToken,
        expires: new Date().getTime() + EXPIRES_DURATION,
        user_id: userId,
      },
    });

    return newToken;
  } catch (error) {
    console.log(error);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
}
