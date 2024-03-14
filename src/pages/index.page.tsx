import { type InferGetServerSidePropsType } from "next";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { cn } from "~/utils/ui";
import Image from "next/image";

export const getServerSideProps = redirectGetServerSideProps.MaybeAuthed;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SearchScreen({ user }: Props) {
  return (
    <>
      <AppHeader user={user} hideLogo />

      <div className="p-10">
        <div className="flex flex-col items-center gap-8 px-8 sm:flex-row sm:gap-16 sm:px-16">
          <Image
            src="/images/logo-no-background.png"
            width={200}
            height={114}
            priority
            alt="Nossa terra logo"
          />
          <h1
            className={cn(
              "font-poppins-700 text-headingPrimary",
              "text-left",
              "text-xl md:text-2xl lg:text-3xl",
            )}
          >
            Seja bem vindo(a) à{" "}
            <span
              className={cn(
                "font-poppins-700 text-headingSecondary",
                "text-4xl md:text-5xl lg:text-6xl",
                "block",
              )}
            >
              Nossa Terra
            </span>
          </h1>
        </div>
      </div>
    </>
  );
}
