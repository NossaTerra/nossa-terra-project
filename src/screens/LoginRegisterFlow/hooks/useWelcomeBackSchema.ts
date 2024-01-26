import { useMemo } from "react";
import { z } from "zod";

export function useWelcomeBackSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        password: z.string({ required_error: "Você deve inserir a senha do seu usuário" }).min(8),
      }),
    [],
  );
}

export type WelcomeBackFields = z.infer<
  ReturnType<typeof useWelcomeBackSchema>
>;
