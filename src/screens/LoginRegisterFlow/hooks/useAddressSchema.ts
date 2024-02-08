import { useMemo } from "react";
import { z } from "zod";
import { lengthFormattedZIPCode } from "~/utils/formatters";
import { validateZIPCode } from "~/utils/validators";

export function useAddressSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        zipCode: z
          .string({
            required_error: "Você deve inserir o CEP da sua empresa",
          })
          .min(lengthFormattedZIPCode, {
            message: `O CEP deve ter no mínimo ${lengthFormattedZIPCode} dígitos`,
          })
          .max(lengthFormattedZIPCode, {
            message: `O CEP deve ter no máximo ${lengthFormattedZIPCode} dígitos`,
          })
          .refine(validateZIPCode, { message: "CEP inválido" }),
        city: z
          .string({
            required_error: "Por favor, insira a cidade da sua empresa",
          })
          .min(2, { message: "A cidade deve ter no mínimo 2 caracteres" })
          .max(80, { message: "A cidade deve ter no máximo 80 caracteres" }),
        province: z
          .string({
            required_error: "Por favor, insira o estado da sua empresa",
          })
          .min(2, { message: "O estado deve ter no mínimo 2 caracteres" })
          .max(2, { message: "O estado deve ter exatamente 2 caracteres" }),
        street: z
          .string({
            required_error: "Por favor, insira o endereço da sua empresa",
          })
          .min(2, { message: "O endereço deve ter no mínimo 2 caracteres" })
          .max(100, {
            message: "O endereço deve ter no máximo 100 caracteres",
          }),
        streetNumber: z
          .string()
          .max(10, {
            message: "O número do endereço deve ter no máximo 10 caracteres",
          })
          .optional(),
        neighborhood: z
          .string()
          .max(80, { message: "O bairro deve ter no máximo 80 caracteres" })
          .optional(),
        complementary: z
          .string()
          .max(100, {
            message: "O complemento deve ter no máximo 100 caracteres",
          })
          .optional(),
      }),
    [],
  );
}

export type AddressData = z.infer<ReturnType<typeof useAddressSchema>>;
