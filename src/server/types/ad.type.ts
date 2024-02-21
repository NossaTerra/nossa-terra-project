import { z } from "zod";
import { AdType } from "@prisma/client";
export { AdType } from "@prisma/client";

export const AdTypeLabel = {
  Small: "Pequena",
  Medium: "Média",
  Banner: "Banner",
} as const satisfies Record<AdType, string>;

export const adSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  link: z.string().optional(),
  type: z.nativeEnum(AdType),
  adImage: z.string(),
});
