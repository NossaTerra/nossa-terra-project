import { useMemo } from "react";
import { z } from "zod";

export function useForgotPasswordSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        email: z.string().email(),
      }),
    [],
  );
}

export type ForgotPasswordFields = z.infer<
  ReturnType<typeof useForgotPasswordSchema>
>;
