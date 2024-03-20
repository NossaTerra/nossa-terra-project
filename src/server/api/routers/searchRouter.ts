import { type SearchResult } from "./../../../pages/search/types";
import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { publicProcedure } from "../trpc/procedures";
import { z } from "zod";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
  return calculateDistance(lat1, lon1, lat2, lon2) <= distanceKm;
}

export const searchRouter = createTRPCRouter({
  getProductListings: publicProcedure
    .input(
      z.object({
        productId: z.string().optional(),
        searchingUserLatitude: z.number().optional(),
        searchingUserLongitude: z.number().optional(),
        distanceFilter: z.number().optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(
      async ({
        input: {
          productId,
          searchingUserLatitude,
          searchingUserLongitude,
          distanceFilter,
          cursor,
          limit,
        },
        ctx: { db },
      }) => {
        if (!productId) return null;

        const product = await db.product.findUnique({
          where: { id: productId },
          include: {
            listings: {
              take: limit + 1,
              cursor: cursor ? { id: cursor } : undefined,
              orderBy: { price: "desc" },
            },
          },
        });

        if (!product)
          throw new Error(`Product with ID ${productId} not found.`);

        const searchResults = [] as SearchResult[];
        let nextCursor: typeof cursor | undefined = undefined;

        if (product.listings.length > limit) {
          const nextItem = product.listings.pop();
          if (nextItem) nextCursor = nextItem.id;
        }

        await Promise.all(
          product.listings.map(async (listing) => {
            const user = await db.user.findUnique({
              where: { id: listing.userId },
            });
            if (!user)
              throw new Error(`User with ID ${listing.userId} not found.`);

            const userListings = await db.user.findUnique({
              where: { id: listing.userId },
              include: { listings: { include: { product: true } } },
            });

            const shouldFilterByDistance: boolean =
              !!searchingUserLatitude &&
              !!searchingUserLongitude &&
              !!distanceFilter &&
              !!user.latitude &&
              !!user.longitude;

            const withinDistance: boolean =
              !shouldFilterByDistance ||
              isWithinDistance(
                searchingUserLatitude ?? 0,
                searchingUserLongitude ?? 0,
                user.latitude ?? 0,
                user.longitude ?? 0,
                distanceFilter ?? Infinity,
              );

            if (withinDistance) {
              const userListingData = userListings?.listings.map(
                (userListing) => ({
                  productId: userListing.product.id,
                  price: userListing.price,
                  name: userListing.product.name,
                }),
              );

              searchResults.push({
                listing,
                user,
                userListings: userListingData ?? [], // Ensure userListings is an array
              });
            }
          }),
        );

        return { searchResults, nextCursor };
      },
    ),
});
