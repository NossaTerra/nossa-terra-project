import {
  BoxesIcon,
  CheckIcon,
  MapPinIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { ProductCard } from "~/components/common/ProductCard";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { ProductType, ProductCategory } from "@prisma/client";
import { SearchSlider } from "../ui/slider";
import ProductSearchShimmer from "~/components/common/ProductSearchShimmer";
import toast from "react-hot-toast";
import { RadioGroup } from "~/components/ui/radio-group";
import { RadioGroupItem as RadixRadioGroupItem } from "@radix-ui/react-radio-group";
import {
  productTypeToString,
  productCategoryToString,
  getProductImageSrc,
  type ProductSpecification,
} from "~/server/types/product.type";
import Image from "next/image";
import { Button } from "../ui/button";

export function ProductSearchColumn({
  className,
  title,
  showSlider = false,
  stickyHeader = false,
}: ClassNameProps & {
  title: string;
  showSlider?: boolean;
  stickyHeader?: boolean;
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

  const [filterOption, setFilterOption] = useState<
    ProductSpecification | undefined
  >(undefined);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()),
      )
      .filter((product) => {
        if (!filterOption) return true;
        return (
          product.type === filterOption.type &&
          product.category === filterOption.category
        );
      });
  }, [filterOption, products, searchString]);

  const resetFilters = useCallback(() => setFilterOption(undefined), []);

  const shouldShowEmptyState = filteredProducts.length === 0 && !isLoading;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn("w-full items-center", {
          "sticky top-0 z-10": stickyHeader,
        })}
      >
        <div className="flex w-full justify-center bg-backgroundPrimary p-8">
          <div className="w-full max-w-[36em] pb-2">
            <h1 className="mb-6 text-2xl font-bold md:text-4xl">{title}</h1>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2" />
              <Input
                value={searchString}
                onChange={onInputChange}
                className="border-slate-400 pl-12 text-xl"
              />
            </div>

            <div className="flex flex-col gap-5 pt-8">
              <div className="font-inter-400 flex flex-row items-center gap-3 text-xl">
                <BoxesIcon /> Tipos de Café
                <Button
                  onClick={resetFilters}
                  disabled={!filterOption}
                  className={cn(
                    "ml-8",
                    "border-2 border-slate-300 bg-transparent text-slate-800 hover:bg-slate-400",
                    {
                      invisible: filterOption === undefined,
                    },
                  )}
                >
                  <RotateCcwIcon className="size-5" />
                  Limpar Filtro
                </Button>
              </div>
              <ProductSpecificationChooser
                selectedValue={filterOption}
                onChange={setFilterOption}
              />
            </div>

            {showSlider && (
              <div className="flex flex-col gap-1 pt-8">
                <div className="font-inter-400 flex flex-row items-center gap-3 text-xl">
                  <MapPinIcon /> Distância
                </div>
                <SearchSlider className="m-0 p-0" step={1} />
              </div>
            )}
          </div>
        </div>
        <div className="h-4 w-full bg-gradient-to-b from-backgroundPrimary to-transparent" />
      </div>
      <div className="flex w-full flex-col items-center gap-4 px-8 pb-20">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <ProductSearchShimmer key={index} />
          ))}
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-full max-w-[36em] transition-transform duration-300 hover:scale-110 hover:bg-slate-100"
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

function id(productSpecification: ProductSpecification) {
  return `${productSpecification.type};${productSpecification.category}`;
}
function parseId(id: string): ProductSpecification {
  const [typeStr, categoryStr] = id.split(";");
  return {
    type: typeStr as ProductType,
    category: categoryStr as ProductCategory,
  };
}

export function ProductSpecificationChooser({
  selectedValue,
  onChange,
}: {
  selectedValue?: ProductSpecification;
  onChange: (newValue: ProductSpecification) => void;
}) {
  const onRadioChange = useCallback(
    (id: string) => {
      onChange(parseId(id));
    },
    [onChange],
  );

  return (
    <RadioGroup
      value={selectedValue ? id(selectedValue) : ""}
      onValueChange={onRadioChange}
      className="flex w-full flex-col gap-4"
    >
      {Object.values(ProductType).map((pType) => (
        <div key={pType} className="flex w-full flex-row flex-wrap gap-4">
          {Object.values(ProductCategory).map((pCategory) => (
            <ProductSpecificationRadioCard
              key={id({ type: pType, category: pCategory })}
              selectedValue={selectedValue}
              productSpecification={{ type: pType, category: pCategory }}
            />
          ))}
        </div>
      ))}
    </RadioGroup>
  );
}

function ProductSpecificationRadioCard({
  selectedValue,
  productSpecification,
}: {
  selectedValue?: ProductSpecification;
  productSpecification: ProductSpecification;
}) {
  const isSelected =
    selectedValue?.type === productSpecification.type &&
    selectedValue?.category === productSpecification.category;

  return (
    <RadixRadioGroupItem
      value={id(productSpecification)}
      className={cn(
        "peer relative min-w-32 shrink-0 overflow-hidden rounded-lg border-4 border-neutral-200 bg-cardShade p-3 py-4 pr-6 shadow-xl ring-offset-white transition-all hover:scale-105 hover:bg-cardHover",
        {
          "scale-110 border-basedDark shadow-black/50 hover:scale-110":
            isSelected,
        },
      )}
    >
      <div
        className={cn(
          "absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-basedDark p-1 text-cardShade",
          {
            hidden: !isSelected,
          },
        )}
      >
        <CheckIcon />
      </div>

      <div className="flex flex-col items-start justify-start">
        <span className="font-poppins-600 text-sm">
          {productCategoryToString(productSpecification.category)}
        </span>
        <span className="font-poppins-300 text-xs italic">
          {productTypeToString(productSpecification.type)}
        </span>
      </div>

      <Image
        priority
        src={getProductImageSrc(productSpecification.type)}
        height={42}
        width={42}
        alt=""
        className="absolute -bottom-2 -right-2 opacity-90"
      />
    </RadixRadioGroupItem>
  );
}
