import { useMemo } from "react";
import { z } from "zod";
import { lengthFormattedCPF } from "~/utils/formatters";
import { validateCNPJ, validateCPF } from "~/utils/validators";

export function useFirstDataStepSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z
        .object({
          name: z.string({ required_error: "Você deve inserir seu nome" }).min(1),
          cpf: z
            .string({ required_error: "Você deve inserir um CPF ou CNPJ válido" })
            .min(1, { message: "CPF / CNPJ é obrigatório" })
            .refine(
              (data) =>
                data.length <= lengthFormattedCPF
                  ? validateCPF(data)
                  : validateCNPJ(data),

              (data) => ({
                message:
                  data.length <= lengthFormattedCPF
                    ? "CPF inválido"
                    : "CNPJ inválido",
              }),
            ),
          password: z.string({ required_error: "Você deve inserir uma senha" }).min(1),
          agreeToTermsAndConditions: z.boolean({ required_error: "Você deve concordar com os Termos e Condições" })
            .refine((value) => value === (true), {
              message: "Você deve concordar com os Termos e Condições",
            }),
          confirmPassword: z.string({ required_error: "Você deve inserir a confirmação de senha" }).min(1),
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
