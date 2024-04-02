import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { useSignUpState } from "../useSignUpState";
import { useRouter } from "next/router";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { OAuthAccountDataForm } from "./oauth-account";
import { AccountDataForm } from "./normal-account";

export const getServerSideProps = redirectGetServerSideProps.NoAuthOnly;

export default function AccountDataScreen() {
  const router = useRouter();
  const { isOAuth } = useSignUpState();

  return (
    <div className="flex min-h-svh flex-grow flex-col">
      <header className="items-between flex justify-between pt-12">
        <Button
          className="ml-8 mt-8 gap-3 p-6 text-lg lg:ml-14"
          variant="outline"
          onClick={router.back}
        >
          <ArrowLeftIcon />
          Voltar
        </Button>
        <div className="hidden px-12 md:block">
          <NossaTerraLogo />
        </div>
      </header>

      {isOAuth ? <OAuthAccountDataForm /> : <AccountDataForm />}
    </div>
  );
}
