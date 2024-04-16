import { CheckIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { ProductCard } from "~/components/common/ProductCard";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { ProductType } from "@prisma/client";
import { SearchSlider } from "../ui/slider";
import ProductSearchShimmer from "~/components/common/ProductSearchShimmer";
import toast from "react-hot-toast";
import { RadioGroup } from "~/components/ui/radio-group";
import { RadioGroupItem as RadixRadioGroupItem } from "@radix-ui/react-radio-group";
import {
  ProductTypeLabel,
  getProductImageSrc,
} from "~/server/types/product.type";
import Image from "next/image";

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

  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()),
      )
      .filter((product) => {
        if (filterOption === "all") return true;
        return product.type === filterOption;
      });
  }, [filterOption, products, searchString]);

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
            <div className="ml-12 mt-10 flex gap-3 md:gap-4">
              <SearchFilters
                selectedValue={filterOption}
                onChange={setFilterOption}
              />
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

const filterOptions = [
  ProductType.CoffeeRobusta,
  ProductType.CoffeeArabica,
  "all",
] as const;

type FilterOption = (typeof filterOptions)[number];

function SearchFilters({
  selectedValue,
  onChange,
}: {
  selectedValue: FilterOption;
  onChange: (newFilter: FilterOption) => void;
}) {
  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={onChange}
      className="flex w-full flex-row flex-wrap gap-2"
    >
      <FilterCardRadioItem
        filterOption="all"
        isSelected={selectedValue === "all"}
        label="Todos"
      />
      <FilterCardRadioItem
        filterOption={ProductType.CoffeeArabica}
        isSelected={selectedValue === ProductType.CoffeeArabica}
        label={ProductTypeLabel[ProductType.CoffeeArabica]}
      />
      <FilterCardRadioItem
        filterOption={ProductType.CoffeeRobusta}
        isSelected={selectedValue === ProductType.CoffeeRobusta}
        label={ProductTypeLabel[ProductType.CoffeeRobusta]}
      />
    </RadioGroup>
  );
}

function FilterCardRadioItem({
  isSelected,
  filterOption,
  label,
}: {
  isSelected: boolean;
  filterOption: FilterOption;
  label: string;
}) {
  return (
    <RadixRadioGroupItem
      value={filterOption}
      className={cn(
        "peer relative shrink-0 overflow-hidden rounded-lg border-4 border-neutral-200 bg-cardShade p-3 py-4 pr-11 shadow-xl ring-offset-white transition-all hover:scale-105 hover:bg-cardHover",
        {
          "border-basedDark": isSelected,
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

      <span className="font-poppins-500">{label}</span>

      {filterOption !== "all" && (
        <Image
          priority
          src={getProductImageSrc(filterOption)}
          height={50}
          width={50}
          alt=""
          className="absolute -bottom-2 -right-2 opacity-90"
        />
      )}

      {filterOption === "all" && (
        <>
          <Image
            priority
            src={getProductImageSrc(ProductType.CoffeeRobusta)}
            height={40}
            width={40}
            alt=""
            className="absolute -bottom-4 right-4 rotate-[30deg] opacity-90"
          />
          <Image
            priority
            src={getProductImageSrc(ProductType.CoffeeArabica)}
            height={40}
            width={40}
            alt=""
            className="absolute -bottom-1 -right-2 opacity-90"
          />
        </>
      )}
    </RadixRadioGroupItem>
  );
}
