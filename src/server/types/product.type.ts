import { z } from "zod";
import { ProductCategory, ProductType } from "@prisma/client";
export { ProductType } from "@prisma/client";

export type ProductSpecification = {
  type: ProductType;
  category: ProductCategory;
};

export function productTypeToString(productType: ProductType) {
  switch (productType) {
    case ProductType.CoffeeRobusta:
      return "Robusta";
    case ProductType.CoffeeArabica:
      return "Arábica";
  }
}

export function productCategoryToString(productCategory: ProductCategory) {
  switch (productCategory) {
    case ProductCategory.Pronto:
      return "Pronto";
    case ProductCategory.MercadoInterno:
      return "Mercado Interno";
    case ProductCategory.BicaCorrida:
      return "Bica Corrida";
  }
}

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
