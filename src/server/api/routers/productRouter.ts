import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { adminProcedure, publicProcedure } from "../trpc/procedures";
import { productSchema } from "~/server/types/product.type";

export const productRouter = createTRPCRouter({
  dangerouslyResetProducts: adminProcedure
    .input(z.array(productSchema.omit({ id: true })))
    .mutation(({ input, ctx: { db } }) => {
      return db.$transaction(async (prisma) => {
        await prisma.product.deleteMany();
        return await prisma.product.createMany({
          data: input.map((product) => ({
            ...product,
          })),
        });
      });
    }),

  createProduct: adminProcedure
    .input(productSchema.omit({ id: true }))
    .mutation(({ input, ctx: { db } }) => {
      return db.product.create({
        data: input,
      });
    }),

  editProduct: adminProcedure
    .input(productSchema)
    .mutation(({ input: { id, ...data }, ctx: { db } }) => {
      return db.product.update({
        where: { id },
        data,
      });
    }),

  deleteProduct: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input: { id }, ctx: { db } }) => {
      return db.product.delete({
        where: { id },
      });
    }),

  getAll: publicProcedure.query(({ ctx: { db } }) => {
    return db.product.findMany();
  }),
});
