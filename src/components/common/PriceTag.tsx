import { cn } from "~/utils/ui";

export function PriceTag({
  value,
  className,
  ...rest
}: { value: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-fit rounded-lg bg-priceTag px-4 py-2 text-xl text-white",
        className,
      )}
      {...rest}
    >
      R$ <span className="font-semibold">{value.toFixed(2)}</span>
    </div>
  );
}
