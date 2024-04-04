import { cn } from "~/utils/ui";

export function formatCurrencyReais(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PriceTag({
  value,
  small,
  className,
  ...rest
}: { value: number; small?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-fit rounded-lg bg-priceTag px-4 py-2 text-xl text-white",
        className,
        small && "px-2 py-0.5 text-sm",
      )}
      {...rest}
    >
      R$ <span className="font-semibold">{formatCurrencyReais(value)}</span>
    </div>
  );
}
