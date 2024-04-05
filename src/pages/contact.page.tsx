import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { P } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { type ClassNameProps, cn } from "~/utils/ui";
import { ImageBackgroundFooter } from "~/components/common/ImageBackgroundFooter";

export const getServerSideProps = redirectGetServerSideProps.Common;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ContactScreen({ user }: Props) {
  return (
    <div className="flex h-fit max-h-[100vh] min-h-dvh flex-1 flex-col">
      <div className="z-10">
        <AppHeader user={user} />
        <ContactUsMessage className="px-16" />
      </div>
      <ImageBackgroundFooter src="/images/coffee-envelop-transparent.png" />
    </div>
  );
}

function ContactUsMessage({ className }: ClassNameProps) {
  return (
    <div className={cn("w-fit", className)}>
      <h1 className="mb-8 mt-10 text-2xl font-bold md:text-4xl">
        Fale Conosco
      </h1>
      <div className="max-w-3xl">
        <P className="md:text-lg lg:text-xl">
          Entre em contato consco caso tenha dúvidas, ou esteja passando por
          algum problema com a sua conta nosssa terra.
          <div className="my-4 font-bold">Fone: (XX)XXXX-XXXX </div>
          <div className="font-bold">Email: Contato@nossaterra.com </div>
        </P>
        <P className="md:text-lg lg:text-xl">
          Caso queira anunciar nos banners de anúncio das seções de
          <span className="font-bold"> "Anuncie AQUI" </span>
          também utilize o email ou telefone acima para contato.
        </P>
        <P className="md:text-lg lg:text-xl">Estamos aqui para ajudar!</P>
      </div>
    </div>
  );
}
