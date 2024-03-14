import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "src/utils/ui";
import { type NonUndefined } from "node_modules/react-hook-form/dist/types/utils";
import { Loader2 } from "lucide-react";

export const linkClassNames =
  "text-accent underline hover:text-headingSecondary underline-offset-4 hover:underline dark:text-slate-50";

const buttonVariants = cva(
  "inline-flex gap-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        primary: "bg-backgroundTertiary text-basedDark hover:bg-green-400",
        default:
          "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-[#ba1a1a] text-[#ffffff] font-bold hover:bg-red-600/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-500 bg-cardShade hover:bg-textSecondary hover:text-slate-100 dark:border-slate-900 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: linkClassNames,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <Loader2 color="black" className=" mr-2 h-5 w-5 animate-spin" />
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";
export type ButtonVariantType = NonUndefined<
  Parameters<typeof buttonVariants>[0]
>["variant"];

export { Button, buttonVariants };
