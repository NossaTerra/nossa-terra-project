import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { publicProcedure } from "../trpc/procedures";
import { z } from "zod";

function calculateGlobalDistanceKm({
  pointA,
  pointB,
}: {
  pointA: { lat: number; lon: number };
  pointB: { lat: number; lon: number };
}) {
  const R = 6371; // Km
  const deltaLat = deg2rad(pointB.lat - pointA.lat);
  const deltaLon = deg2rad(pointB.lon - pointA.lon);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(deg2rad(pointA.lat)) *
    Math.cos(deg2rad(pointB.lat)) *
    Math.sin(deltaLon / 2) *
    Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const searchRouter = createTRPCRouter({
  getProductListings: publicProcedure
    .input(
      z.object({
        productId: z.string().optional(),
        searchingUserLatitude: z.number().nullable(),
        searchingUserLongitude: z.number().nullable(),
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
        const listings = await db.listing.findMany({
          where: { productId },
          // FIXME: This pagination is not working as expected
          // Later in this query we are filtering out the listings by distance,
          // which means the amount of every page is inconsistent
          //
          // The current approach involves a probably VERY expensive waterfall
          // where the client decides to refetch on some scenarios just after a successful fetch
          //
          // 2 possible solutions for both the waterfall and the inconsistent amount of listings
          // -> Make the full query, filter the results (as we are already doing) and then just splice the array to behave like pagination
          // -> Make a raw SQL query and bake the DISTANCE filter into the query ( super performant, terrible to maintain, we even would opt out of typesafety for this )
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { price: "desc" },

          include: {
            user: {
              include: {
                listings: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (listings.length > limit) {
          const nextItem = listings.pop();
          if (nextItem) nextCursor = nextItem.id;
        }

        const distanceFilteredListings = listings.filter((listing) => {
          if (
            !searchingUserLatitude ||
            !searchingUserLongitude ||
            !distanceFilter ||
            listing.user.latitude === null ||
            listing.user.longitude === null
          ) {
            return true;
          }

          const isWithinDistance =
            calculateGlobalDistanceKm({
              pointA: {
                lat: searchingUserLatitude,
                lon: searchingUserLongitude,
              },
              pointB: {
                lat: listing.user.latitude,
                lon: listing.user.longitude,
              },
            }) <= distanceFilter;

          return isWithinDistance;
        });

        return { searchResults: distanceFilteredListings, nextCursor };
      },
    ),
});
