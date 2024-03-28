import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { buyerOnlyProcedure } from "../trpc/procedures";
import { TRPCError } from "@trpc/server";

const listingSchema = z.object({
  id: z.string(),
  price: z.number(),
  productId: z.string(),
  userId: z.string(),
});

export const listingRouter = createTRPCRouter({
  createListing: buyerOnlyProcedure
    .input(z.object({ price: z.number(), productId: z.string() }))
    .mutation(({ input: { price, productId }, ctx: { db, user } }) => {
      try {
        return db.listing.upsert({
          where: {
            userId_productId: {
              userId: user.id,
              productId,
            },
          },
          update: {
            price,
          },
          create: {
            price,
            productId,
            userId: user.id,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  editListing: buyerOnlyProcedure
    .input(listingSchema)
    .mutation(({ input: { id, ...data }, ctx: { db, user } }) => {
      try {
        return db.listing.update({
          where: { id, userId: user.id },
          data,
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  deleteListing: buyerOnlyProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input: { id }, ctx: { db, user } }) => {
      try {
        return db.listing.delete({
          where: { id, userId: user.id },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getMyListings: buyerOnlyProcedure.query(({ ctx: { db, user } }) => {
    try {
      return db.listing.findMany({
        where: {
          userId: user.id,
        },
        include: {
          product: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
