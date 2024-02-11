import { useMemo } from "react";
import { z } from "zod";
import { BusinessSector } from "~/server/types/user.type";
import { emptyString } from "~/utils/constants";
import {
  lowerEndLengthFormattedPhone,
  higherEndLengthFormattedPhone,
  formatPhone,
} from "~/utils/formatters";
import { validateInstagram } from "~/utils/validators";
import { useAddressSchema } from "./useAddressSchema";

export function useSecondDataStepBuyerSchema() {
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
                  return (
                    formatPhone(phone).length >= lowerEndLengthFormattedPhone &&
                    formatPhone(phone).length <= higherEndLengthFormattedPhone
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

            secondaryPhone: z
              .string()
              .refine(
                (phone) => {
                  return (
                    (formatPhone(phone).length >=
                      lowerEndLengthFormattedPhone &&
                      formatPhone(phone).length <=
                      higherEndLengthFormattedPhone) ||
                    !phone
                  );
                },
                {
                  message: "Telefone inválido",
                },
              )
              .optional(),
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

export type SecondDataStepBuyerFields = z.infer<
  ReturnType<typeof useSecondDataStepBuyerSchema>
>;
