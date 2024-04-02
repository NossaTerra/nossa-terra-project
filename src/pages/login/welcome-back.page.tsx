import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassNameProps, cn } from "~/utils/ui";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { AdsCarouselFooter } from "~/components/common/AdsCarrousel";
import { PasswordInput } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useCallback, useEffect, useMemo } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";
import { TRPCClientError } from "@trpc/client";
import { type AppRouter } from "~/server/api/routers/_rootRouter";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/router";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { GoogleOAuthButton } from "~/components/common/OAuthButton";

export const getServerSideProps = redirectGetServerSideProps.NoAuthOnly;

export default function WelcomeBackScreen() {
  return (
    <div className="flex min-h-svh flex-grow flex-col">
      <header className="items-between flex justify-between pt-12">
        <Button variant="outline" asChild>
          <Link
            href="/login"
            className="ml-8 gap-2 p-6 text-lg md:mt-8 lg:ml-14"
          >
            <ArrowLeftIcon />
            Voltar
          </Link>
        </Button>
        <div className="hidden px-12 md:block">
          <NossaTerraLogo />
        </div>
      </header>

      <WelcomeBackContent className="flex md:grow" />
      <AdsCarouselFooter />
    </div>
  );
}

function queryParamIntoArray(param: string | string[] | undefined) {
  if (param === undefined) {
    return [];
  }
  if (typeof param === "string") {
    return [param];
  }
  return param;
}

function WelcomeBackContent({ className }: ClassNameProps) {
  const router = useRouter();
  const email = Array.isArray(router.query.email)
    ? router.query.email.at(0)
    : router.query.email;

  const userKeys = queryParamIntoArray(router.query.userKeys);
  const hasGoogleKey = userKeys.includes("google");
  const hasPasswordEmailKey = userKeys.includes("email");

  useEffect(() => {
    if (!email) {
      void router.replace("/login");
    }
  }, [email, router]);

  return (
    <main
      className={cn(
        "flex flex-col items-start justify-start gap-10 md:justify-start",
        "px-8 py-10 lg:px-14",
        className,
      )}
    >
      <h1
        className={cn(
          "font-poppins-800 text-headingSecondary",
          "text-4xl lg:text-5xl",
          "inline-block md:block",
        )}
      >
        Que bom que você voltou!
      </h1>

      <div className="flex flex-col gap-2 text-gray-700">
        <label>Email</label>
        <span>{email ?? "----"}</span>
      </div>

      {hasPasswordEmailKey ? (
        <WelcomeBackPasswordForm />
      ) : (
        <div>{hasGoogleKey && <GoogleOAuthButton />}</div>
      )}
    </main>
  );
}

function WelcomeBackPasswordForm() {
  const router = useRouter();
  const email = Array.isArray(router.query.email)
    ? router.query.email.at(0)
    : router.query.email;

  const schema = useMemo(
    () =>
      z.object({
        password: z
          .string({
            required_error: "Você deve inserir a senha do seu usuário",
          })
          .min(8, { message: "A senha deve ter ao menos 8 caracteres" }),
      }),
    [],
  );

  type FormData = z.infer<typeof schema>;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { setError } = form;
  const { login, loginLoading } = useAuth();

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async ({ password }) => {
      if (!email) {
        return;
      }

      try {
        await login({
          authCredentials: {
            providerId: "email",
            email,
            password,
          },
        });
      } catch (e) {
        if (e instanceof TRPCClientError) {
          const code = (e as TRPCClientError<AppRouter>).data?.code;
          const message =
            code === "UNAUTHORIZED"
              ? `Senha incorreta. Tente novamente ou clique em "Esqueci minha senha."`
              : "Algo deu errado. Tente novamente mais tarde.";

          setError("password", {
            type: "manual",
            message,
          });
        }
      }
    },
    [email, login, setError],
  );

  return (
    <Form {...form}>
      <form
        className="w-full md:max-w-xs lg:max-w-sm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem className="w-full text-gray-700">
              <FormLabel className="block text-sm font-medium" htmlFor="email">
                Senha
              </FormLabel>
              <FormControl>
                <PasswordInput
                  className="mt-3x w-full md:mt-0"
                  placeholder="Senha"
                  {...field}
                  value={field.value ?? ""}
                  type="password"
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button variant="link" asChild className="mt-1 p-0">
          <Link href="/forgot-password">Esqueci a senha</Link>
        </Button>

        <Button
          isLoading={loginLoading}
          variant="primary"
          className="mt-8 w-full"
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </Form>
  );
}
