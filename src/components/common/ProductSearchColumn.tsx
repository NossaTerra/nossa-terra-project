import { SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { ProductCard } from "~/components/common/ProductCard";
import { Input } from "~/components/ui/input";
import { CheckboxProductType } from "~/components/ui/checkbox";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { ProductType } from "@prisma/client";
import { SearchSlider } from "../ui/slider";
import { biggestTwoPointsKmDistanceInBrazil } from "~/utils/constants";

const maxSliderValue = 200

export function ProductSearchColumn({
  className,
  title,
  showSlider = false,
  sliderInitialValue,
  onSliderValueChange,
}: ClassNameProps & {
  title: string;
  showSlider?: boolean;
  sliderInitialValue?: number;
  onSliderValueChange?:
    | (((value: number[]) => void) & ((value: number) => void))
    | undefined;
}) {
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

  const noProductTypeFilterSelected = useMemo(() => {
    return Object.values(productTypeFilter).every((value) => !value);
  }, [productTypeFilter]);

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

  const sliderDefaultValue = sliderInitialValue
    ? (sliderInitialValue / biggestTwoPointsKmDistanceInBrazil) * maxSliderValue
    : maxSliderValue;

  return (
    <div className={cn("flex flex-col items-center  pr-8", className)}>
      <div className="sticky top-0 z-10 w-full items-center">
        <div className="flex w-full justify-center  bg-backgroundPrimary">
          <div className="w-full max-w-[36em] pb-8  pt-2 md:pr-8">
            <h1 className="mb-6 ml-12 mt-4 text-2xl font-bold md:mb-12 md:text-4xl">
              {title}
            </h1>
            <div className="relative ml-12">
              <SearchIcon className="absolute left-3 top-2" />{" "}
              <Input
                value={searchString}
                onChange={onInputChange}
                className="border-slate-400pr-[2vw]  pl-12 text-xl"
              />
            </div>
            <div className="mt-6 flex gap-3 pl-12 md:gap-4">
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
            {showSlider && (
              <div className="ml-12 mt-4 flex items-center justify-center rounded-md px-2 pt-6">
                <SearchSlider
                  onValueChange={onSliderValueChange}
                  className="m-0 p-0"
                  defaultValue={[sliderDefaultValue]}
                  max={maxSliderValue}
                  step={1}
                />
              </div>
            )}
          </div>
        </div>
        <div className="h-4 w-full bg-gradient-to-b from-backgroundPrimary to-transparent" />
      </div>
      <div className="flex w-full flex-col  items-center gap-4 pb-20 pl-12 pr-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-full max-w-[28em] pr-8 transition-transform duration-300 hover:scale-110 hover:bg-slate-100 md:max-w-[100vw]"
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
