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

interface Props extends ClassNameProps {
  title?: string;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export function ProductSearchColumn({
  title = "Escolher Produto",
  containerRef,
  className,
}: Props) {
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
    () => Object.values(productTypeFilter).every((value) => !value),
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
    <div
      className={cn("flex flex-col items-center", className)}
      ref={containerRef}
    >
      <div className="sticky top-0 z-10 w-full items-center">
        <div className="flex w-full justify-center bg-backgroundPrimary">
          <div className="w-full max-w-[36em] px-8 py-8">
            {title && <H3>{title}</H3>}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2" />{" "}
              <Input
                value={searchString}
                onChange={onInputChange}
                className="border-slate-400 pl-12 text-xl"
              />
            </div>
            <div className="mt-6 flex w-full gap-4">
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

      <div className="flex flex-col items-center gap-4 px-6 pb-20">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-full max-w-[28em] transition-transform duration-300 hover:scale-110 hover:bg-slate-100"
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
