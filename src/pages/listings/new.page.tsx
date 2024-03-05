import { zodResolver } from "@hookform/resolvers/zod";
import { type Product } from "@prisma/client";
import { ArrowLeftIcon, SearchIcon, XIcon } from "lucide-react";
import { type InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
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
import { H1, H3 } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { PriceTag } from "~/components/common/PriceTag";

export const getServerSideProps = redirectGetServerSideProps.BuyerOnly;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function NewListingScreen({ user }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (user.activeState !== "active") {
      void router.replace("/listings");
    }
  }, [user, router]);

  if (user.activeState !== "active") {
    return null;
  }

  return <ListingCreationFlow />;
}

function ListingCreationFlow() {
  const router = useRouter();
  const selectedProductId = router.query.product;

  return (
    <div className="h-svh overflow-auto">
      <div className="px-8">
        <Button className="mt-8 gap-3 p-6 text-lg" variant="outline" asChild>
          <Link href="/listings">
            <ArrowLeftIcon />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex flex-row">
        <ProductSearchColumn
          className={cn("w-full lg:w-[56em]", {
            "hidden lg:block": selectedProductId,
          })}
        />
        <ListingDetailsColumn
          className={cn(
            "px-10",
            {
              "": selectedProductId,
            },
            {
              "hidden lg:block": !selectedProductId,
            },
          )}
        />
      </div>
    </div>
  );
}

function ProductSearchColumn({ className }: ClassNameProps) {
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

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [products, searchString]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="sticky top-0 z-10 w-full items-center">
        <div className="flex w-full justify-center bg-backgroundPrimary">
          <div className="w-full max-w-[36em] px-8 py-8">
            <H3>Escolher Produto</H3>
            <div className="flex flex-row gap-4">
              <SearchIcon />{" "}
              <Input value={searchString} onChange={onInputChange} />
            </div>
          </div>
        </div>
        <div className="h-4 w-full bg-gradient-to-b from-backgroundPrimary to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-4 px-6">
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

function ListingDetailsColumn({ className }: ClassNameProps) {
  const router = useRouter();
  const selectedProductId = router.query.product;
  const { data: products } = api.product.getAll.useQuery();
  const product = products?.find((product) => product.id === selectedProductId);

  return (
    <div className={cn("sticky top-0 h-svh w-full", className)}>
      {!product && (
        <div className="flex h-full w-full">
          <div className="flex flex-row items-center gap-8 text-3xl">
            <ArrowLeftIcon size={30} />
            <h3 className="font-medium">Selecione um Produto</h3>
          </div>
        </div>
      )}

      {product && (
        <div className="mt-8">
          <H3>Novo Anúncio</H3>
          <div className="relative max-w-[68em] rounded-xl bg-cardShade p-8 shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              asChild
            >
              <Link href="">
                <XIcon />
              </Link>
            </Button>
            <EditListingForm product={product} />
          </div>
        </div>
      )}
    </div>
  );
}

function useEditListingSchema() {
  return useMemo(
    () =>
      z.object({
        price: z
          .string({ required_error: "Você deve inserir um preço" })
          .min(1, {
            message: "Você deve inserir um preço",
          })
          .transform(Number),
      }),
    [],
  );
}

type ListingData = z.infer<ReturnType<typeof useEditListingSchema>>;

function EditListingForm({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess?: (data: ListingData) => void;
}) {
  const schema = useEditListingSchema();
  const form = useForm<ListingData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ListingData> = useCallback(
    (data) => {
      console.log(data);
      onSuccess?.(data);
    },
    [onSuccess],
  );

  const price = Number(form.watch("price") ?? "0");

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
                    placeholder="Preço"
                    {...field}
                    type="number"
                    step={0.01}
                  />
                </FormControl>
                <FormDescription>
                  Preço por 60kg (saca) de produto
                </FormDescription>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button variant="primary" className="mt-8 w-full" type="submit">
            Confirmar
          </Button>
        </div>
      </form>
    </Form>
  );
}
