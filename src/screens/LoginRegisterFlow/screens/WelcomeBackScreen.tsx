import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassNameProps, cn } from "~/utils/ui";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import ImageCarousel from "~/components/common/ImageCarrousel";
import { Input } from "~/components/ui/input";
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
import { useCallback } from "react";
import {
  type WelcomeBackFields,
  useWelcomeBackSchema,
} from "../hooks/useWelcomeBackSchema";
import { useLoginRegisterFlow } from "../state/machine";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";
import { TRPCClientError } from "@trpc/client";
import { type AppRouter } from "~/server/api/routers/_rootRouter";
import Link from "next/link";
import useScrollToTop from "~/screens/LoginRegisterFlow/hooks/useScrolltoTop";

function WelcomeBackContent({ className }: ClassNameProps) {
  const { state, resetState } = useLoginRegisterFlow();

  const schema = useWelcomeBackSchema();
  const form = useForm<WelcomeBackFields>({
    resolver: zodResolver(schema),
  });
  const { setError } = form;
  const { login } = useAuth();

  const onSubmit: SubmitHandler<WelcomeBackFields> = useCallback(
    async ({ password }) => {
      if (state.stepKey !== "welcomeBack") {
        return;
      }
      const { email } = state.accumulatedContext;

      try {
        await login({
          email,
          password,
        });
        resetState();
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
    [login, resetState, setError, state.accumulatedContext, state.stepKey],
  );

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
        <span>
          {state.stepKey === "welcomeBack"
            ? state.accumulatedContext.email
            : "----"}
        </span>
      </div>

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
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="email"
                >
                  Senha
                </FormLabel>
                <FormControl>
                  <Input
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

          <Button variant="primary" className="mt-8 w-full" type="submit">
            Entrar
          </Button>
        </form>
      </Form>
    </main>
  );
}

export function WelcomeBackScreen() {
  useScrollToTop();
  const { welcomeBackAction } = useLoginRegisterFlow();

  const goBack = useCallback(
    () =>
      welcomeBackAction({
        command: "goBack",
        nextStep: "greeting",
      }),
    [welcomeBackAction],
  );

  return (
    <div className="flex min-h-screen flex-grow flex-col">
      <header className="items-between flex justify-between pt-12">
        <Button
          className="ml-8 mt-8 gap-3 p-6 text-lg lg:ml-14"
          variant="outline"
          onClick={goBack}
        >
          <ArrowLeftIcon />
          Voltar
        </Button>
        <div className="hidden px-12 md:block">
          <NossaTerraLogo />
        </div>
      </header>

      <WelcomeBackContent className="flex grow" />

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
