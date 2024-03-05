import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import Image from "next/image";
import Link from "next/link";
import { H1, P } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { linkClassNames } from "~/components/ui/button";
import { type ClassNameProps, cn } from "~/utils/ui";

export const getServerSideProps = redirectGetServerSideProps.BuyerOnly;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function MyListingsScreen({ user }: Props) {
  if (user.activeState !== "active") {
    return (
      <div className="flex h-fit min-h-dvh flex-1 flex-col">
        <div className="z-10">
          <AppHeader user={user} />
          {user.activeState === "inactive" && (
            <PendingActivationMessage className="px-16" />
          )}
          {user.activeState === "inactive_payment_problem" && (
            <InactivePaymentMessage className="px-16" />
          )}
        </div>

        <ImageBackgroundFooter src="/images/coffee-envelop-transparent.png" />
      </div>
    );
  }

  return (
    <div>
      <AppHeader user={user} />
      <div className="px-10">
        <H1>Meus Anúncios</H1>

        <div className="mt-5">
          <Link href="/listings/new" className={linkClassNames}>
            Criar Novo Anúncio
          </Link>
        </div>
      </div>
    </div>
  );
}

// NOTE: Possible optimization to reduce image sizes.
// Serve a JPG with a circular gradient mask (which could be from a file or made programatically via "CSS").
function ImageBackgroundFooter({ src }: { src: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none z-0 -mt-[30vw] flex min-h-[70vh] flex-1 flex-col items-end justify-end overflow-hidden",
      )}
    >
      <div className="relative -mb-32 flex h-full max-h-[70vh] w-full flex-1">
        <Image
          src={src}
          objectFit="contain"
          objectPosition="right 0% bottom 50%"
          alt="Imagem de fundo"
          fill
        />
      </div>
    </div>
  );
}

function PendingActivationMessage({ className }: ClassNameProps) {
  return (
    <div className={cn("w-fit", className)}>
      <H1>Aguardando Aprovação</H1>
      <div className="max-w-3xl">
        <P className="md:text-lg lg:text-xl">
          Para que possa fazer seus anúncios, seu cadastro está em análise pelo
          nosso time. Esse processo pode levar até{" "}
          <span className="font-bold">2 dias</span> úteis.
        </P>
        <P className="md:text-lg lg:text-xl">
          Se tiver alguma dúvida ou precisar de ajuda durante esse período,
          fique à vontade para
          <Link href="/contact" className={cn(linkClassNames, "px-1")}>
            entrar em contato
          </Link>
        </P>
        <P className="md:text-lg lg:text-xl">Estamos aqui para ajudar!</P>
      </div>
    </div>
  );
}

function InactivePaymentMessage({ className }: ClassNameProps) {
  return (
    <div className={cn("w-fit", className)}>
      <H1>Atualização de Pagamento Necessária</H1>
      <div className="max-w-3xl">
        <P className="md:text-lg lg:text-xl">
          Seu último pagamento não foi processado e seus anúncios foram pausados
          temporariamente. Atualize suas informações de pagamento para retomar
          os seus anúncios.
        </P>
        <P className="md:text-lg lg:text-xl">
          Para ajuda ou mais informações{" "}
          <Link href="/contact" className={cn(linkClassNames, "px-1")}>
            entre em contato
          </Link>
        </P>
        <P className="md:text-lg lg:text-xl">Estamos aqui para ajudar!</P>
      </div>
    </div>
  );
}
