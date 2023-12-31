import { z } from "zod";

export const roles = ["seller", "buyer", "backoffice"] as const;
export const rolesSchema = z.enum(roles);
export type Role = z.infer<typeof rolesSchema>;

export const userAttributes = z.object({
  email: z.string(),
  image: z.string().optional(),
  name: z.string(),
  cpf: z.string(),
  role: rolesSchema,
  isActive: z.boolean(),
});
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
  Backoffice: roleParser(["backoffice"]),
} as const;
