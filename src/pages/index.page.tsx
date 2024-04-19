import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";

import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  MapPinIcon,
  TimerIcon,
} from "lucide-react";
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
import { SearchSlider } from "~/components/ui/slider";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "~/components/ui/separator";
import { useIsMobile } from "~/hooks/useResponsive";

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

  const [isBellowScrollThreashold, setIsBellowScrollThreshold] =
    useState(false);

  /*Small screens just use the default scroll mechanism this useEffect adds
    scroll event listener for those screens to either show the top button so
    that users can easily scroll to the top of the page and also the event listener
    handles pagination logic for endless scrolling on small devices
  */
  useEffect(() => {
    const handleScroll = () => {
      //logic to show the top button on small screens
      const scrollTop = window.scrollY;
      setIsBellowScrollThreshold(scrollTop > 400);

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

  const isMobile = useIsMobile();

  return (
    <div className="relative flex grow flex-col lg:max-h-dvh">
      <AppHeader
        user={user}
        hideLogo={!user}
        className={cn({
          "hidden lg:flex": selectedProductId,
        })}
      />
      <MobileListingsHeader
        showSlider={!!user && !!user.latitude && !!user.longitude}
        className={cn("hidden", {
          "flex lg:hidden": selectedProductId,
        })}
      />

      <AnimatePresence>
        {isBellowScrollThreashold && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4 }}
            className="fixed left-0 right-0 top-4 z-50 flex justify-center"
          >
            <Button
              variant="outline"
              className="flex gap-4 rounded-full border-4 border-black p-5 text-lg"
              onClick={animateScrollToTop}
            >
              <ArrowUpIcon size={22} />
              TOPO
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex grow flex-row overflow-x-hidden">
        <ProductSearchColumn
          showSlider={
            !isMobile && !!user && !!user.latitude && !!user.longitude
          }
          title="Pesquisa de Anúncios"
          className={cn(
            "flex w-full grow lg:mr-8 lg:w-[58em] lg:overflow-y-auto lg:scrollbar-webkit",
            {
              "hidden lg:block": selectedProductId,
            },
          )}
        />

        <SelectedProductListingsColumn
          searchResults={searchResults}
          isFetching={isFetching}
          listingsQueryError={!!listingsQueryError}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          user={user}
          className={cn(
            "w-full grow p-4 pb-16 sm:p-8 lg:overflow-y-auto lg:scrollbar-webkit",
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
  isLoading?: boolean;
  isFetching?: boolean;
  fetchNextPage?: () => Promise<unknown>;
  hasNextPage?: boolean;
  listingsQueryError: boolean;
} & Props &
  ClassNameProps) {
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

  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SearchCardShimmer key={index} />
        ))}
      </div>
    );
  }

  if (!product) {
    return (
      <div className={cn("flex h-full w-full grow", className)}>
        <div className="fixed bottom-32 flex flex-row items-center gap-8 text-3xl">
          <ArrowLeftIcon size={30} />
          <h3 className="font-medium">Selecione um Produto</h3>
        </div>
      </div>
    );
  }

  return (
    <div
      onScroll={handleScroll}
      className={cn("relative flex flex-col items-end lg:pt-0", className)}
      // This resets scroll position on key change,
      // cus key changes forces React to rerender the component
      key={product?.id}
    >
      <div className="w-full rounded-xl">
        <div className="mb-6 mt-2 block max-w-[895px] rounded-lg bg-slate-100 p-6">
          {!listingsQueryError && (
            <span className="font-poppins-600 block text-xl lg:text-2xl">
              {shouldShowResultMessage
                ? "Resultados Para Saca (60kg) de:"
                : "Ainda não há anúncios para distância pesquisada para:"}
            </span>
          )}
          {listingsQueryError && (
            <span className="font-poppins-600 block text-xl lg:text-2xl">
              Tente novamente mais tarde, houve um erro ao buscar anúncios de:
            </span>
          )}
          <span className="font-poppins-400 mt-4 block text-lg lg:text-xl">
            {product.name}
          </span>
          {shouldShowLinkForFirstListing && (
            <Button
              variant="link"
              asChild
              className="font-poppins-700 mt-4 block p-0 text-xl text-accent"
            >
              <a href={`/listings/new?product=${product.id}`}>
                Seja o primeiro a Anunciar
              </a>
            </Button>
          )}
        </div>

        <div>
          <div className="flex max-w-[890px] flex-col">
            {searchResults?.map((searchResult, index) => (
              <React.Fragment key={index}>
                <div className="mb-10">
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
            <div className="mt-4 flex w-full max-w-[880px] items-center justify-center gap-2 lg:gap-4 ">
              <span className="font-poppins-800 text-accent">
                Carregando mais resultados ...
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
            className="max-w-[22em] p-2"
          />
        )}
      </div>

      {shouldShowOtherProductsListingsFromUser && (
        <div className="space-y-2 pb-2">
          <Separator orientation="horizontal" className="mb-4 bg-black" />
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

function MobileListingsHeader({
  showSlider = true,
  className,
}: { showSlider?: boolean } & ClassNameProps) {
  const router = useRouter();
  const unselectProduct = useCallback(
    () =>
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, product: undefined },
        },
        undefined,
        { shallow: true },
      ),
    [router],
  );

  return (
    <div className={cn("flex w-full flex-col gap-8", className)}>
      <div
        className={cn(
          "flex w-full flex-col gap-8 bg-cardHover bg-opacity-25 px-4 py-8 shadow sm:px-8",
        )}
      >
        <Button
          className="w-fit gap-3 p-6 text-lg"
          variant="outline"
          onClick={unselectProduct}
        >
          <ArrowLeftIcon />
          Voltar
        </Button>
      </div>
      {showSlider && (
        <div className="flex w-full flex-col px-4 sm:px-8">
          <div className="flex flex-row gap-2">
            <MapPinIcon className="size-6" />
            Distância:
          </div>
          <SearchSlider className="m-0 p-0" step={1} />
        </div>
      )}
    </div>
  );
}
