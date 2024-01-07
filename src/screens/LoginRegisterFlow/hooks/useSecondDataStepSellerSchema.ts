import { useMemo } from "react";
import { z } from "zod";
import {
  lowerEndLengthFormattedPhone,
  higherEndLengthFormattedPhone,
} from "~/utils/formatters";
import { validateRG, validatePhone } from "~/utils/validators";
import { useAddressSchema } from "./useAddressSchema";

export function useSecondDataStepSellerSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  const adressSchmea = useAddressSchema();

  return useMemo(
    () =>
      adressSchmea.merge(
        z.object({
          rg: z
            .string({ required_error: "Você deve inserir seu RG" })
            .min(6, { message: "Por favor insira um RG válido" })
            .max(15, { message: "Por favor insira um RG válido" })
            .refine(validateRG, { message: "RG inválido" }),
          phone: z
            .string({
              required_error: "Por favor, insira um telefone da sua empresa",
            })
            .min(lowerEndLengthFormattedPhone, {
              message: `O telefone deve ter no mínimo ${lowerEndLengthFormattedPhone} dígitos`,
            })
            .max(higherEndLengthFormattedPhone, {
              message: `O telefone deve ter no máximo  ${higherEndLengthFormattedPhone} dígitos`,
            })
            .refine(validatePhone, { message: "Número de telefone inválido" }),
          phoneUsesWhatsapp: z.boolean().optional(),
        }),
      ),
    [adressSchmea],
  );
}

export type SecondDataStepSellerFields = z.infer<
  ReturnType<typeof useSecondDataStepSellerSchema>
>;
