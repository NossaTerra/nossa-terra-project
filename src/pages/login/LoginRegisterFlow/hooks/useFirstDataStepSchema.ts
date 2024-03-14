import { useMemo } from "react";
import { z } from "zod";
import { validateCNPJ, validateCPF } from "~/utils/validators";
import type { ChooseRoleFields } from "./useChooseRoleSchema";
import { cpfIsCNPJ } from "~/utils/formHelpers";

export type ChosenRole = ChooseRoleFields["role"];

export function useFirstDataStepSchema(role?: ChosenRole) {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z
        .object({
          name: z
            .string({ required_error: "Você deve inserir o nome" })
            .min(3, { message: "Nome com ao menos 3 caracte" }),
          cpf: z
            .string({
              required_error: "Você deve inserir um CPF ou CNPJ válido",
            })
            .refine(
              (data) =>
                cpfIsCNPJ({ cpf: data, role })
                  ? validateCNPJ(data)
                  : validateCPF(data),

              (data) => ({
                message: cpfIsCNPJ({ cpf: data, role })
                  ? "CNPJ inválido"
                  : "CPF inválido",
              }),
            ),
          password: z
            .string({ required_error: "Você deve inserir uma senha" })
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
            .max(30, { message: "A senha deve ter no máximo 30 caracteres" })
            .refine((value) => /[A-Z]/.test(value), {
              message:
                "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número",
            })
            .refine((value) => /[a-z]/.test(value), {
              message:
                "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número",
            })
            .refine((value) => /\d/.test(value), {
              message:
                "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número",
            }),
          agreeToTermsAndConditions: z
            .boolean({
              required_error: "Você deve concordar com os Termos e Condições",
            })
            .refine((value) => value === true, {
              message: "Você deve concordar com os Termos e Condições",
            }),
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
    [role],
  );
}

export type FirstDataStepFields = z.infer<
  ReturnType<typeof useFirstDataStepSchema>
>;
