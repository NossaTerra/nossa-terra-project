import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { publicProcedure } from "../trpc/procedures";
import { z } from "zod";

export const searchRouter = createTRPCRouter({
  getProductListings: publicProcedure
    .input(z.string().optional())
    .query(async ({ input: productId, ctx: { db } }) => { 
      if(!productId){
        return null
      }
      const product = await db.product.findUnique({
        where: { id: productId },
        include: { listings: true }, // Include all listings directly
      });

      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      // Custom object to store the result
      const result = [];

      for (const listing of product.listings) {
        // Fetch the user associated with the current listing
        const user = await db.user.findUnique({
          where: { id: listing.userId },
        });

        if (!user) {
          throw new Error(`User with ID ${listing.userId} not found.`);
        }

        // Fetch all listings of the user associated with the current listing
        const userListings = await db.user.findUnique({
          where: { id: listing.userId },
          include: { listings: { include: { product: true } } }, // Include product information for each listing
        });

        // Add the current listing, user, and all the other listings of the user
        result.push({
          listing: listing,
          user: user,
          userListings: userListings?.listings.map((userListing) => ({
            productId: userListing.product.id,
            price: userListing.price,
            name: userListing.product.name, // Include product name inside each userAndListings object
          })),
        });
      }

      // Sort the result array by descending listing prices
      result.sort((a, b) => {
        const priceA = parseFloat(a.listing.price.toString());
        const priceB = parseFloat(b.listing.price.toString());
        return priceB - priceA;
      });

      return result;
    }),
});
