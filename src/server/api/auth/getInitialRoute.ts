import { type User } from "lucia";
import { PermittedRoles } from "../../types/user.type";
import { z } from "zod";

export const getInitialRoute = (user: User) => {
  const parseResult = z.enum(PermittedRoles.Backoffice).safeParse(user.role);
  return parseResult.success ? "/backoffice/users" : "/";
};
