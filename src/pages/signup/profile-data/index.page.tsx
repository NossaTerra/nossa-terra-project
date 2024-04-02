import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { useRouter } from "next/router";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { useSignUpState } from "../useSignUpState";
import { BuyerForm, type BuyerFormProps } from "./buyer-form";
import { SellerForm, type SellerFormProps } from "./seller-form";
import { useCallback } from "react";
import { api } from "~/utils/api";
import useZipCodeToast from "./hooks/useZipCodeToast";
import toast from "react-hot-toast";

export const getServerSideProps = redirectGetServerSideProps.NoAuthOnly;

export default function ProfileDataScreen() {
  useZipCodeToast();
  const router = useRouter();
  const { email, role, accountData, picture } = useSignUpState();

  const registerAndLogin = api.auth.registerAndLogin.useMutation();
  const onBuyerSuccessSubmit: BuyerFormProps["onSuccess"] = useCallback(
    async ({ data }) => {
      if (!email || !accountData) {
        return;
      }

      if (accountData.isOAuth) {
        await registerAndLogin.mutateAsync({
          attributes: {
            role: "buyer",
            email,
            ...data,
            ...accountData,
          },
          authCredentials: {
            providerId: "google",
          },
        });
        toast.success("Cadastro feito com sucesso!");
        await router.push("/");
        return;
      }

      const { password, ...rest } = accountData;
      await registerAndLogin.mutateAsync({
        attributes: {
          role: "buyer",
          email,
          ...data,
          ...rest,
        },
        authCredentials: {
          providerId: "email",
          email,
          password,
        },
      });
      toast.success("Cadastro feito com sucesso!");
      await router.push("/");
      return;
    },
    [accountData, email, registerAndLogin, router],
  );

  const onSellerSuccessSubmit: SellerFormProps["onSuccess"] = useCallback(
    async ({ data }) => {
      if (!email || !accountData) {
        return;
      }

      if (accountData.isOAuth) {
        await registerAndLogin.mutateAsync({
          attributes: {
            role: "seller",
            email,
            ...data,
            ...accountData,
          },
          authCredentials: {
            providerId: "google",
          },
        });
        await router.push("/");
        return;
      }

      const { password, ...rest } = accountData;
      await registerAndLogin.mutateAsync({
        attributes: {
          role: "seller",
          email,
          ...data,
          ...rest,
        },

        authCredentials: {
          providerId: "email",
          email,
          password,
        },
      });
      await router.push("/");
      return;
    },
    [accountData, email, registerAndLogin, router],
  );

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

      {role === "buyer" ? (
        <BuyerForm
          className="px-8 pb-12 lg:px-12"
          onSuccess={onBuyerSuccessSubmit}
          isLoading={registerAndLogin.isLoading}
          formProps={{
            defaultValues: {
              avatarImage: picture,
            },
          }}
        />
      ) : (
        <SellerForm
          className="px-8 pb-12 lg:px-12"
          onSuccess={onSellerSuccessSubmit}
          isLoading={registerAndLogin.isLoading}
        />
      )}
    </div>
  );
}
