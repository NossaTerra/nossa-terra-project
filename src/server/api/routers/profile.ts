import {
  addressSchema,
  BusinessSector,
  buyerSocialSchema,
  sellerSocialSchema,
} from "../auth/types";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { auth } from "../auth/lucia";
import { protectedProcedure } from "../trpc/procedures";

export const profileRouter = createTRPCRouter({

  editBuyer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        input: z.object({
          avatarImage: z.string().optional(),
          businessMainSector: z.nativeEnum(BusinessSector),
          address: addressSchema,
          social: buyerSocialSchema,
        }),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id, input: { social, address, ...rest } } }) => {
      try {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (user.role !== "buyer") {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
        const updatedUser = await auth.updateUserAttributes(id, {
          ...social,
          ...address,
          ...rest
        })
        return updatedUser;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  editSeller: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        input: z.object({
          rg: z.string().min(6).max(15),
          address: addressSchema,
          social: sellerSocialSchema,
        }),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id, input: { social, address, ...rest } } }) => {
      try {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (user.role !== "seller") {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
        const updatedUser = await auth.updateUserAttributes(id, {
          ...social,
          ...address,
          ...rest
        })
        return updatedUser;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
