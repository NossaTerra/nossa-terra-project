"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "src/utils/ui";
import { type ProductType } from "@prisma/client";
import { type } from "os";
import {
  ProductTypeLabel,
  getProductImageSrc,
} from "~/server/types/product.type";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",

      "data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 ",
      "dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900",

      "data-[state=indeterminate]:bg-zinc-500 data-[state=indeterminate]:text-white ",
      "dark:data-[state=indeterminate]:bg-zinc-200 dark:data-[state=indeterminate]:text-black",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {props.checked === "indeterminate" ? (
        <MinusIcon className="h-4 w-4" />
      ) : (
        <CheckIcon className="h-4 w-4" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

interface ProductTypeCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  productType: ProductType;
}

const CheckboxProductType = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ProductTypeCheckboxProps
>(({ className, productType, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative shrink-0 overflow-hidden rounded-lg border-4 border-slate-300 p-4 pr-14 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
      "data-[state=checked]:border-slate-900",
      className,
    )}
    {...props}
  >
    <span>{ProductTypeLabel[productType]}</span>
    <Image
      priority
      src={getProductImageSrc(productType)}
      height={50}
      width={50}
      alt="marca dágua do produto"
      className="absolute -bottom-2 -right-2 opacity-90"
    />
  </CheckboxPrimitive.Root>
));
CheckboxProductType.displayName = CheckboxPrimitive.Root.displayName;

export { CheckboxProductType };
