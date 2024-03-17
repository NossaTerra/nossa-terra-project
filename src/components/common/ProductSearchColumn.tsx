import { SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { ProductCard } from "~/components/common/ProductCard";
import { Input } from "~/components/ui/input";
import { CheckboxProductType } from "~/components/ui/checkbox";
import { H3 } from "~/components/ui/typography";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { ProductType } from "@prisma/client";

export function ProductSearchColumn({ className }: ClassNameProps) {
  const router = useRouter();
  // TODO: maybe react to the loading state or make this query in server side rendering
  const { data: products } = api.product.getAll.useQuery();
  const [searchString, setSearchString] = useState("");
  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearchString(event.target.value);
    },
    [],
  );

  const [productTypeFilter, setProductTypeFilter] = useState<
    Record<ProductType, boolean>
  >({
    [ProductType.CoffeeArabica]: true,
    [ProductType.CoffeeRobusta]: true,
  });

  const noProductTypeFilterSelected = useMemo(
    () => { 
      return Object.values(productTypeFilter).every((value) => !value)},
    [productTypeFilter],
  );

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()),
      )
      .filter(
        (product) =>
          noProductTypeFilterSelected || productTypeFilter[product.type],
      );
  }, [noProductTypeFilterSelected, productTypeFilter, products, searchString]);

  return (
    <div className={cn("flex flex-col items-center  pr-8", className)}>
      <div className="sticky top-0 z-10 w-full items-center">
        <div className="flex w-full justify-center  bg-backgroundPrimary">
          <div className="w-full max-w-[36em] md:pr-8  pb-8 pt-2">
           <h1 className="text-2xl md:text-4xl ml-12 mb-6 md:mb-12 mt-4 font-bold">Pesquisa de anúncios</h1>
            <div className="ml-12 relative">
              <SearchIcon className="absolute left-3 top-2" />{" "}
              <Input
                value={searchString}
                onChange={onInputChange}
                className="border-slate-400pr-[2vw]  pl-12 text-xl"
              />
            </div>
            <div className="mt-6 pl-12 flex gap-3 md:gap-4">
              {Object.values(ProductType).map((productType) => (
                <CheckboxProductType
                  key={productType}
                  productType={productType}
                  checked={productTypeFilter[productType]}
                  onCheckedChange={(checked) =>
                    setProductTypeFilter((prev) => ({
                      ...prev,
                      [productType]: checked,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <div className="h-4 w-full bg-gradient-to-b from-backgroundPrimary to-transparent" />
      </div>

      <div className="flex pl-12 pr-8  w-full flex-col items-center gap-4 pb-20">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-full max-w-[28em] pr-8 md:max-w-[100vw] transition-transform duration-300 hover:scale-110 hover:bg-slate-100"
            role="button"
            onClick={() =>
              router.push(
                {
                  pathname: router.pathname,
                  query: { product: product.id },
                },
                undefined,
                { shallow: true },
              )
            }
          />
        ))}
      </div>
    </div>
  );
}