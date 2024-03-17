import { cn } from "~/utils/ui";

export function PriceTag({
  value,
  small,
  className,
  ...rest
}: { value: number, small?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-fit rounded-lg bg-priceTag px-4 py-2 text-xl text-white",
        className,
        small && "text-sm py-0.5 px-2"
      )}
      {...rest}
    >
      R$ <span className="font-semibold">{value.toFixed(2)}</span>
    </div>
  );
}
