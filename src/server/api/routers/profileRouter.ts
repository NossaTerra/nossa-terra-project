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
        attributes: z.object({
          avatarImage: z.string().optional(),
          businessMainSector: z.nativeEnum(BusinessSector),
          address: addressSchema,
          social: buyerSocialSchema,
        }),
      }),
    )
    .mutation(
      async ({
        ctx: { db },
        input: {
          id,
          attributes: { social, address, ...rest },
        },
      }) => {
        try {
          return await db.user.update({
            where: {
              id,
              role: "buyer",
            },
            data: { ...address, ...social, ...rest },
          });
        } catch (error) {
          console.log(error);
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
      },
    ),

  editSeller: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        attributes: z.object({
          rg: z.string().min(6).max(15),
          address: addressSchema,
          social: sellerSocialSchema,
        }),
      }),
    )
    .mutation(
      async ({
        ctx: { db },
        input: {
          id,
          attributes: { social, address, ...rest },
        },
      }) => {
        try {
          return await db.user.update({
            where: {
              id,
              role: "seller",
            },
            data: { ...address, ...social, ...rest },
          });
        } catch (error) {
          console.log(error);
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
      },
    ),
});
