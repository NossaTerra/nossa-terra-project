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
import { api } from "~/utils/api";
import { ArrowLeftIcon } from "lucide-react";
import router, { useRouter } from "next/router";
import {
  useForgotPasswordSchema,
  type ForgotPasswordFields,
} from "~/screens/LoginRegisterFlow/hooks/useForgotPasswordSchema";
import toast from "react-hot-toast";

function ForgetPasswordContent({ className }: ClassNameProps) {
  const schema = useForgotPasswordSchema();
  const form = useForm<ForgotPasswordFields>({
    resolver: zodResolver(schema),
  });

  const generatePasswordResetToken =
    api.forgetPassword.generatePasswordResetToken.useMutation();
  const sendPasswordReset =
    api.forgetPassword.sendResetPasswordEmail.useMutation();

  const { getUserByEmail } = api.useUtils().auth;

  const onSubmit: SubmitHandler<ForgotPasswordFields> = useCallback(
    async ({ email }) => {
      try {
        const user = await getUserByEmail.fetch({ email });
        if (!user) {
          return new Response(
            JSON.stringify({
              error: "User does not exist",
            }),
            {
              status: 400,
            },
          );
        }
        const token = await generatePasswordResetToken.mutateAsync({
          userId: user.id,
        });
        await sendPasswordReset.mutateAsync({ email: user.email, token });
        await router.replace(`/password-reset-sent`);
        return new Response();
      } catch (e) {
        toast.error("Erro ao enviar o email");
        return new Response(
          JSON.stringify({
            error: "An unknown error occurred",
          }),
          {
            status: 500,
          },
        );
      }
    },
    [generatePasswordResetToken, getUserByEmail, sendPasswordReset],
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
          "font-poppins-700 text-headingPrimary md:flex md:flex-row",
          "text-left md:text-right",
          "text-3xl md:text-4xl lg:text-5xl",
        )}
      >
        Esqueceu a sua{" "}
        <span
          className={cn(
            "font-poppins-800 text-headingSecondary md:ml-2",
            "text-3xl md:text-4xl lg:text-5xl",
            "inline-block md:block",
          )}
        >
          Senha?
        </span>
      </h1>
      <h4 className="font-poppins-600 w-76 text-justify md:w-96">
        Não se preocupe, digite seu endereço de email abaixo e vamos enviar um
        link para você redefinir a sua senha.
      </h4>
      <Form {...form}>
        <form
          className="w-full md:max-w-xs lg:max-w-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="email"
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="email"
                    {...field}
                    value={field.value ?? ""}
                    type="email"
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button variant="primary" className="w-full" type="submit">
            Enviar
          </Button>
        </form>
      </Form>
    </main>
  );
}

export default function ForgetPasswordScreen() {
  const router = useRouter();

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

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

      <ForgetPasswordContent className="flex grow" />

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
