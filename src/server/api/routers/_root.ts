import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { authRouter } from "./auth";
import { forgetPasswordRouter } from "./forgetPassword";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  forgetPassword: forgetPasswordRouter,
});

export type AppRouter = typeof appRouter;
