import { z } from "zod";
import { ProductType } from "@prisma/client";
export { ProductType } from "@prisma/client";

export const ProductTypeLabel = {
  coffee: "café",
} as const satisfies Record<ProductType, string>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  mainColor: z.string(),
  type: z.nativeEnum(ProductType),
});

export function getProductImageSrc(productType: ProductType) {
  if (productType === ProductType.coffee) {
    return "/images/products/coffee.svg";
  }

  return "/images/placeholder.png";
}
