import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { publicProcedure } from "../trpc/procedures";

export const secretRouter = createTRPCRouter({
  trySecret: publicProcedure
    .input(z.string())
    .mutation(async ({ input: secretValue, ctx }) => {
      if (!env.APP_SECRET_KEY_LOCK) {
        return true;
      }

      if (secretValue !== env.APP_SECRET_KEY_LOCK) {
        return false;
      }

      ctx.res.setHeader(
        "Set-Cookie",
        `app_secret=${secretValue}; Path=/; HttpOnly;`,
      );
      return true;
    }),
});
