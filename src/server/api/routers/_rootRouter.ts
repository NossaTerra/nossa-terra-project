import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { authRouter } from "./authRouter";
import { profileRouter } from "./profileRouter";
import { forgetPasswordRouter } from "./forgetPasswordRouter";
import { backofficeRouter } from "./backofficeRouter";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  forgetPassword: forgetPasswordRouter,
  backoffice: backofficeRouter,
});

export type AppRouter = typeof appRouter;
