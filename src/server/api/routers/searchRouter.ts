import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { publicProcedure } from "../trpc/procedures";
import { z } from "zod";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function isWithinDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  distanceKm: number,
) {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= distanceKm;
}

export const searchRouter = createTRPCRouter({
  getProductListings: publicProcedure
    .input(
      z.object({
        productId: z.string().optional(),
        searchingUserLatitude: z.number().optional(),
        searchingUserLongitude: z.number().optional(),
        distanceFilter: z.number().optional(),
      }),
    )
    .query(
      async ({
        input: {
          productId,
          searchingUserLatitude,
          searchingUserLongitude,
          distanceFilter,
        },
        ctx: { db },
      }) => {
        if (!productId) {
          return null;
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

          const shouldFilterByDistance =
          !!searchingUserLatitude &&
          !!searchingUserLongitude &&
          !!distanceFilter &&
          !!user.latitude &&
          !!user.longitude;
          
          let withinDistance = true;
          if (shouldFilterByDistance) {
            withinDistance = isWithinDistance(
              searchingUserLatitude,
              searchingUserLongitude,
              user.latitude ?? 0,
              user.longitude ?? 0,
              distanceFilter,
            );
          }

          // Add the current listing, user, and all the other listings of the user
          if (withinDistance) {
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
        }
        // Sort the result array by descending listing prices
        result.sort((a, b) => {
          const priceA = parseFloat(a.listing.price.toString());
          const priceB = parseFloat(b.listing.price.toString());
          return priceB - priceA;
        });

        return result;
      },
    ),
});
