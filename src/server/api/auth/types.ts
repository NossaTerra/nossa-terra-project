import { z } from "zod";
import { emptyString } from "~/utils/constants";
import {
  higherEndLengthFormattedPhone,
  lowerEndLengthFormattedPhone,
  lengthFormattedZIPCode,
} from "~/utils/formatters";
import { validateInstagram, validatePhone } from "~/utils/validators";

import { UserActiveState } from "@prisma/client";
export { UserActiveState } from "@prisma/client";

export const roles = ["seller", "buyer", "backoffice", "admin"] as const;
export const rolesSchema = z.enum(roles);
export type Role = z.infer<typeof rolesSchema>;

export const businessSectors = [
  "Exporter",
  "Distributor",
  "Retailer",
  "Other",
] as const;

export const businessSectorSchema = z.enum(businessSectors);
export type BusinessSector = z.infer<typeof businessSectorSchema>;

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
  neighborhood: z.string().min(2).max(80).optional(),
  streetNumber: z.string().min(1).max(10).optional(),
  complementary: z.string().min(2).max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const sellerSocialSchema = z.object({
  phone: z
    .string()
    .min(lowerEndLengthFormattedPhone)
    .max(higherEndLengthFormattedPhone),
  phoneUsesWhatsapp: z.boolean().optional(),
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
      .refine((phone) => phone === emptyString || validatePhone(phone))
      .optional(),
    secondaryPhoneUsesWhatsapp: z.boolean().optional(),
  }),
);

export const userAttributes = z
  .object({
    email: z.string(),
    avatarImage: z.string().optional(),
    name: z.string(),
    cpf: z.string(),
    role: rolesSchema,
    activeState: z.nativeEnum(UserActiveState).optional().default("inactive"),
    rg: z.string().optional(),
    businessMainSector: businessSectorSchema.optional(),
  })
  .merge(addressSchema)
  .merge(buyerSocialSchema);

export type UserAttributes = z.infer<typeof userAttributes>;

export const userSchema = userAttributes.merge(z.object({ id: z.string() }));
export type User = z.infer<typeof userSchema>;

// Permissions

function roleParser<T extends [Role, ...Role[]]>(roles: T) {
  return z.enum(roles);
}

export const RoleTypeSchema = {
  Common: roleParser(["seller", "buyer"]),
  BuyerOnly: roleParser(["buyer"]),
  Backoffice: roleParser(["backoffice", "admin"]),
  Admin: roleParser(["admin"]),
} as const;
