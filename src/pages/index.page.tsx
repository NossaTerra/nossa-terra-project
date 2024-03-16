import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import Image from "next/image";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import { useRouter } from "next/router";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { H1, H2 } from "~/components/ui/typography";
import { api } from "~/utils/api";
import { Separator } from "~/components/ui/separator";
import { ProductCard } from "~/components/common/ProductCard";
import { motion } from "framer-motion";

export const getServerSideProps = redirectGetServerSideProps.MaybeAuthed;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SearchScreen({ user }: Props) {
  const router = useRouter();
  const selectedProductId = router.query.product;

  return (
    <>
      <div className= {cn(
                "flex flex-row-reverse",
                 user?"mt-0":"mt-12"
              )}>
        <AppHeader user={user} hideLogo={!user} />

       {!user && <div className="w-full mt-2 px-10">
          <div className="flex flex-col items-center gap-8 px-8 sm:flex-row sm:gap-16 sm:px-16">
            <Image
              src="/images/logo-no-background.png"
              width={140}
              height={134}
              priority
              alt="Nossa terra logo"
            />
            <h1
              className={cn(
                "font-poppins-700 text-headingPrimary",
                "text-left",
                "text-xl md:text-2xl lg:text-3xl",
              )}
            >
              Seja bem vindo(a) à{" "}
              <span
                className={cn(
                  "font-poppins-700 text-headingSecondary",
                  "text-4xl md:text-5xl lg:text-6xl",
                  "inline",
                )}
              >
                Nossa Terra
              </span>
            </h1>
          </div>

        </div>}
      </div>
      <Separator className=  {cn(
                "w-full  mb-2.5  h-0.5 bg-headingSecondary",
                 user?"mt-0":"mt-20"
              )} />

      {/* <H2 className="px-8">Pesquisar Anúncios</H2> */}

      {/* WORKAROUND */}
      {/* The 99.5svw is a hack because the width of the window scrollbar messes up the width */}
      {/* The absolute somehow fixes the position sticky, that's why it exists */}
      <div className="relative bg-cardShade bg-opacity-60 flex w-[99.5svw] flex-row overflow-hidden lg:fixed">
        
        <ProductSearchColumn
          title=""
          className={cn(
            "sticky top-0 w-full pb-[170px] h-full lg:h-svh bg-white lg:w-[56em]  lg:overflow-y-auto",
             user?"scrollbar-webkit":"pb-[270px] scrollbar-webkit-big-margin",
            {
              "hidden lg:block": selectedProductId,
            },
          )}
        />
        <SelectedProductListingsColumn
          className={cn("px-10 sticky top-0 pb-[170px] lg:h-svh scrollbar-webkit lg:overflow-y-auto", user ? "scrollbar-webkit":"scrollbar-webkit-big-margin pb-[270px] ", {
            "hidden lg:block": !selectedProductId,
          })}
        />
      </div>
    </>
  );
}

function SelectedProductListingsColumn({ className }: ClassNameProps) {
  const router = useRouter();
  const selectedProductId = router.query.product;
  const { data: products } = api.product.getAll.useQuery();
  const product = products?.find((product) => product.id === selectedProductId);

  return (
    <div
      className={cn("sticky top-0 w-full", className)}
      // This resets scroll position on key change,
      // cus key changes forces React to rerender the component
      key={product?.id}
    >
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
          <div className="relative rounded-xl  p-8">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() =>
                router.replace(
                  {
                    pathname: router.pathname,
                    query: null,
                  },
                  undefined,
                  { shallow: true },
                )
              }
            >
              <XIcon />
            </Button>
            <div>
              {Array.from({ length: 933 }).map((_, index) => (
                <ProductCard product={product} className="mb-8" key={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
