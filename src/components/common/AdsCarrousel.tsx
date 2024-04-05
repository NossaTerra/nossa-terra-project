import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn, type ClassNameProps } from "src/utils/ui";
import { api } from "~/utils/api";
import { useIsMobile } from "~/hooks/useResponsive";

const AdsCarrousel: React.FC<ClassNameProps> = ({ className }) => {
  const { isLoading, data: adsData } = api.ad.getAll.useQuery();
  const isMobile = useIsMobile();

  const filteredAds = useMemo(() => {
    if (!adsData) return [];
    return adsData.filter((ad) => ad.type === "Banner" && ad.isActive);
  }, [adsData]);

  return (
    <div className={cn("overflow-hidden", className)}>
      {!isLoading && (
        <motion.div
          className="relative mb-4 flex gap-12"
          animate={{
            x: isMobile
              ? [
                  "0%",
                  "80%",
                  "0%",
                  "-80%",
                  "-160%",
                  "-240%",
                  "-320%",
                  "-400%",
                  "-480%",
                ]
              : ["0%", "80%", "0%", "-80%"],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: [0.58, 0.61, 0.56, 0.69],
          }}
        >
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <React.Fragment key={index}>
                {filteredAds?.map((ad, adIndex) => (
                  <div className="flex flex-shrink-0" key={adIndex}>
                    <a
                      href={ad?.link ?? undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (ad?.link) {
                          window.open(ad.link, "_blank");
                        }
                      }}
                    >
                      <Image
                        src={ad.adImage}
                        alt={`Image ${adIndex + 1}`}
                        width={400}
                        height={120}
                        objectFit="cover"
                        className={cn(
                          "h-full max-h-20 w-full md:max-h-28 ",
                          ad?.link && "cursor-pointer",
                        )}
                      />
                    </a>
                  </div>
                ))}
                {filteredAds.length < 3 && (
                  <div
                    className="font-poppins-900 flex flex-shrink-0 items-center justify-center text-xl "
                    key={"placeholder"}
                  >
                    <Image
                      src={"/images/products/small_arabica.png"}
                      priority
                      alt={`Coffee placeholder`}
                      width={100}
                      height={100}
                      className="height-full object-cover"
                    />
                    <div className="ml-8 mr-8 flex flex-col">
                      <span className="mb-2 text-textPrimary">
                        ANUNCIE{" "}
                        <span className="text-headingPrimary">AQUI</span>
                      </span>
                      <span className="text-headingPrimary">
                        ANUNCIE <span className="text-textPrimary">AQUI</span>
                      </span>
                    </div>
                    <Image
                      src={"/images/products/small_robusta.png"}
                      priority
                      alt={`Coffee placeholder`}
                      width={100}
                      height={100}
                      className="height-full object-cover"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default AdsCarrousel;

export const AdsCarrouselListings = () => {
  return (
    <div className="mb-4 w-full pl-1 pr-[0.3vw] md:pr-[2.4vw] xl:pr-[1.5vw]">
      <div className="mb-4 max-w-[890px] rounded-md bg-slate-100 pt-3">
        <span className="font-poppins-500 pl-4">Patrocinado:</span>
        <div className="mx-auto mt-4">
          <AdsCarrousel />
        </div>
      </div>
    </div>
  );
};

export const AdsCarouselFooter = () => {
  return (
    <footer className="mb-0 mt-auto flex max-h-52 flex-1 flex-col items-end justify-end bg-slate-100 pt-3 md:mt-auto md:block md:flex-initial">
      <div className="w-[100vw] pb-10 md:pb-0 lg:mr-4 lg:w-full">
        <span className="font-poppins-600 pl-4 underline">Patrocinado:</span>
        <div className="mx-auto mt-6">
          <AdsCarrousel />
        </div>
      </div>
    </footer>
  );
};
