import { useMemo } from "react";
import { z } from "zod";
import {
  lowerEndLengthFormattedPhone,
  higherEndLengthFormattedPhone,
  formatPhone,
} from "~/utils/formatters";
import { validateRG } from "~/utils/validators";
import { useAddressSchema } from "./useAddressSchema";

export function useSellerProfileSchema() {
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
            .refine(
              (phone) => {
                return (
                  formatPhone(phone).length >= lowerEndLengthFormattedPhone &&
                  formatPhone(phone).length <= higherEndLengthFormattedPhone
                );
              },
              {
                message: "Telefone inválido",
              },
            ),
          phoneUsesWhatsapp: z.boolean().optional().default(false),
        }),
      ),
    [adressSchmea],
  );
}

export type SellerProfileData = z.infer<
  ReturnType<typeof useSellerProfileSchema>
>;
