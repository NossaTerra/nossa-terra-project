import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import Image from "next/image";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import { useRouter } from "next/router";
import { ArrowLeftIcon, XIcon, ArrowUpIcon, MapPinIcon } from "lucide-react";
import { api } from "~/utils/api";
import { Card, CardContent } from "~/components/ui/card";
import { type Product } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { ProductCard } from "~/components/common/ProductCard";
import { Separator } from "~/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import { animateScrollToTop } from "~/utils/scroll";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { generateAvatarColor } from "~/utils/formHelpers";

export const getServerSideProps = redirectGetServerSideProps.MaybeAuthed;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SearchScreen({ user }: Props) {
  const router = useRouter();
  const selectedProductId = router.query.product;

  useEffect(() => {
    // This resets scroll position on selectedProductId change,
    // This is necessary because mobile users can see the top results on product change
    window.scrollTo(0, 0);
  }, [selectedProductId]);

  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowTopButton(scrollTop > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex flex-col-reverse md:flex-row-reverse",
          user
            ? "mt-0"
            : "overflow-hidden border-b-2 bg-cardHover bg-opacity-25 shadow  md:py-16",
        )}
      >
        <AppHeader
          className={cn("flex-col justify-center pb-4 pt-7")}
          user={user}
          hideLogo={!user}
        />

        {!user && (
          <div className="w-full px-10">
            <div className="flex flex-col items-center gap-8 px-8 pt-5 sm:flex-row sm:gap-16 md:pt-0">
              <Image
                src="/images/logo-no-background.png"
                width={104}
                height={104}
                priority
                alt="Nossa terra logo"
              />
              <h1
                className={cn(
                  "font-poppins-700 text-headingPrimary",
                  "text-justify md:text-left",
                  "text-xl md:text-2xl lg:text-3xl",
                )}
              >
                Seja bem vindo(a) à{" "}
                <span
                  className={cn(
                    "font-poppins-700 w-full text-headingSecondary",
                    "pl-3 text-3xl md:pl-0 md:text-5xl lg:text-6xl",
                    "block",
                  )}
                >
                  Nossa Terra
                </span>
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* <H2 className="px-8">Pesquisar Anúnciomt-2s</H2> */}

      {/* WORKAROUND */}
      {/* The 99.5svw is a hack because the width of the window scrollbar messes up the width */}
      {/* The absolute somehow fixes the position sticky, that's why it exists */}
      <div
        className={cn(
          "flex w-[99.5svw] flex-row overflow-hidden bg-opacity-60 lg:fixed",
          user ? "mt-0" : "mt-1.5",
        )}
      >
        <>
          {!selectedProductId && (
            <Button
              variant="ghost"
              className={`fixed bottom-4 right-2 z-10 rounded-full bg-slate-100 bg-opacity-100 p-2 ${
                showTopButton ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => {
                animateScrollToTop();
              }}
            >
              <ArrowUpIcon className="lg:hidden" size={22} />
              <span className="pr-2 lg:hidden">TOPO</span>
            </Button>
          )}

          <ProductSearchColumn
            title=""
            className={cn(
              "sticky top-0 h-full w-full bg-white lg:h-svh lg:overflow-y-auto lg:pb-[170px] xl:w-[56em]",
              user
                ? "lg:scrollbar-webkit"
                : "lg:pb-[270px] lg:scrollbar-webkit-big-margin",
              {
                "hidden xl:block": selectedProductId,
              },
            )}
          />
        </>
        <SelectedProductListingsColumn
          user={user}
          className={cn(
            "sticky top-0 px-3 pb-16 md:px-10 lg:h-svh lg:overflow-y-auto lg:pb-[170px] lg:scrollbar-webkit",
            user
              ? "lg:scrollbar-webkit"
              : "pb-16 lg:pb-[270px] lg:scrollbar-webkit-big-margin ",
            {
              "hidden xl:block": !selectedProductId,
            },
          )}
        />
      </div>
    </>
  );
}

function SelectedProductListingsColumn({
  className,
  user,
}: ClassNameProps & Props) {
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
        <div className="flex flex-col items-end">
          <Button
            variant="ghost"
            className="fixed bottom-4 z-10 rounded-full bg-slate-100 bg-opacity-100 p-2 lg:sticky lg:right-0 lg:top-2"
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
            <XIcon className="hidden lg:block" />
            <ArrowLeftIcon className="lg:hidden" size={22} />
            <span className="pr-2 lg:hidden">VOLTAR</span>
          </Button>
          <div className="relative w-full rounded-xl md:p-8">
            <div className="mb-6 ml-2 max-w-[890px] mr-2 mt-2 block rounded-lg bg-slate-100 p-4 lg:mr-8 ">
              <span className="font-poppins-600 mb-2 ml-2 text-xl lg:mb-0 lg:pb-4 lg:text-2xl">
                {" "}
                Resultados Para :
              </span>
              <span className="font-poppins-400 ml-2 mt-2 block pb-4 text-lg lg:text-xl">
                {product.name}
              </span>
            </div>
            <div>
              {Array.from({ length: 33 }).map((_, index) => (
                // <SearchResultCard product={product} className="mb-8" key={index} />
                <div className="mb-10 md:mr-7">
                  <SearchResultCard product={product} user={user} key={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ user, product }: Props & Product) {
  return (
    <div className="flex max-w-[900px] rounded-lg border-[2.3px] border-black md:justify-center md:px-0 ">
      <div className="relative w-full px-4 py-8">
        <div className="font-poppins-500 absolute top-3 w-32 rounded-md bg-slate-200 p-3 text-xl lg:right-3 ">
          R$ 109.09
        </div>
        <div className="mb-6 mt-12 flex w-full flex-col justify-between px-2 md:flex-row">
          <ProductCard
            topRightElement={"R$:100,09"}
            small
            product={product}
            className="xl:w-10em mb-8"
          />
          {!!user && <UserAnnouncementInfo user={user} />}
        </div>
        <div className="space-y-4">
          <Separator className="mb-4  w-full bg-black"></Separator>
          <span className="font-inter-500">
            Outros anúncios desse comprador...
          </span>
          <div className="items-around flex flex-row flex-wrap ">
            {Array.from({ length: 3 }).map(() => (
              <div className="mr-2 max-w-[140px] md:max-w-[170px] ">
                <Card className="mb-3 mr-1 border-2 border-headingSecondary bg-slate-50 md:mr-3 md:border-4">
                  <CardContent className="text-md font-inter-500 flex h-full flex-col justify-center py-2 text-headingSecondary">
                    <p>R$ 910.00</p>
                    <p>catação 25% 18/17</p>
                    <p></p>
                  </CardContent>
                </Card>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserAnnouncementInfo({ user }: Props) {
  const commonPhones = useMemo(() => {
    const phones: string[] = [];

    if (user?.phoneUsesWhatsapp === false) {
      phones.push(user.phone);
    }
    if (user.secondaryPhone && user?.secondaryPhoneUsesWhatsapp === false) {
      phones.push(user.secondaryPhone);
    }

    return phones;
  }, [
    user?.phone,
    user?.phoneUsesWhatsapp,
    user?.secondaryPhone,
    user?.secondaryPhoneUsesWhatsapp,
  ]);

  const whatsAppPhones = useMemo(() => {
    const phones: string[] = [];

    if (user?.phoneUsesWhatsapp) {
      phones.push(user?.phone);
    }
    if (user.secondaryPhone && user?.secondaryPhoneUsesWhatsapp) {
      phones.push(user.secondaryPhone);
    }

    return phones;
  }, [
    user?.phone,
    user?.phoneUsesWhatsapp,
    user?.secondaryPhone,
    user?.secondaryPhoneUsesWhatsapp,
  ]);

  const openWhatsApp = (phoneNumber: string | undefined) => {
    const url = `https://wa.me/55${+phoneNumber.replace(/[\s()-]/g, "")}`;
    if (!!phoneNumber) {
      window.open(url, "_blank");
    }
  };

  const openPhoneApp = (phoneNumber: string | undefined) => {
    if (!phoneNumber) return;
    const cleanedPhoneNumber = phoneNumber.replace(/[\s()-]/g, "");
    const url = `tel:${cleanedPhoneNumber}`;
    window.open(url, "_blank");
  };

  return (
    <div className="md:max-w-2xl">
      <div className="rounded-lg ">
        <div className="flex space-x-4 ">
          <div className="flex flex-col gap-2  capitalize md:pl-10">
            <span className=" text-lg font-bold">{user.name}</span>
            <div className="flex">
              <MapPinIcon className="ml-1 mr-1 h-5 w-5 text-current md:ml-0" />
              <span className="ml-1.5 w-36 text-sm text-gray-500">
                {user?.city} - {user?.province}{" "}
              </span>
            </div>
            {user?.instagram && (
              <div className="ml-0.5 mt-0.5 flex items-start justify-start md:ml-0 ">
                <Image
                  priority
                  src="/images/icons/instagram-app-icon.svg"
                  height={17}
                  width={17}
                  className="ml-1 pt-0.5 md:ml-0.5"
                  alt="Instagram Icon"
                />
                <div className="ml-3 flex flex-col items-start">
                  <span className="w-38 mb-1 break-all text-sm">
                    {user.instagram}
                  </span>
                </div>
              </div>
            )}
            {whatsAppPhones.length > 0 && (
              <div className="mr-9 flex items-start justify-center">
                <Image
                  priority
                  className="cursor-pointer"
                  src="/images/icons/whatsapp-icon.svg"
                  height={22}
                  onClick={() => {
                    openWhatsApp(whatsAppPhones?.[0]);
                  }}
                  width={22}
                  alt="Phone Icon"
                />
                <div className="ml-2 flex flex-col">
                  {whatsAppPhones.map((phone, index) => (
                    <button
                      onClick={() => {
                        openWhatsApp(phone);
                      }}
                      key={index}
                      className="cursor-pointer text-sm"
                    >
                      {phone}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {commonPhones.length > 0 && (
              <div className="mr-8 mt-[5px] flex items-start justify-center">
                <Image
                  priority
                  src="/images/icons/phone-icon.svg"
                  height={20}
                  width={20}
                  className="cursor-pointer"
                  onClick={() => {
                    openPhoneApp(commonPhones?.[0]);
                  }}
                  alt="Phone Icon"
                />
                <div className="ml-3 flex flex-col">
                  {commonPhones.map((phone, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        openPhoneApp(phone);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      {phone}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Avatar className="mt-5 flex">
            <AvatarImage
              className="flex h-32 w-32 aspect-[1/1] items-center justify-center rounded-full border border-slate-200 object-cover"
              src={user.avatarImage}
            />
            <AvatarFallback
              style={{ backgroundColor: `${generateAvatarColor(user.name)}` }}
              className={`flex w-auto items-center justify-center rounded-full border border-slate-200 object-cover lg:h-auto lg:w-auto `}
            >
              <span className={`font-poppins-700 text-2xl text-white`}>
                {user.name?.substring(0, 2).toLocaleUpperCase()}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
