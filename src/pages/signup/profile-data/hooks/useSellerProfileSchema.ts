import { useMemo } from "react";
import { z } from "zod";
import { validateRG } from "~/utils/validators";
import { useAddressSchema } from "./useAddressSchema";
import {
  landlinePhonePattern,
  mobilePhonePattern,
} from "~/components/ui/input/masks/phone";

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
                const withoutPlaceholder = phone.replace(/_/g, "");
                return (
                  withoutPlaceholder.length >= landlinePhonePattern.length &&
                  withoutPlaceholder.length <= mobilePhonePattern.length
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
