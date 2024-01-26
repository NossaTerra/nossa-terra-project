import { useMemo } from "react";
import { z } from "zod";

export function useGreetingSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        email: z.string({ required_error: "Você deve inserir um email válido" }).email(),
      }),
    [],
  );
}

export type GreetingFields = z.infer<ReturnType<typeof useGreetingSchema>>;
