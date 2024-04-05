import { zodResolver } from "@hookform/resolvers/zod";
import { type Product } from "@prisma/client";
import { useCallback, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { PriceTag, formatCurrencyReais } from "~/components/common/PriceTag";
import { ProductCard } from "~/components/common/ProductCard";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getNumberFromCurrencyReais } from "~/components/ui/input/masks/currency";
import { H3 } from "~/components/ui/typography";
import { type MyListing } from "~/utils/api";
import { cn } from "~/utils/ui";

function useEditListingSchema() {
  return useMemo(
    () =>
      z.object({
        price: z
          .string({ required_error: "Você deve inserir um preço" })
          .refine(
            (inputValue) => {
              const price = getNumberFromCurrencyReais(inputValue);
              return price !== 0 && !isNaN(price);
            },
            {
              message: "Você deve inserir um preço",
            },
          )
          .transform(getNumberFromCurrencyReais),
      }),
    [],
  );
}

export type ListingFormData = z.infer<ReturnType<typeof useEditListingSchema>>;

export function EditListingForm({
  isLoading,
  listing,
  product,
  onSuccess,
}: {
  isLoading: boolean;
  listing?: MyListing;
  product: Product;
  onSuccess?: (data: ListingFormData) => void;
}) {
  const schema = useEditListingSchema();
  const form = useForm<ListingFormData>({
    resolver: zodResolver(schema),
    defaultValues: listing
      ? {
        ...listing,
        price: `R$ ${formatCurrencyReais(
          Number(listing.price),
        )}` as unknown as number,
      }
      : undefined,
  });

  const onSubmit: SubmitHandler<ListingFormData> = useCallback(
    (data) => {
      onSuccess?.(data);
    },
    [onSuccess],
  );

  const price = getNumberFromCurrencyReais(
    (form.watch("price") ?? "") as unknown as string,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-wrap gap-10"
      >
        <div className="w-full max-w-[28em]">
          <H3 className="p-0 pb-8">Produto</H3>
          <ProductCard
            key={product.id}
            product={product}
            className="mb-8 w-full"
            footer={
              <PriceTag
                value={price}
                className={cn("mt-4", { "opacity-70": price === 0 })}
              />
            }
          />
        </div>

        <div className="w-full max-w-[28em]">
          <FormField
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <FormItem className="text-gray-700">
                <FormLabel className="block" htmlFor="price">
                  <H3 className="p-0 pb-8">Preço</H3>
                </FormLabel>
                <FormControl>
                  <Input
                    maskPreset="CurrencyReais"
                    placeholder="Preço"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Preço por 60kg (saca) de produto
                </FormDescription>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button
            disabled={!form.formState.isDirty}
            isLoading={isLoading}
            variant="primary"
            className="mt-8 w-full"
            type="submit"
          >
            Confirmar
          </Button>
        </div>
      </form>
    </Form>
  );
}
