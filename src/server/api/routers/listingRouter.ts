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
      return db.listing.create({
        data: {
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

  getMyListings: buyerOnlyProcedure.query(async ({ ctx: { db, user } }) => {
    const myListings = await db.listing.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: true,
      },
    });

    type MyListing = (typeof myListings)[number];
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const mostRecentListingPerProduct: { [productId: string]: MyListing } = {};
    const pausedListings: MyListing[] = [];

    for (const listing of myListings) {
      const existingListing = mostRecentListingPerProduct[listing.product.id];
      if (!existingListing) {
        mostRecentListingPerProduct[listing.product.id] = listing;
      } else if (
        new Date(listing.updatedAt) > new Date(existingListing.updatedAt)
      ) {
        pausedListings.push(existingListing);
        mostRecentListingPerProduct[listing.product.id] = listing;
      } else {
        pausedListings.push(listing);
      }
    }

    const activeListings = Object.values(mostRecentListingPerProduct).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return { activeListings, pausedListings };
  }),
});
