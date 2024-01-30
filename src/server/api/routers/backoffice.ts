import { UserActiveState } from "./../auth/types";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { backofficeProcedure } from "../trpc/procedures";

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
    .mutation(({ input: { userId, activeState }, ctx: { db } }) => {
      return db.user.update({
        where: { id: userId },
        data: { activeState },
      });
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
