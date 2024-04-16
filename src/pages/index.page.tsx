import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";

import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import { useRouter } from "next/router";
import { ArrowLeftIcon, XIcon, ArrowUpIcon, TimerIcon } from "lucide-react";
import { type SearchResult, api } from "~/utils/api";
import { Card, CardContent } from "~/components/ui/card";
import { type Product } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { ProductCard } from "~/components/common/ProductCard";
import { useCallback, useEffect, useState } from "react";
import { animateScrollToTop } from "~/utils/scroll";
import { getDisplayTimeWithAgo } from "~/utils/time";
import { PriceTag } from "~/components/common/PriceTag";
import BounceLoader from "react-spinners/BounceLoader";
import SearchCardShimmer from "./search/SearchCardShimmer";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { AdsCarrouselListings } from "~/components/common/AdsCarrousel";
import React from "react";
import toast from "react-hot-toast";
import { UserInfoCard } from "~/components/common/UserInfoCard";

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

  const {
    data,
    error: listingsQueryError,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isLoading,
  } = api.search.getProductListings.useInfiniteQuery(
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
    <div className="flex grow flex-col lg:max-h-dvh">
      <AppHeader user={user} hideLogo={!user} />
      <div className="flex grow flex-row overflow-hidden">
        <>
          {!selectedProductId && (
            <Button
              variant="ghost"
              className={cn(
                "fixed bottom-4 right-2 z-10 rounded-full bg-slate-100 bg-opacity-100 p-2",
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
            title="Pesquisa de Anúncios"
            showSlider={!!user && !!user?.latitude && !!user?.longitude}
            className={cn(
              "flex w-full grow lg:mr-8 lg:w-[58em] lg:overflow-y-auto lg:scrollbar-webkit",
              {
                "hidden lg:block": selectedProductId,
              },
            )}
          />
        </>
        <SelectedProductListingsColumn
          searchResults={searchResults}
          isFetching={isFetching}
          listingsQueryError={!!listingsQueryError}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          user={user}
          className={cn(
            "grow px-3 pb-16 md:px-10 lg:overflow-y-auto lg:scrollbar-webkit",
            {
              "hidden lg:block": !selectedProductId,
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
  listingsQueryError,
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
  listingsQueryError: boolean;
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
    !!searchResults &&
    searchResults?.length > 0 &&
    hasNextPage &&
    !listingsQueryError;
  const shouldShowResultMessage = !!searchResults && searchResults?.length;
  const shouldShowLinkForFirstListing =
    searchResults?.length === 0 &&
    !!user &&
    user.role === "buyer" &&
    !listingsQueryError;
  const hasAtLeastTenResults =
    searchResults && searchResults.length < 10 && searchResults.length > 0;

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
            className="fixed bottom-4 z-20 rounded-full bg-slate-100 bg-opacity-100 p-2 lg:sticky lg:right-0 lg:top-2"
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
              {!listingsQueryError && (
                <span className="font-poppins-600 mb-2  ml-2 block text-xl lg:mb-0 lg:pb-4 lg:text-2xl">
                  {shouldShowResultMessage
                    ? "Resultados Para Saca (60kg) de:"
                    : "Ainda não há anúncios para distância pesquisada para:"}
                </span>
              )}
              {listingsQueryError && (
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
              <div className="flex max-w-[890px] flex-col gap-0">
                {searchResults?.map((searchResult, index) => (
                  <React.Fragment key={index}>
                    <div className="mb-10 md:mr-7">
                      <SearchResultCard
                        searchResult={searchResult}
                        showBlured={!user}
                        product={product}
                      />
                    </div>
                    {(index + 1) % pageLimit === 0 &&
                      index + 1 !== searchResults.length && (
                        <AdsCarrouselListings />
                      )}
                  </React.Fragment>
                ))}
                {/* Show sponsored section at the end if there are fewer than ten results */}
                {hasAtLeastTenResults && <AdsCarrouselListings />}
              </div>
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
    <div className="flex max-w-[880px] flex-col gap-4 rounded-lg border-[2.3px] border-black p-4 md:justify-center">
      <div className="flex w-full justify-between">
        <div className="font-poppins-500 flex items-center gap-2">
          <TimerIcon className="size-5" />
          {timeString}
        </div>
        <PriceTag value={Number(searchResult?.price)} className="mt-2" />
      </div>

      <div className="flex w-full flex-row flex-wrap justify-between gap-8 pb-4">
        <ProductCard
          product={product}
          footer={
            <PriceTag value={Number(searchResult?.price)} className="mt-4" />
          }
          small
          className="w-full max-w-[22em]"
        />
        {!!searchResult.user && (
          <UserInfoCard
            showBlured={showBlured}
            user={searchResult.user}
            className="max-w-[22em]"
          />
        )}
      </div>

      {shouldShowOtherProductsListingsFromUser && (
        <div className="space-y-2">
          <span className="font-inter-600">
            Outros anúncios desse comprador...
          </span>
          <div className="flex flex-row flex-wrap gap-4">
            {otherProductsListingsFromUser?.map((listing, index) => (
              <Card
                key={index}
                className="md:border-3 max-w-40 border-2 border-headingSecondary bg-slate-50 md:max-w-44"
              >
                <CardContent className="font-inter-500 justify-top flex flex-col px-2.5 pb-2 pt-1 text-xs text-headingSecondary lg:text-sm">
                  <PriceTag
                    small
                    value={Number(listing.price)}
                    className="mb-2 mt-2 opacity-80"
                  />
                  <p>{listing.product.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
