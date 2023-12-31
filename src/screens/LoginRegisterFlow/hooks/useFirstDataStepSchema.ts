import { useMemo } from "react";
import { z } from "zod";
import { validateCPF } from "~/utils/validators";

export function useFirstDataStepSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z
        .object({
          name: z.string().min(1),
          cpf: z.string().min(1).refine(validateCPF, {
            message: "CPF inválido",
            path: ["cpf"],
          }),
          password: z.string().min(1),
          agreeToTermsAndConditions: z.boolean()
            .refine((value) => value === true, {
              message: "Você deve concordar com os Termos e Condições",
              path: ["agreeToTermsAndConditions"],
            }),
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
