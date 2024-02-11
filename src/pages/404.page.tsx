import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils/ui";

export default function NotFoundPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-backgroundPrimary">
      <div className="flex flex-col gap-6 pb-10 lg:gap-8">
        <h1
          className={cn(
            "font-poppins-700 text-headingSecondary",
            "text-5xl lg:text-8xl",
          )}
        >
          Oops!
        </h1>
        <p className="text-xl lg:text-3xl">
          Não conseguimos achar a página que você pediu
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "primary" }),
            "w-fit gap-3 text-lg",
          )}
        >
          <ArrowLeftIcon />
          Voltar
        </Link>
      </div>
    </main>
  );
}
