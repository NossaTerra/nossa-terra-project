import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn, type ClassNameProps } from "src/utils/ui";

interface ImageCarouselProps extends ClassNameProps {
  width: number;
  height: number;
  pathArray: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  width,
  height,
  pathArray,
  className,
}) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="relative flex"
        animate={{ x: ["0%", "80%", "0%", "-90%"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        {pathArray.map((path, index) => (
          <motion.div className=" flex flex-shrink-0 " key={index}>
            {path ? (
              <Image
                src={path}
                alt={`Image ${index + 1}`}
                width={width}
                height={height}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={"/images/placeholder.png"}
                priority
                alt={`Image ${index + 1}`}
                width={width}
                height={height}
                className="height-full object-cover"
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ImageCarousel;
