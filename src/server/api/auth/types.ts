import { z } from "zod";

export const userRoles = ["seller", "buyer"] as const;
export const userRolesSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRolesSchema>;

export const adminRoles = ["backoffice"] as const;
export const adminRolesSchema = z.enum(adminRoles);
export type AdminRole = z.infer<typeof adminRolesSchema>;

export const roles = [...userRoles, ...adminRoles] as const;
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
