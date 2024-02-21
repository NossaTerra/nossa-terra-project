import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn, type ClassNameProps } from "src/utils/ui";
import { api } from "~/utils/api";
import { useMediaQuery } from "react-responsive";

const ImageCarousel: React.FC<ClassNameProps> = ({ className }) => {
  const { isLoading, data: adsData } = api.ad.getAll.useQuery();

  const [isDesktop, setIsDesktop] = useState(false);

  const desktop = useMediaQuery({ query: "(min-width: 768px)" });

  useEffect(() => {
    setIsDesktop(desktop);

    const handleResize = () => {
      setIsDesktop(desktop);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [desktop]);

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
            x: isDesktop
              ? ["0%", "80%", "0%", "-80%"]
              : [
                  "0%",
                  "80%",
                  "0%",
                  "-80%",
                  "-160%",
                  "-240%",
                  "-320%",
                  "-400%",
                  "-480%",
                ],
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
                    <Image
                      src={ad.adImage}
                      alt={`Image ${adIndex + 1}`}
                      onClick={() => ad?.link && window.open(ad.link, "_blank")}
                      width={400}
                      height={120}
                      objectFit="cover"
                      className={cn(
                        "h-full max-h-20 w-full md:max-h-28 ",
                        ad?.link && "cursor-pointer",
                      )}
                    />
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

export default ImageCarousel;
