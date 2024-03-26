import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import Image from "next/image";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  XIcon,
  ArrowUpIcon,
  MapPinIcon,
  TimerIcon,
} from "lucide-react";
import { type SearchResult, api } from "~/utils/api";
import { Card, CardContent } from "~/components/ui/card";
import { type User, type Product } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { ProductCard } from "~/components/common/ProductCard";
import { Separator } from "~/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { animateScrollToTop } from "~/utils/scroll";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { generateAvatarColor } from "~/utils/formHelpers";
import { getDisplayTimeWithAgo } from "~/utils/time";
import { PriceTag } from "~/components/common/PriceTag";
import BounceLoader from "react-spinners/BounceLoader";
import SearchCardShimmer from "./search/SearchCardShimmer";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import Link from "next/link";
import toast from "react-hot-toast";

const pageLimit = 10;

export const getServerSideProps = redirectGetServerSideProps.MaybeAuthed;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

function useSearchScreenParams() {
  const router = useRouter();
  const selectedProductId = Array.isArray(router.query.product)
    ? router.query.product[0]
    : router.query.product;
  const distanceQueryParam = Array.isArray(router.query.distance)
    ? router.query.distance[0]
    : router.query.distance;

  return {
    selectedProductId,
    distanceQueryParam,
  };
}

