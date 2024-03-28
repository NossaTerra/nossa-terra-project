import { AdType } from "@prisma/client";
import { useMemo } from "react";
import { z } from "zod";

export function useAdSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z.object({
        name: z
          .string({ required_error: "Você deve inserir o nome" })
          .min(5, {
            message: "O nome do anúncio deve ter ao menos 5 caracteres",
          })
          .max(40, {
            message: "O nome do anúncio deve ter no máximo 40 caracteres",
          }),
        adImage: z.string({ required_error: "Você deve inserir a imagem" }),
        link: z
          .string({ required_error: "Você deve inserir o link" })
          .url({ message: "Insira um link válido" })
          .optional(),
        type: z
          .nativeEnum(AdType)
          .optional()
          .refine((type) => type !== undefined, {
            message: "Por favor, insira o tipo do anúncio",
          })
          .transform((type) => {
            if (type === undefined) {
              throw new Error("DEV: you didnt' refine the ad to non nullable");
            }
            return type;
          }),
      }),
    [],
  );
}

export type AdFields = z.infer<ReturnType<typeof useAdSchema>>;
