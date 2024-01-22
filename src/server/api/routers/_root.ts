import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { authRouter } from "./auth";
import { forgetPasswordRouter } from "./forgetPasword";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  forgetPassword: forgetPasswordRouter,
});

export type AppRouter = typeof appRouter;
