import { adRouter } from "./adRouter";
import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { authRouter } from "./authRouter";
import { profileRouter } from "./profileRouter";
import { forgetPasswordRouter } from "./forgetPasswordRouter";
import { backofficeRouter } from "./backofficeRouter";
import { productRouter } from "./productRouter";
import { listingRouter } from "./listingRouter";
import { searchRouter } from "./searchRouter";
import { secretRouter } from "./secretRouter";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  forgetPassword: forgetPasswordRouter,
  backoffice: backofficeRouter,
  product: productRouter,
  search: searchRouter,
  listing: listingRouter,
  ad: adRouter,

  secret: secretRouter,
});

export type AppRouter = typeof appRouter;
