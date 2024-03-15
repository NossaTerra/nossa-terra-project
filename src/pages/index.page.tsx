import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import Image from "next/image";
import { ProductSearchColumn } from "~/components/common/ProductSearchColumn";
import { useRouter } from "next/router";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useRef, useLayoutEffect } from "react";
import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { api } from "~/utils/api";
import { Separator } from "~/components/ui/separator";
import { ProductCard } from "~/components/common/ProductCard";

export const getServerSideProps = redirectGetServerSideProps.MaybeAuthed;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SearchScreen({ user }: Props) {
  const router = useRouter();
  const selectedProductId = router.query.product;

  const { scrollRef } = useSnapNestedScrollToScreen();

  return (
    <>
      <AppHeader user={user} hideLogo />

      <div className="px-10">
        <div className="flex flex-col items-center gap-8 px-8 sm:flex-row sm:gap-16 sm:px-16">
          <Image
            src="/images/logo-no-background.png"
            width={200}
            height={114}
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
                "block",
              )}
            >
              Nossa Terra
            </span>
          </h1>
        </div>

        <Separator className="mt-20 h-1 bg-slate-400" />
      </div>
      <H2 className="px-8">Pesquisar Anúncios</H2>

      <div className="flex flex-row">
        <ProductSearchColumn
          title=""
          className={cn("h-svh w-full overflow-y-auto lg:w-[56em]", {
            "hidden lg:block": selectedProductId,
          })}
          containerRef={scrollRef}
        />
        <SelectedProductListingsColumn
          className={cn("h-svh overflow-y-auto px-10", {
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

  const { scrollRef } = useSnapNestedScrollToScreen({
    dependencyArray: [product?.id],
  });

  return (
    <div
      className={cn("sticky top-0 h-svh w-full", className)}
      ref={scrollRef}
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
          <div className="relative rounded-xl bg-cardShade p-8">
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
              <ProductCard product={product} className="mb-8" />

              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In</p>
              <p>vestibulum at ipsum et suscipit. Aenean vitae dui massa. Ut</p>
              <p>
                porttitor ac velit ut tincidunt. Pellentesque est lacus,
                pharetra
              </p>
              <p>
                sed tempor bibendum, rhoncus vitae lectus. Vivamus convallis
              </p>
              <p>blandit elit ut molestie. Fusce dignissim auctor ex, quis</p>
              <p>
                venenatis eros finibus ut. Donec molestie risus nulla, sit amet
              </p>
              <p>
                venenatis lorem euismod ut. Vivamus dignissim sem sed tellus
              </p>
              <p>
                vestibulum, ut convallis felis placerat. Duis nisl sem, lacinia
                ac
              </p>
              <p>mi nec, porttitor ultricies velit. Donec in bibendum eros.</p>
              <p>
                Suspendisse faucibus risus neque, in blandit dui porta id.
                Quisque
              </p>
              <p>
                pharetra odio commodo orci pulvinar viverra. Morbi non metus
              </p>
              <p>
                vehicula, ullamcorper purus vel, congue dui. Ut laoreet tellus
              </p>
              <p>
                leo, sed pellentesque enim mollis vitae. Cras sed hendrerit
                lacus,
              </p>
              <p>
                id pulvinar turpis. Aliquam tristique magna quis dolor maximus
              </p>
              <p>
                rutrum. Proin eu orci sed elit hendrerit auctor. Class aptent
              </p>
              <p>taciti sociosqu ad litora torquent per conubia nostra, per</p>
              <p>
                inceptos himenaeos. Integer sit amet scelerisque velit, et
                varius
              </p>
              <p>ligula. Donec id euismod felis, et facilisis odio. Integer</p>
              <p>fermentum nisl lorem, quis congue neque efficitur sit amet.</p>
              <p>Praesent mattis a nisi efficitur pellentesque. Pellentesque</p>
              <p>
                viverra volutpat mattis. Duis ornare lectus leo. Suspendisse at
              </p>
              <p>
                sodales turpis. Ut dolor tortor, molestie et placerat eu,
                interdum
              </p>
              <p>a enim. Nam molestie dui id dolor aliquet, et vehicula erat</p>
              <p>
                congue. Morbi a sem laoreet, dignissim ipsum sit amet,
                condimentum
              </p>
              <p>
                ipsum. Nunc vehicula odio a orci congue pretium. Phasellus justo
              </p>
              <p>
                dolor, pulvinar a lorem vitae, egestas molestie nisi.
                Suspendisse
              </p>
              <p>
                potenti. Nunc interdum nisi at nulla tincidunt, id lobortis
                lacus
              </p>
              <p>
                tempus. Pellentesque mauris justo, eleifend sit amet molestie
                non,
              </p>
              <p>
                consequat a lorem. Sed ligula enim, varius in ante quis, semper
              </p>
              <p>mattis magna. In ultricies lectus scelerisque dolor euismod</p>
              <p>
                tristique. Curabitur semper, elit quis porttitor rhoncus, leo
              </p>
              <p>
                justo cursus arcu, ut vehicula nibh mauris eget eros. Aliquam ac
              </p>
              <p>
                tempor augue. Etiam non ante dolor. Aenean rhoncus sagittis
                lacus
              </p>
              <p>
                vitae tincidunt. Vestibulum volutpat massa in ex venenatis, nec
              </p>
              <p>
                fringilla arcu egestas. Proin lectus nulla, imperdiet porttitor
              </p>
              <p>
                lorem eget, cursus faucibus dui. Duis vehicula orci quis mi
                ornare
              </p>
              <p>
                placerat. Nulla in fringilla magna. Curabitur vel pharetra elit,
              </p>
              <p>
                eget vehicula ipsum. Sed ut urna nisi. Vestibulum dapibus lacus
              </p>
              <p>
                non diam ultricies ullamcorper. Donec varius tellus nec urna
              </p>
              <p>convallis condimentum. Suspendisse congue nunc ut lobortis</p>
              <p>
                accumsan. Nunc vitae tellus feugiat, iaculis quam ac, iaculis
              </p>
              <p>
                magna. Pellentesque habitant morbi tristique senectus et netus
                et
              </p>
              <p>malesuada fames ac turpis egestas. Nullam fermentum semper</p>
              <p>
                imperdiet. Sed luctus libero ac erat volutpat dictum. Vivamus eu
              </p>
              <p>
                velit auctor, vulputate dolor eu, varius nibh. Sed turpis diam,
              </p>
              <p>
                blandit vel malesuada id, bibendum a nibh. Vestibulum nec metus
              </p>
              <p>
                diam. Etiam quis semper dui. Vestibulum scelerisque interdum
                magna
              </p>
              <p>
                fringilla semper. Praesent consequat pulvinar velit, eu
                fringilla
              </p>
              <p>
                erat pellentesque iaculis. Fusce posuere accumsan viverra. Cras
              </p>
              <p>
                varius faucibus est, at consectetur diam hendrerit id. Aliquam
              </p>
              <p>
                quis vestibulum ex, sit amet blandit ante. Cras sit amet maximus
              </p>
              <p>
                velit. Vivamus tempus libero nec dolor maximus porttitor.
                Interdum
              </p>
              <p>
                et malesuada fames ac ante ipsum primis in faucibus. Vivamus id
              </p>
              <p>
                varius mi. Proin luctus dui non libero fermentum, sed volutpat
              </p>
              <p>
                sapien sodales. Mauris vehicula urna eu est maximus, in porta
                orci
              </p>
              <p>
                dictum. Mauris elementum ex in lectus sodales congue. Nam
                lacinia
              </p>
              <p>
                magna nec eleifend accumsan. Nam pellentesque ullamcorper erat,
              </p>
              <p>
                eget convallis lectus euismod ac. Vivamus vitae turpis neque.
              </p>
              <p>
                Fusce pellentesque finibus enim at sodales. Nullam condimentum
              </p>
              <p>
                felis sed libero fermentum scelerisque. Integer condimentum
                felis
              </p>
              <p>at justo faucibus consectetur. Integer imperdiet, lectus et</p>
              <p>
                interdum pharetra, lacus justo volutpat diam, ut rutrum mi leo
              </p>
              <p>
                eget diam. Ut vitae rutrum diam. Nam ornare tortor quis massa
              </p>
              <p>
                volutpat consequat. Etiam euismod est eu varius bibendum. Sed
              </p>
              <p>
                rhoncus quis sem sit amet malesuada. Sed ac neque et ex finibus
              </p>
              <p>
                vestibulum. Pellentesque ex nulla, tincidunt vitae ornare eget,
              </p>
              <p>tempor non justo. Sed sagittis nulla in nunc consectetur</p>
              <p>pellentesque. Aliquam interdum elit a ante congue gravida.</p>
              <p>Phasellus hendrerit velit vestibulum urna interdum gravida.</p>
              <p>
                Suspendisse potenti. Sed justo enim, sagittis ac pharetra sit
              </p>
              <p>
                amet, blandit sit amet enim. Aliquam fermentum tincidunt orci,
              </p>
              <p>
                faucibus sodales felis. Fusce fringilla vel purus id posuere.
                Sed
              </p>
              <p>
                ut feugiat ex. Nunc a maximus neque, id feugiat leo. Ut semper
              </p>
              <p>
                erat vitae ullamcorper dapibus. Sed lacus tortor, sagittis nec
              </p>
              <p>
                fringilla sed, laoreet eget nulla. Aliquam a neque imperdiet,
              </p>
              <p>
                feugiat arcu finibus, aliquet erat. Praesent rhoncus, elit sed
              </p>
              <p>
                pretium sollicitudin, enim diam elementum mauris, in varius nisl
              </p>
              <p>felis non eros. Integer odio ligula, scelerisque at mi non,</p>
              <p>
                lobortis accumsan ligula. Duis eleifend pretium elit, vel
                finibus
              </p>
              <p>
                nulla maximus sed. In malesuada, orci eget elementum laoreet,
              </p>
              <p>
                ipsum dui vehicula sem, eu pellentesque neque est vitae nisi.
              </p>
              <p>
                Vestibulum facilisis ornare nibh a consequat. Sed tincidunt elit
              </p>
              <p>
                vel augue luctus, id faucibus augue eleifend. Nam consectetur eu
              </p>
              <p>
                nulla vitae consequat. Praesent tincidunt nisl vel eros commodo,
              </p>
              <p>
                eget ornare ante pharetra. Sed ut lobortis eros. Donec nec
                auctor
              </p>
              <p>nisl. Maecenas lacinia elit velit, posuere lacinia libero</p>
              <p>venenatis dignissim. Integer tortor ante, laoreet fermentum</p>
              <p>
                aliquam eget, elementum vel lorem. Duis hendrerit hendrerit
                diam,
              </p>
              <p>
                a interdum metus facilisis nec. Phasellus sollicitudin nulla
                vitae
              </p>
              <p>nisi tincidunt laoreet. Quisque consequat pretium ante, vel</p>
              <p>
                pharetra eros varius semper. Praesent pellentesque odio nibh,
                sit
              </p>
              <p>
                amet dapibus nisl tempor vel. Sed viverra blandit felis vitae
              </p>
              <p>
                egestas. Duis ultrices, nisi in maximus commodo, ligula mauris
              </p>
              <p>
                maximus dolor, a cursus metus nulla in odio. Donec sit amet
                tempor
              </p>
              <p>
                justo, at sollicitudin lectus. Nunc tempus augue venenatis arcu
              </p>
              <p>
                feugiat, vitae pretium urna interdum. Suspendisse consectetur
                diam
              </p>
              <p>in ipsum venenatis elementum.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useSnapNestedScrollToScreen(
  props?:
    | {
      dependencyArray?: unknown[];
    }
    | undefined,
) {
  const { dependencyArray = [] } = props ?? {};

  const scrollRef = useRef<HTMLDivElement>(null);
  const threshold = 10;

  useLayoutEffect(() => {
    const { current } = scrollRef;
    if (!current) {
      return;
    }

    let touchStartY: number | undefined = undefined;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY;
    };
    const handleTouchEnd = () => {
      touchStartY = undefined;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (!touchStartY || !currentY) {
        return;
      }
      const deltaY = touchStartY - currentY;
      const rect = current?.getBoundingClientRect();
      const isNotSnappedOnTop = rect.top > threshold;

      if (deltaY > 0 && isNotSnappedOnTop) {
        event.preventDefault();
        event.stopPropagation();

        current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    };
    const handleWheel = (event: WheelEvent) => {
      const { deltaY } = event;
      const rect = current?.getBoundingClientRect();
      const isNotSnappedOnTop = rect.top > threshold;

      if (deltaY > 0 && isNotSnappedOnTop) {
        event.preventDefault();
        event.stopPropagation();

        current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    };

    current.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    current.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    current.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
    current.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      current.removeEventListener("wheel", handleWheel);
      current.removeEventListener("touchstart", handleTouchStart);
      current.removeEventListener("touchend", handleTouchEnd);
      current.removeEventListener("touchmove", handleTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencyArray]);

  return {
    scrollRef,
  };
}
