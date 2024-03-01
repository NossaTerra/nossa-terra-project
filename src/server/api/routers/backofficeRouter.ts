import { UserActiveState } from "../../types/user.type";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { backofficeProcedure } from "../trpc/procedures";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { buyerValidatedEmail } from "~/utils/buyerValidatedEmail";

export const backofficeRouter = createTRPCRouter({
  getAllBuyers: backofficeProcedure.query(({ ctx: { db } }) =>
    db.user.findMany({
      where: {
        role: "buyer",
      },
    }),
  ),

  changeUserActiveState: backofficeProcedure
    .input(
      z.object({
        userId: z.string(),
        activeState: z.nativeEnum(UserActiveState),
      }),
    )
    .mutation(async ({ input: { userId, activeState }, ctx: { db } }) => {
      try {
        await db.user.update({
          where: { id: userId },
          data: { activeState },
        });
        if (activeState === "active") {
          const user = await db.user.findUnique({ where: { id: userId } });
          const email = user?.email;

          const emailHtml = buyerValidatedEmail();
          const transporter = nodemailer.createTransport(
            nodemailerSendgrid({
              apiKey: env.SENDGRID_API_KEY,
            }),
          );
          await transporter.sendMail({
            from: '"Nossa Terra" <nossaterra.dev@gmail.com>',
            to: email,
            subject: "Sua empresa já pode anunciar no Nossa Terra!",
            html: emailHtml,
          });
          console.log("Email sent successfully.");
        }
        return {
          success: true,
          message: "Successfully changed user activation status",
        };
      } catch (error) {
        console.error("Error updating user or sending email: ", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // NOTE: Should we make this an adminProcedure???
  deleteUser: backofficeProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(({ input: { userId }, ctx: { db } }) => {
      return db.user.delete({
        where: { id: userId },
      });
    }),
});
