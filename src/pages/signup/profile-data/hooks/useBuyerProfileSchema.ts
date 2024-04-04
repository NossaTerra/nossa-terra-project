import { useMemo } from "react";
import { z } from "zod";
import { BusinessSector } from "~/server/types/user.type";
import { emptyString } from "~/utils/constants";
import { validateInstagram } from "~/utils/validators";
import { useAddressSchema } from "./useAddressSchema";
import {
  landlinePhonePattern,
  mobilePhonePattern,
} from "~/components/ui/input/masks/phone";

export function useBuyerProfileSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages
  const addressSchema = useAddressSchema();

  return useMemo(
    () =>
      addressSchema
        .merge(
          z.object({
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

            businessMainSector: z
              .nativeEnum(BusinessSector)
              .optional()
              .refine((sector) => sector !== undefined, {
                message: "Por favor, insira o ramo de atuação da sua empresa",
              })
              .transform((sector) => {
                if (sector === undefined) {
                  throw new Error(
                    "DEV: you didnt' refine the sector to non nullable",
                  );
                }
                return sector;
              }),

            secondaryPhone: z.ostring().refine(
              (phone) => {
                if (!phone) {
                  return true;
                }
                const numbersCount = phone.replace(/\D/g, "").length;
                if (numbersCount == 0) {
                  return true;
                }
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
            instagram: z
              .string()
              .refine(
                (instagram) => {
                  return (
                    instagram === emptyString || validateInstagram(instagram)
                  );
                },
                {
                  message: "Nome de usuário do Instagram inválido inicie com @",
                },
              )
              .optional(),
            phoneUsesWhatsapp: z.boolean().optional().default(false),
            secondaryPhoneUsesWhatsapp: z.boolean().optional().default(false),
            avatarImage: z.string().optional(),
          }),
        )
        .refine(
          (data) =>
            !data.secondaryPhoneUsesWhatsapp ||
            (data.secondaryPhoneUsesWhatsapp &&
              data.secondaryPhone !== undefined &&
              data.secondaryPhone !== emptyString),
          {
            message: "Apenas selecione se o telefone secundário for válido",
            path: ["secondaryPhoneUsesWhatsapp"],
          },
        ),
    [addressSchema],
  );
}

export type BuyerProfileData = z.infer<
  ReturnType<typeof useBuyerProfileSchema>
>;
