import { type Product } from "@prisma/client";
import { getProductImageSrc } from "~/server/types/product.type";
import Image from "next/image";
import { cn } from "~/utils/ui";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  price?: string;
  small?: boolean;
  product: Product;
  footer?: React.ReactNode;
  topRightElement?: React.ReactNode;
}

export function ProductCard({
  product,
  footer,
  topRightElement,
  small,
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "bg-background relative flex min-h-20 overflow-hidden rounded-lg border-[2.5px] border-gray-800 p-4",
        small ? "w-[19em]  xl:w-[22em]" : "w-[23em]",
        className,
      )}
      {...rest}
    >
      <div
        className="absolute -left-1 top-0 h-[110%] w-8 border-r-2 border-gray-800"
        style={{
          backgroundColor: product.mainColor,
        }}
      />
      <Image
        priority
        src={getProductImageSrc(product.type)}
        height={small ? 62 : 90}
        width={small ? 62 : 90}
        alt="marca dágua do produto"
        className="absolute -bottom-4 -right-3 opacity-60"
      />
      <div className={small ? "mb-2 pl-5 pr-2" : "pl-6 pr-16"}>
        <p className="text-lg">{product.name}</p>
        {footer}
      </div>

      {topRightElement && (
        <div className={cn("absolute right-2 top-2")}>{topRightElement}</div>
      )}
    </div>
  );
}
