import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import {
  backofficeProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc/procedures";

import { TRPCError } from "@trpc/server";
import cloudinaryV2 from "~/utils/configs";
import { adSchema } from "~/server/types/ad.type";

export const adRouter = createTRPCRouter({
  uploadAd: backofficeProcedure
    .input(z.object({ dataUrl: z.string() }))
    .mutation(async ({ input: { dataUrl } }) => {
      try {
        const result = await cloudinaryV2.uploader.upload(dataUrl, {
          folder: "nossa-terra-ads",
          crop: "fill",
        });
        return result.secure_url;
      } catch (error) {
        console.log("cloudnary error", error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  createAd: backofficeProcedure
    .input(adSchema.omit({ id: true }))
    .mutation(({ input, ctx: { db } }) => {
      return db.ad.create({
        data: input,
      });
    }),

  deleteAd: backofficeProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input: { id }, ctx: { db } }) => {
      return db.ad.delete({
        where: { id },
      });
    }),

  toggleAdStatus: backofficeProcedure
    .input(z.object({ id: z.string(), newStatus: z.boolean() }))
    .mutation(({ input: { id, newStatus }, ctx: { db } }) => {
      console.log("Toggling ad status for id:", id, "New status:", newStatus);
      return db.ad
        .update({
          where: { id },
          data: { isActive: newStatus },
        })
        .then((updatedAd) => {
          console.log("Updated ad:", updatedAd);
          return updatedAd;
        })
        .catch((error) => {
          console.error("Error toggling ad status:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        });
    }),

  getAll: publicProcedure.query(({ ctx: { db } }) => {
    return db.ad.findMany();
  }),
});
