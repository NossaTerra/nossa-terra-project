import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import Image from "next/image";
import Link from "next/link";
import { H1, H2, P } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { Button, linkClassNames } from "~/components/ui/button";
import { type ClassNameProps, cn } from "~/utils/ui";
import { api } from "~/utils/api";
import { PlusIcon } from "lucide-react";
import { getProductImageSrc } from "~/server/types/product.type";
import { ListingCard } from "./ListingCard";
import { ProductType } from "@prisma/client";
import MyListingsCardShimmer from "./MyListingsCardShimmer";

export const getServerSideProps = redirectGetServerSideProps.BuyerOnly;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function MyListingsScreen({ user }: Props) {
  if (user.activeState !== "active") {
    return (
      <div className="flex h-fit min-h-dvh flex-1 flex-col">
        <div className="z-10">
          <AppHeader user={user} />
          {user.activeState === "inactive" && (
            <PendingActivationMessage className="px-16" />
          )}
          {user.activeState === "inactive_payment_problem" && (
            <InactivePaymentMessage className="px-16" />
          )}
        </div>

        <ImageBackgroundFooter src="/images/coffee-envelop-transparent.png" />
      </div>
    );
  }

  return (
    <div>
      <AppHeader user={user} />
      <div className="px-10 pb-16">
        <h1 className="my-12 text-2xl font-bold md:text-4xl">Meus Anúncios</h1>
        <MyListingsDashboard className="mt-5" />
      </div>
    </div>
  );
}

// NOTE: Possible optimization to reduce image sizes.
// Serve a JPG with a circular gradient mask (which could be from a file or made programatically via "CSS").
function ImageBackgroundFooter({ src }: { src: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none z-0 -mt-[30vw] flex min-h-[70vh] flex-1 flex-col items-end justify-end overflow-hidden",
      )}
    >
      <div className="relative -mb-32 flex h-full max-h-[70vh] w-full flex-1">
        <Image
          src={src}
          objectFit="contain"
          objectPosition="right 0% bottom 50%"
          alt="Imagem de fundo"
          fill
        />
      </div>
    </div>
  );
}

function PendingActivationMessage({ className }: ClassNameProps) {
  return (
    <div className={cn("w-fit", className)}>
      <H1>Aguardando Aprovação</H1>
      <div className="max-w-3xl">
        <P className="md:text-lg lg:text-xl">
          Para que possa fazer seus anúncios, seu cadastro está em análise pelo
          nosso time. Esse processo pode levar até{" "}
          <span className="font-bold">2 dias</span> úteis.
        </P>
        <P className="md:text-lg lg:text-xl">
          Se tiver alguma dúvida ou precisar de ajuda durante esse período,
          fique à vontade para
          <Link href="/contact" className={cn(linkClassNames, "px-1")}>
            entrar em contato
          </Link>
        </P>
        <P className="md:text-lg lg:text-xl">Estamos aqui para ajudar!</P>
      </div>
    </div>
  );
}

function InactivePaymentMessage({ className }: ClassNameProps) {
  return (
    <div className={cn("w-fit", className)}>
      <H1>Atualização de Pagamento Necessária</H1>
      <div className="max-w-3xl">
        <P className="md:text-lg lg:text-xl">
          Seu último pagamento não foi processado e seus anúncios foram pausados
          temporariamente. Atualize suas informações de pagamento para retomar
          os seus anúncios.
        </P>
        <P className="md:text-lg lg:text-xl">
          Para ajuda ou mais informações{" "}
          <Link href="/contact" className={cn(linkClassNames, "px-1")}>
            entre em contato
          </Link>
        </P>
        <P className="md:text-lg lg:text-xl">Estamos aqui para ajudar!</P>
      </div>
    </div>
  );
}

function MyListingsDashboard({ className }: ClassNameProps) {
  const { data: myListings, isLoading } = api.listing.getMyListings.useQuery();

  if (!isLoading && !myListings?.length) {
    return (
      <>
        <FreeListingsBanner />
        <EmptyStateNoListings className={className} />
      </>
    );
  }

  return (
    <div className={className}>
      <FreeListingsBanner />
      <Button asChild variant="primary">
        <Link href="/listings/new" className="flex items-center gap-2">
          <PlusIcon size={20} /> Novo Anúncio
        </Link>
      </Button>
      {!isLoading && (
        <div className="mt-8 flex flex-wrap gap-8">
          {myListings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="mt-4 flex w-full flex-row flex-wrap gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MyListingsCardShimmer key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyStateNoListings({ className }: ClassNameProps) {
  return (
    <div
      className={cn(
        "bg-background relative flex min-h-40 max-w-[40em] overflow-hidden rounded-lg border-[2.5px] border-gray-800 p-6 shadow-xl",
        className,
      )}
    >
      <div className="absolute -bottom-4 -left-5 opacity-60">
        {Array.from({ length: 4 }).map((_, i) => {
          const product =
            Object.values(ProductType)[i % Object.values(ProductType).length];

          if (!product) {
            return null;
          }

          return (
            <Image
              priority
              src={getProductImageSrc(product)}
              height={90}
              width={90}
              alt=""
            />
          );
        })}
      </div>

      <div className="flex flex-1 flex-col justify-between pl-16 md:pl-20">
        <H2 className="py-4 font-medium ">Crie aqui seu primeiro anúncio</H2>

        <Button
          asChild
          variant="primary"
          size="lg"
          className=" text-md mb-4 mt-4 px-4 md:px-6 md:text-xl"
        >
          <Link href="/listings/new" className="flex w-fit items-center gap-2">
            <PlusIcon size={20} /> Novo Anúncio
          </Link>
        </Button>
      </div>
    </div>
  );
}

function FreeListingsBanner() {
  return (
    <div>
      <div className="font-poppins-400 mb-4 inline-block rounded-md bg-slate-100 px-4 py-4 md:mb-6">
        <span className="mb-2 block font-semibold">
          Aproveite seus anúncios são gratuitos durante os primeiros meses!
        </span>
        <span>Em breve, uma pequena taxa mensal será aplicada.</span>
      </div>
    </div>
  );
}
