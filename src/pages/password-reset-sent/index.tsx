import { type ClassNameProps, cn } from "~/utils/ui";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { Button } from "~/components/ui/button";
import { useCallback } from "react";
import { useRouter } from "next/router";

function PasswordResetSentContent({ className }: ClassNameProps) {
  const router = useRouter();

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <main
      className={cn(
        "flex flex-col items-start justify-start gap-10",
        "px-8 py-10 lg:px-14",
        className,
      )}
    >
      <h1
        className={cn(
          "font-poppins-700 text-headingSecondary md:flex md:flex-row",
          "text-left md:text-right",
          "text-3xl md:text-4xl lg:text-5xl",
        )}
      >
        Email enviado!
      </h1>
      <p className="font-poppins-400 w-76 md:w-96 md:text-justify">
        Fique de olho na caixa de entrada do seu email, talvez você precise
        verificar a sua pasta de spam.
      </p>
      <p className="font-poppins-600  text-bold w-76 md:w-96 md:text-justify">
        Lembre-se: O email pode demorar alguns minutos para chegar.
      </p>
      <Button variant="primary" className="w-40" type="button" onClick={goBack}>
        Voltar
      </Button>
    </main>
  );
}

export default function PasswordResetSent() {
  return (
    <div className="flex min-h-screen flex-grow flex-col-reverse md:flex-col">
      <header className="mb-12 flex items-end justify-center pt-12 md:mb-0 md:justify-end">
        <div className=" block px-12">
          <NossaTerraLogo />
        </div>
      </header>
      <PasswordResetSentContent className="mt-16 flex grow md:mt-0 " />
    </div>
  );
}
