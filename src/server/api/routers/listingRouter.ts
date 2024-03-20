import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { buyerOnlyProcedure } from "../trpc/procedures";

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
    }),

  editListing: buyerOnlyProcedure
    .input(listingSchema)
    .mutation(({ input: { id, ...data }, ctx: { db, user } }) => {
      return db.listing.update({
        where: { id, userId: user.id },
        data,
      });
    }),

  deleteListing: buyerOnlyProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input: { id }, ctx: { db, user } }) => {
      return db.listing.delete({
        where: { id, userId: user.id },
      });
    }),

  getMyListings: buyerOnlyProcedure.query(({ ctx: { db, user } }) => {
    return db.listing.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: true,
      },
    });
  }),
});
