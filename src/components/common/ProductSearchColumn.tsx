import { CheckIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { ProductCard } from "~/components/common/ProductCard";
import { Input } from "~/components/ui/input";
import { CheckboxProductType } from "~/components/ui/checkbox";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { type ProductType, type Role } from "@prisma/client";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItem as RadixRadioGroupItem,
} from "@radix-ui/react-radio-group";
import { SearchSlider } from "../ui/slider";
import ProductSearchShimmer from "~/components/common/ProductSearchShimmer";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ProductTypeLabel } from "~/server/types/product.type";

type ExtendedProductType = ProductType | "Todos";

export function ProductSearchColumn({
  className,
  title,
  showSlider = false,
}: ClassNameProps & {
  title: string;
  showSlider?: boolean;
}) {
  const router = useRouter();
  // TODO: maybe react to the loading state or make this query in server side rendering
  const { data: products, isLoading } = api.product.getAll.useQuery(undefined, {
    onError: () => {
      toast.error("Erro ao Buscar produtos");
    },
  });
  const [searchString, setSearchString] = useState("");
  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearchString(event.target.value);
    },
    [],
  );

  const [selectedProductType, setSelectedProductType] = useState<
    ProductType | undefined
  >(undefined);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()) &&
        (selectedProductType === null || product.type === selectedProductType),
    );
  }, [products, searchString, selectedProductType]);

  const shouldShowEmptyState = filteredProducts.length === 0 && !isLoading;

  return (
    <div className={cn("flex flex-col items-center", className)}>
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
                className="mr-4 border-slate-400 pl-12 pr-[2vw] text-xl md:mr-3"
              />
            </div>
            <div className="mt-6 flex gap-3 pl-12 md:gap-4">
              <RadioGroup
                value={selectedProductType}
                onValueChange={setSelectedProductType}
                className="flex w-full flex-row flex-wrap gap-8 pb-16 pt-2"
              >
                {Object.entries(ProductTypeLabel).map(([type, label]) => (
                  <RadioGroupItem
                    key={type}
                    value={type}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      className="radio-button"
                      checked={selectedProductType === type}
                      onChange={() => setSelectedProductType(type)}
                    />
                    <label>{label}</label>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>
            {showSlider && (
              <div className="ml-12 mt-4 flex items-center justify-center rounded-md pl-2 pr-4 pt-6 md:pr-2">
                <SearchSlider className="m-0 p-0" step={1} />
              </div>
            )}
          </div>
        </div>
        <div className="h-4 w-full bg-gradient-to-b from-backgroundPrimary to-transparent" />
      </div>
      <div className="flex w-full flex-col  items-center gap-4 pb-20 pl-12 pr-8">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <ProductSearchShimmer key={index} />
          ))}
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
        {shouldShowEmptyState && (
          <span className="font-poppins-600 text-md  mb-2 ml-2 block lg:mb-0 lg:pb-4 lg:text-xl">
            Não existem produtos que correspondem ao texto buscado
          </span>
        )}
      </div>
    </div>
  );
}

function ProducRadioGroupItem({
  isSelected,
  productType,
  title,
}: {
  isSelected?: boolean;
  productType: ProductType;
  title: string;
}) {
  return (
    <>
      <RadixRadioGroupItem
        value={productType}
        className={cn("h-16 rounded-lg border-4 border-transparent", {
          "border-basedDark": isSelected,
        })}
      >
        <Card className="relative h-full min-h-8  bg-cardShade p-4 text-left shadow-lg">
          <div
            className={cn(
              "absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-basedDark p-1 text-cardShade",
              {
                hidden: !isSelected,
              },
            )}
          >
            <CheckIcon />
          </div>
          <CardHeader className="p-0">
            <CardTitle className="pb-2 text-lg">{title}</CardTitle>
          </CardHeader>
        </Card>
      </RadixRadioGroupItem>
    </>
  );
}
