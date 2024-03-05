import { type Product } from "@prisma/client";
import { getProductImageSrc } from "~/server/types/product.type";
import Image from "next/image";
import { cn } from "~/utils/ui";

export function ProductCard({
  product,
  className,
  ...rest
}: { product: Product } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-background relative flex min-h-20 w-[23em] overflow-hidden rounded-lg border-[2.5px] border-gray-800 p-4",
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
        height={90}
        width={90}
        alt="marca dágua do produto"
        className="absolute -bottom-4 -right-3 opacity-60"
      />

      <div className="pl-6 pr-12 text-lg">{product.name}</div>
    </div>
  );
}
