import { useMemo } from "react";
import { z } from "zod";

export function useWelcomeBackSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        password: z.string().min(1),
      }),
    [],
  );
}

export type WelcomeBackFields = z.infer<
  ReturnType<typeof useWelcomeBackSchema>
>;
