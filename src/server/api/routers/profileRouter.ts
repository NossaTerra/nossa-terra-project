import {
  addressSchema,
  BusinessSector,
  buyerSocialSchema,
  sellerSocialSchema,
} from "../../types/user.type";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc/procedures";

export const profileRouter = createTRPCRouter({
  editBuyer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z
          .object({
            avatarImage: z.string().optional(),
            businessMainSector: z.nativeEnum(BusinessSector),
          })
          .merge(addressSchema)
          .merge(buyerSocialSchema),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id, data } }) => {
      try {
        return await db.user.update({
          where: {
            id,
            role: "buyer",
          },
          data,
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  editSeller: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z
          .object({
            rg: z.string().min(6).max(15),
          })
          .merge(addressSchema)
          .merge(sellerSocialSchema),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id, data } }) => {
      try {
        return await db.user.update({
          where: {
            id,
            role: "seller",
          },
          data,
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
