import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { adminProcedure, publicProcedure } from "../trpc/procedures";
import { productSchema } from "~/server/types/product.type";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  dangerouslyResetProducts: adminProcedure
    .input(z.array(productSchema.omit({ id: true })))
    .mutation(({ input, ctx: { db } }) => {
      return db.$transaction(async (prisma) => {
        try {
          await prisma.product.deleteMany();
          return await prisma.product.createMany({
            data: input.map((product) => ({
              ...product,
            })),
          });
        } catch (error) {
          console.error(error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      });
    }),

  createProduct: adminProcedure
    .input(productSchema.omit({ id: true }))
    .mutation(({ input, ctx: { db } }) => {
      try {
        return db.product.create({
          data: input,
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  editProduct: adminProcedure
    .input(productSchema)
    .mutation(({ input: { id, ...data }, ctx: { db } }) => {
      try {
        return db.product.update({
          where: { id },
          data,
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  deleteProduct: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input: { id }, ctx: { db } }) => {
      try {
        return db.product.delete({
          where: { id },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getAll: publicProcedure.query(({ ctx: { db } }) => {
    try {
      return db.product.findMany();
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
