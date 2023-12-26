import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { type ClassNameProps, cn } from "~/lib/utils";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import ImageCarousel from "~/components/common/ImageCarrousel";

function MainContent({ className }: ClassNameProps) {
  return (
    <main
      className={cn(
        "flex items-center justify-center md:justify-start",
        className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-[28rem] md:max-w-none",
          "flex flex-col md:flex-row",

          // Align
          "items-center md:items-start",
          "justify-center",

          // Spacing
          "px-8 py-10",
          "gap-10 md:gap-16 lg:gap-28",
        )}
      >
        <h1
          className={cn(
            "font-poppins-700 text-headingPrimary",
            "text-left md:text-right",
            "text-2xl md:text-3xl lg:text-4xl",
          )}
        >
          Seja bem vindo(a) à{" "}
          <span
            className={cn(
              "font-poppins-800 text-headingSecondary",
              "text-3xl md:text-4xl lg:text-5xl",
              "inline-block md:block",
            )}
          >
            Nossa Terra
          </span>
        </h1>

        <form className="w-full md:max-w-xs lg:max-w-sm">
          <div className="mb-4 w-full">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              className="mt-3x w-full md:mt-0"
              id="email"
              placeholder="Email"
            />
          </div>
          <Button className="w-full bg-backgroundTertiary text-basedDark hover:bg-green-400">
            Continuar
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function RootScreen() {
  return (
    <div className="flex min-h-screen flex-grow flex-col">
      <header className="flex items-start justify-center pt-12 md:justify-end">
        <div className="hidden px-12 md:block">
          <NossaTerraLogo />
        </div>
        <ImageCarousel
          pathArray={["", "", "", "", "", "", ""]}
          height={220}
          width={220}
          className="block md:hidden"
        />
      </header>

      <MainContent className="flex grow" />

      <footer className="flex flex-col justify-center">
        <ImageCarousel
          pathArray={["", "", "", "", "", "", ""]}
          height={220}
          width={220}
          className="hidden md:block"
        />
        <div className="flex justify-center p-12 md:hidden">
          <NossaTerraLogo />
        </div>
      </footer>
    </div>
  );
}
