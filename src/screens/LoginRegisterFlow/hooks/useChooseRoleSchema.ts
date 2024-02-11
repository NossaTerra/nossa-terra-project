import { useMemo } from "react";
import { z } from "zod";
import { RoleTypeSchema } from "~/server/types/user.type";

export function useChooseRoleSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        role: RoleTypeSchema.Common,
      }),
    [],
  );
}

export type ChooseRoleFields = z.infer<ReturnType<typeof useChooseRoleSchema>>;
