import { useMemo } from "react";
import { z } from "zod";

export function useResetPasswordSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z
        .object({
          password: z
            .string({ required_error: "Você deve inserir uma senha" })
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
            .max(30, { message: "A senha deve ter no máximo 30 caracteres" }),

          confirmPassword: z
            .string({
              required_error: "Você deve inserir a confirmação de senha",
            })
            .min(8, {
              message: "A confirmação de senha deve ter no mínimo 8 caracteres",
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "As senhas devem ser iguais",
          path: ["confirmPassword"],
        }),
    [],
  );
}

export type ResetPasswordFields = z.infer<
  ReturnType<typeof useResetPasswordSchema>
>;
