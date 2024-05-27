import { z } from "zod";
import { ProductType } from "@prisma/client";
export { ProductType } from "@prisma/client";

export const ProductTypeLabel = {
  CoffeeRobusta: "Robusta",
  CoffeeArabica: "Arábica",
} as const satisfies Record<ProductType, string>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  mainColor: z.string(),
  type: z.nativeEnum(ProductType),
  category: z.nativeEnum(ProductCategory),
});

export function getProductImageSrc(productType: ProductType) {
  if (productType === ProductType.CoffeeArabica) {
    return "/images/products/small_arabica.png";
  }
  if (productType === ProductType.CoffeeRobusta) {
    return "/images/products/small_robusta.png";
  }

  return "/images/placeholder.png";
}
