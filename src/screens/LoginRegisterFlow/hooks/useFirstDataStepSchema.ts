import { useMemo } from "react";
import { z } from "zod";

export function useFirstDataStepSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z
        .object({
          name: z.string().min(1),
          cpf: z.string().min(1),
          password: z.string().min(1),
          confirmPassword: z.string().min(1),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "As senhas devem ser iguais",
          path: ["confirmPassword"],
        }),
    [],
  );
}

export type FirstDataStepFields = z.infer<
  ReturnType<typeof useFirstDataStepSchema>
>;
