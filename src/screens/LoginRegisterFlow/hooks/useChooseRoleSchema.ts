import { useMemo } from "react";
import { z } from "zod";
import { userRolesSchema } from "~/server/api/auth/types";

export function useChooseRoleSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        role: userRolesSchema,
      }),
    [],
  );
}

export type ChooseRoleFields = z.infer<ReturnType<typeof useChooseRoleSchema>>;
