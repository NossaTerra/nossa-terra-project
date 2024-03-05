import type { PropsWithChildren } from "react";
import { type ClassNameProps, cn } from "~/utils/ui";

type Props = ClassNameProps & PropsWithChildren;

export function H1({ children, className }: Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 py-4 text-3xl font-bold tracking-tight sm:py-10 sm:text-4xl lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: Props) {
  return (
    <h2
      className={cn(
        "scroll-m-20 py-10 text-3xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: Props) {
  return (
    <h3
      className={cn(
        "scroll-m-20 py-6 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function P({ children, className }: Props) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}

export function Blockquote({ children, className }: Props) {
  return (
    <blockquote className={cn("my-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
}
