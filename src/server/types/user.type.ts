import { z } from "zod";
import { emptyString } from "~/utils/constants";
import {
  higherEndLengthFormattedPhone,
  lowerEndLengthFormattedPhone,
  lengthFormattedZIPCode,
} from "~/utils/formatters";
import { validateInstagram } from "~/utils/validators";

import { UserActiveState, Role, BusinessSector } from "@prisma/client";
export { UserActiveState, Role, BusinessSector } from "@prisma/client";

export const UserActiveStateLabel = {
  active: "Ativo",
  inactive: "Inativo",
  inactive_payment_problem: "Inadimplente",
} as const satisfies Record<UserActiveState, string>;

export const BusinessSectorLabel = {
  Exporter: "Exportador",
  Distributor: "Distribuidor",
  Retailer: "Varejista",
  Other: "Outro",
} as const satisfies Record<BusinessSector, string>;

export const addressSchema = z.object({
  zipCode: z.string().min(lengthFormattedZIPCode).max(lengthFormattedZIPCode),
  city: z.string().min(2).max(80),
  province: z.string().min(2).max(2),
  street: z.string().min(2).max(100),
  district: z.string().max(80).optional(),
  streetNumber: z.string().max(10).optional(),
  complementary: z.string().max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const sellerSocialSchema = z.object({
  phone: z
    .string()
    .min(lowerEndLengthFormattedPhone)
    .max(higherEndLengthFormattedPhone),
  phoneUsesWhatsapp: z.boolean().optional().default(false),
});

export const buyerSocialSchema = sellerSocialSchema.merge(
  z.object({
    instagram: z
      .string()
      .refine(
        (instagram) =>
          instagram === emptyString || validateInstagram(instagram),
      )
      .optional(),
    secondaryPhone: z
      .string()
      // This is causing problems with the optional validation,
      // when there is no secondary phone we're not supposed to error with `min` constraint
      // .min(lowerEndLengthFormattedPhone)
      .max(higherEndLengthFormattedPhone)
      .optional(),
    secondaryPhoneUsesWhatsapp: z.boolean().optional(),
  }),
);

export const userAttributes = z
  .object({
    activeState: z.nativeEnum(UserActiveState).optional().default("inactive"),
    role: z.nativeEnum(Role).optional().default("seller"),

    name: z.string(),
    email: z.string(),
    cpf: z.string(),
    rg: z.string().optional(),
    businessMainSector: z.nativeEnum(BusinessSector).optional(),
    avatarImage: z.string().optional(),
  })
  .merge(addressSchema)
  .merge(buyerSocialSchema);

export type UserAttributes = z.infer<typeof userAttributes>;

export const userSchema = userAttributes.merge(z.object({ id: z.string() }));
export type User = z.infer<typeof userSchema>;

export const PermittedRoles = {
  Common: ["seller", "buyer"],
  BuyerOnly: ["buyer"],

  Backoffice: ["backoffice", "admin"],
  Admin: ["admin"],
} as const satisfies Record<string, Role[]>;
