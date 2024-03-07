import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { authRouter } from "./authRouter";
import { profileRouter } from "./profileRouter";
import { forgetPasswordRouter } from "./forgetPasswordRouter";
import { backofficeRouter } from "./backofficeRouter";
import { productRouter } from "./productRouter";
import { listingRouter } from "./listingRouter";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  forgetPassword: forgetPasswordRouter,
  backoffice: backofficeRouter,
  product: productRouter,
  listing: listingRouter,
});

export type AppRouter = typeof appRouter;