export default function SearchScreen({ user }: Props) {
  const { selectedProductId, distanceQueryParam } = useSearchScreenParams();

  // NOTE: Query params already have a natural debounce / delay to rerender
  // the route components
  //
  // if you useEffect and console log a query param you'll notice that
  const debouncedDistanceFilter = useDebouncedValue({
    value:
      distanceQueryParam !== undefined
        ? parseFloat(distanceQueryParam)
        : undefined,
  });

  const { data, error, fetchNextPage, isFetching, hasNextPage, isLoading } =
    api.search.getProductListings.useInfiniteQuery(
      {
        productId: selectedProductId,
        searchingUserLatitude: user?.latitude ?? null,
        searchingUserLongitude: user?.longitude ?? null,
        distanceFilter: debouncedDistanceFilter,
        limit: pageLimit,
      },
      {
        refetchOnMount: false,
        getNextPageParam: (lastPage) => {
          if (lastPage?.nextCursor) {
            return lastPage.nextCursor;
          } else {
            return undefined;
          }
        },
        onSuccess: (data) => {
          /* if there is a distance filter applied
              it should always try to show the limit value per batch   
              this avoids states where there is no scroll bar but there 
              are more results to be returned and also keeps the number of
              shown results consistent if possible
           */
          if (!data.pages[data.pages?.length - 1]?.nextCursor) {
            return;
          }
          const searchResults =
            data?.pages
              .flatMap((page) => page?.searchResults ?? [])
              .filter((result) => result !== undefined) ?? [];

          if (
            data?.pages &&
            searchResults &&
            searchResults.length < data?.pages?.length * pageLimit
          ) {
            void fetchNextPage();
          }
        },
        onError: () => {
          toast.error("Erro ao Buscar anúncios");
        },
      },
    );

  const searchResults =
    data?.pages
      .flatMap((page) => page?.searchResults ?? [])
      .filter((result) => result !== undefined) ?? [];

  useEffect(() => {
    // This resets scroll position on selectedProductId change,
    // This is necessary because mobile users can see the top results on product change
    window.scrollTo(0, 0);
  }, [selectedProductId]);

  const [showTopButton, setShowTopButton] = useState(false);

  /*Small screens just use the default scroll mechanism this useEffect adds
    scroll event listener for those screens to either show the top button so
    that users can easily scroll to the top of the page and also the event listener
    handles pagination logic for endless scrolling on small devices
  */
  useEffect(() => {
    const handleScroll = () => {
      //logic to show the top button on small screens
      const scrollTop = window.scrollY;
      setShowTopButton(scrollTop > 100);
      //logic to do Pagination on Small screens
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const scrolled = (winScroll / height) * 100;
      if (scrolled > 80 && hasNextPage && !isFetching) {
        void fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  return (
    <div className="flex grow flex-col lg:max-h-svh">
      <div
        className={cn("flex flex-col-reverse md:flex-row-reverse", {
          "border-b-2 bg-cardHover bg-opacity-25 shadow md:py-8": !user,
        })}
      >
        <AppHeader
          className="flex-col justify-center"
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
      <div
        className={cn(
          "flex grow flex-row overflow-hidden bg-opacity-60",
          user ? "mt-0" : "mt-1.5",
        )}
      >
        <>
          {!selectedProductId && (
            <Button
              variant="ghost"
              className={cn(
                "fixed bottom-4 right-2 z-10 rounded-full bg-slate-100 bg-opacity-100 p-2 ",
                showTopButton ? "opacity-100" : "opacity-0",
              )}
              onClick={() => {
                animateScrollToTop();
              }}
            >
              <ArrowUpIcon className="lg:hidden" size={22} />
              <span className="pr-2 lg:hidden">TOPO</span>
            </Button>
          )}

          <ProductSearchColumn
            title="Pesquisa de Anúnicios"
            showSlider={!!user && !!user?.latitude && !!user?.longitude}
            className={cn(
              "flex w-full grow lg:overflow-y-auto lg:pr-8 lg:scrollbar-webkit xl:w-[58em]",
              {
                "hidden xl:block": selectedProductId,
              },
            )}
          />
        </>
        <SelectedProductListingsColumn
          searchResults={searchResults}
          isFetching={isFetching}
          error={!!error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          user={user}
          className={cn(
            "grow px-3 pb-16 md:px-10 lg:overflow-y-auto lg:scrollbar-webkit",
            {
              "hidden xl:block": !selectedProductId,
            },
          )}
        />
      </div>
    </div>
  );
}

function SelectedProductListingsColumn({
  searchResults,
  className,
  user,
  error,
  isLoading,
  fetchNextPage,
  isFetching,
  hasNextPage,
}: {
  searchResults?: SearchResult[];
  className?: ClassNameProps | string;
  isLoading?: boolean;
  isFetching?: boolean;
  fetchNextPage?: () => Promise<unknown>;
  hasNextPage?: boolean;
  error: boolean;
} & Props) {
  const router = useRouter();
  const { selectedProductId } = useSearchScreenParams();
  const { data: products } = api.product.getAll.useQuery(undefined, {
    onError: () => {
      toast.error("Erro ao Buscar produtos");
    },
  });

  const product = products?.find((product) => product.id === selectedProductId);

  /*Big screens have custom scroll defined by tailwind scrollbar-webkit
    having that window scroll events are not captured, so it is needed to add this 
    other listener that is latter attached to the parent div of the component
    so that endless scrolling  can be achieved (using infiniteScrollQuery) 
  */
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      const shouldFetchNextPage = hasNextPage && !isFetching;

      if (
        scrollHeight - scrollTop <= 1.3 * clientHeight &&
        shouldFetchNextPage
      ) {
        void fetchNextPage?.();
      }
    },
    [fetchNextPage, hasNextPage, isFetching],
  );

  const shouldShowLoader =
    !!searchResults && searchResults?.length > 0 && hasNextPage && !error;
  const shouldShowResultMessage = !!searchResults && searchResults?.length;
  const shouldShowLinkForFirstListing =
    searchResults?.length === 0 && !!user && user.role === "buyer" && !error;

  return (
    <div
      onScroll={handleScroll}
      className={cn("w-full", className)}
      // This resets scroll position on key change,
      // cus key changes forces React to rerender the component
      key={product?.id}
    >
      {isLoading &&
        Array.from({ length: 4 }).map((_, index) => (
          <SearchCardShimmer key={index} />
        ))}
      {!product && !isLoading && (
        <div className="flex h-full w-full">
          <div className="flex flex-row items-center gap-8 text-3xl">
            <ArrowLeftIcon size={30} />
            <h3 className="font-medium">Selecione um Produto</h3>
          </div>
        </div>
      )}

      {product && !isLoading && (
        <div className="flex flex-col items-end">
          <Button
            variant="ghost"
            className="fixed bottom-4 z-10 rounded-full bg-slate-100 bg-opacity-100 p-2 lg:sticky lg:right-0 lg:top-2"
            onClick={() =>
              router.replace(
                {
                  pathname: router.pathname,
                  query: { ...router.query, product: undefined },
                },
                undefined,
                { shallow: true },
              )
            }
          >
            <XIcon className="hidden lg:block" />
            <ArrowLeftIcon className="lg:hidden" size={22} />
            <span className="pr-2 lg:hidden">LISTA DE PRODUTOS</span>
          </Button>
          <div className="relative w-full rounded-xl md:p-8">
            <div className="mb-6  mr-2 mt-2 block max-w-[895px] rounded-lg bg-slate-100 p-4 lg:mr-8 ">
              {!error && (
                <span className="font-poppins-600 mb-2  ml-2 block text-xl lg:mb-0 lg:pb-4 lg:text-2xl">
                  {shouldShowResultMessage
                    ? "Resultados Para Saca (60kg) de:"
                    : "Ainda não há anúncios para distância pesquisada para:"}
                </span>
              )}
              {error && (
                <span className="font-poppins-600 mb-2  ml-2 block text-xl lg:mb-0 lg:pb-4 lg:text-2xl">
                  Tente novamente mais tarde, houve um erro ao buscar anúncios
                  de:
                </span>
              )}
              <span className="font-poppins-400 ml-2 mt-2 block pb-4 text-lg lg:text-xl">
                {product.name}
              </span>
              {shouldShowLinkForFirstListing && (
                <Button
                  variant="link"
                  asChild
                  className="font-poppins-700 ml-2 block p-0 text-xl text-accent"
                >
                  <a href={`/listings/new?product=${product.id}`}>
                    Seja o primeiro a Anunciar
                  </a>
                </Button>
              )}
            </div>
            <div>
              {searchResults?.map((searchResult, index) => (
                <div key={index} className="mb-10 md:mr-7">
                  <SearchResultCard
                    searchResult={searchResult}
                    showBlured={!user}
                    product={product}
                  />
                </div>
              ))}
              {shouldShowLoader && (
                <div className="mt-4 flex  w-full max-w-[880px] items-center justify-center ">
                  <span className="font-poppins-800 mr-2 text-accent  lg:mr-6">
                    {" "}
                    Carregando mais resultados ...{" "}
                  </span>
                  <BounceLoader
                    color={"#3cb37e"}
                    loading={true}
                    size={50}
                    aria-label="Carregando"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultCard({
  searchResult,
  product,
  showBlured,
}: {
  searchResult: SearchResult;
  product: Product;
  showBlured: boolean;
}) {
  const listingTime = new Date(searchResult?.updatedAt ?? "");
  const timeString = getDisplayTimeWithAgo(listingTime);

  // Show other products listings but filter out the current product listing
  const otherProductsListingsFromUser = searchResult?.user?.listings?.filter(
    (listing) => listing.productId !== product.id,
  );

  const shouldShowOtherProductsListingsFromUser =
    !!otherProductsListingsFromUser &&
    otherProductsListingsFromUser?.length > 0;

  return (
    <div className="flex max-w-[880px] rounded-lg border-[2.3px] border-black pb-3 md:justify-center md:px-0 xl:pb-0 ">
      <div className="relative w-full px-4 pt-7">
        <div className="font-poppins-500 absolute right-3 top-3 flex rounded-md text-xl ">
          <PriceTag value={Number(searchResult?.price)} className="mt-2" />
        </div>
        <div className="font-poppins-500 absolute left-3 top-4 flex w-64 flex-row items-start rounded-md p-3 text-sm ">
          <TimerIcon className="mr-1 " size={18} /> {timeString}{" "}
        </div>
        <div className="mt-12 flex w-full flex-col justify-between px-2 md:flex-row">
          <ProductCard
            small
            footer={
              <PriceTag value={Number(searchResult?.price)} className="mt-2" />
            }
            product={product}
            className="xl:w-10em mb-8"
          />
          {!!searchResult.user && (
            <UserAnnouncementInfo
              showBlured={showBlured}
              user={searchResult.user}
            />
          )}
        </div>
        {shouldShowOtherProductsListingsFromUser && (
          <div className="space-y-4">
            <Separator className="mb-4 mt-3 w-full bg-black md:mt-0"></Separator>
            <span className="font-inter-600">
              Outros anúncios desse comprador...
            </span>
            <div className="items-around flex flex-row flex-wrap ">
              {otherProductsListingsFromUser?.map((listing, index) => (
                <div
                  key={index}
                  className="mr-2 max-w-[140px] md:max-w-[170px] "
                >
                  <Card className="md:border-3 mb-3 mr-1 border-2 border-headingSecondary bg-slate-50 md:mr-3">
                    <CardContent className="xl:text-ms font-inter-500 justify-top flex flex-col px-2.5 pb-2 pt-1 text-xs text-headingSecondary">
                      <PriceTag
                        small
                        value={Number(listing.price)}
                        className="mb-2 mt-2 opacity-80"
                      />
                      <p>{listing.product.name}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function UserAnnouncementInfo({
  user,
  showBlured,
}: {
  user: User;
  showBlured: boolean;
}) {
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
    if (user?.secondaryPhone && user?.secondaryPhoneUsesWhatsapp) {
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
    if (!!phoneNumber) {
      const url = `https://wa.me/55${+phoneNumber.replace(/[\s()-]/g, "")}`;
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
    <div className={cn("md:max-w-2xl")}>
      <div className="relative rounded-lg ">
        {showBlured && (
          <Link
            href="/login"
            className="font-poppins-600 absolute left-16 top-14 z-10 text-xl underline"
          >
            <span className="text-accent">Entre</span> para ver detalhes
          </Link>
        )}
        <div
          className={cn("mb-2 flex space-x-4", {
            "select-none blur": showBlured,
          })}
        >
          <div className="flex flex-col gap-2  capitalize md:pl-10">
            <div className="ml-0.5 mt-0.5 flex items-start justify-start md:ml-0 ">
              <div className="flex flex-col items-start">
                <span className=" mb-1 w-40 break-all text-lg font-bold">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="flex">
              <MapPinIcon className="mr-2.5 h-5 w-5 text-current md:ml-0" />
              <span className="w-36 text-sm text-gray-500">
                {user?.city} - {user?.province}{" "}
              </span>
            </div>
            {user?.instagram && (
              <div className="mt-0.5 flex items-start justify-start">
                <Image
                  priority
                  src="/images/icons/instagram-app-icon.svg"
                  height={17}
                  width={17}
                  className="mr-2.5 pt-0.5 md:ml-0.5"
                  alt="Instagram Icon"
                />
                <div className="flex flex-col items-start">
                  <span className="mb-1 w-40 break-all text-sm">
                    {user.instagram}
                  </span>
                </div>
              </div>
            )}
            {whatsAppPhones.length > 0 && (
              <div className="flex items-start justify-start">
                <Image
                  priority
                  className="mr-2.5 cursor-pointer"
                  src="/images/icons/whatsapp-icon.svg"
                  height={22}
                  onClick={() => {
                    openWhatsApp(whatsAppPhones?.[0]);
                  }}
                  width={22}
                  alt="Phone Icon"
                />
                <div className="flex flex-col">
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
              <div className="mt-[5px] flex items-start justify-start md:pointer-events-none">
                <Image
                  priority
                  src="/images/icons/phone-icon.svg"
                  height={20}
                  width={20}
                  className="mr-2.5 cursor-pointer"
                  onClick={() => {
                    openPhoneApp(commonPhones?.[0]);
                  }}
                  alt="Phone Icon"
                />
                <div className="flex flex-col md:pointer-events-none">
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
          <Avatar className="mt-5 flex aspect-[1/1] h-24 w-24 items-center justify-center xl:h-28 xl:w-28">
            {user?.avatarImage && (
              <div className="flex ">
                <AvatarImage
                  className="rounded-full object-cover "
                  src={showBlured ? undefined : user?.avatarImage}
                />
              </div>
            )}
            <AvatarFallback
              style={{
                backgroundColor: `${generateAvatarColor(user?.name ?? "")}`,
              }}
              className={`flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 object-cover xl:h-28 xl:w-28 `}
            >
              <span className={`font-poppins-700 text-2xl text-white`}>
                {user?.name?.substring(0, 2).toLocaleUpperCase()}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
