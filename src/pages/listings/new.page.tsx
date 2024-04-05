import { ArrowLeftIcon, XIcon } from "lucide-react";
import { type InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { H3 } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { api } from "~/utils/api";
import { cn, type ClassNameProps } from "~/utils/ui";
import { EditListingForm, type ListingFormData } from "./EditListingForm";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import toast from "react-hot-toast";

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
    <div className="h-dvh overflow-auto">
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
          title="Pesquisa de Produtos"
          className={cn("w-full lg:w-[56em]", {
            "hidden lg:block": selectedProductId,
          })}
        />
        <ListingDetailsColumn
          className={cn("px-10", {
            "hidden lg:block": !selectedProductId,
          })}
        />
      </div>
    </div>
  );
}

function ListingDetailsColumn({ className }: ClassNameProps) {
  const router = useRouter();
  const selectedProductId = router.query.product;
  const { data: products } = api.product.getAll.useQuery(undefined, {
    onError: () => {
      toast.error("Erro ao Buscar produtos");
    },
  });
  const product = products?.find((product) => product.id === selectedProductId);

  const apiUtils = api.useUtils();
  const createListing = api.listing.createListing.useMutation({
    onSuccess() {
      void apiUtils.listing.getMyListings.invalidate();
    },
    onError: () => {
      toast.error("Erro ao Criar Anúncio, tente novamente mais tarde");
    },
  });

  const onNewListingFormSubmit = useCallback(
    async (data: ListingFormData) => {
      if (!product) {
        return;
      }
      try {
        await createListing.mutateAsync({
          price: data.price,
          productId: product.id,
        });
        await router.push("/listings");
      } catch {
        console.log("Error while creating listing ");
      }
    },
    [createListing, product, router],
  );

  return (
    <div className={cn("sticky top-0 h-dvh w-full", className)}>
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
              isLoading={createListing.isLoading}
              product={product}
              onSuccess={onNewListingFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
