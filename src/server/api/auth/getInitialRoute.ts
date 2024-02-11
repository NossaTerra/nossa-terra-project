import { type User } from "lucia";
import { RoleTypeSchema } from "../../types/user.type";

export const getInitialRoute = (user: User) => {
  const parseResult = RoleTypeSchema.Backoffice.safeParse(user.role);
  return parseResult.success ? "/backoffice/users" : "/search";
};
