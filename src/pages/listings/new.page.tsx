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
import { ProductCard } from "~/components/common/ProductCard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { H3 } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { EditListingForm, type ListingFormData } from "./EditListingForm";

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

  const apiUtils = api.useUtils();
  const createListing = api.listing.createListing.useMutation({
    onSuccess() {
      void apiUtils.listing.getMyListings.invalidate();
    },
  });

  const onNewListingFormSubmit = useCallback(
    async (data: ListingFormData) => {
      if (!product) {
        return;
      }
      await createListing.mutateAsync({
        price: data.price,
        productId: product.id,
      });
      await router.push("/listings");
    },
    [createListing, product, router],
  );

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
            <EditListingForm
              product={product}
              onSuccess={onNewListingFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
