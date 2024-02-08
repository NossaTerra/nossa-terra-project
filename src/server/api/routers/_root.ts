import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { forgetPasswordRouter } from "./forgetPassword";
import { backofficeRouter } from "./backoffice";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  forgetPassword: forgetPasswordRouter,
  backoffice: backofficeRouter,
});

export type AppRouter = typeof appRouter;
