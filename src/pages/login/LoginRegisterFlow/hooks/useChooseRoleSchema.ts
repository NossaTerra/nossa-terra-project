import { useMemo } from "react";
import { z } from "zod";
import { PermittedRoles } from "~/server/types/user.type";

export function useChooseRoleSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        role: z.enum(PermittedRoles.Common, {
          required_error: "Por favor, escolha um tipo",
        }),
      }),
    [],
  );
}

export type ChooseRoleFields = z.infer<ReturnType<typeof useChooseRoleSchema>>;
