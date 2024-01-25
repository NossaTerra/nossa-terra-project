import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassNameProps, cn } from "~/utils/ui";
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
import { useCallback, useMemo } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { emptyString } from "~/utils/constants";
import toast from "react-hot-toast";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { TokenStatus, checkResetPasswordToken } from "~/server/api/auth/token";
import { z } from "zod";

function useResetPasswordSchema() {
  // It's best to use a hook to get the schema because
  // we can later add internationalized error messages

  return useMemo(
    () =>
      z
        .object({
          password: z
            .string({ required_error: "Você deve inserir uma senha" })
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
            .max(30, { message: "A senha deve ter no máximo 30 caracteres" }),

          confirmPassword: z
            .string({
              required_error: "Você deve inserir a confirmação de senha",
            })
            .min(8, {
              message: "A confirmação de senha deve ter no mínimo 8 caracteres",
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "As senhas devem ser iguais",
          path: ["confirmPassword"],
        }),
    [],
  );
}

type ResetPasswordFields = z.infer<
  ReturnType<typeof useResetPasswordSchema>
>;

function ResetPasswordContent({
  className,
  token,
}: ClassNameProps & { token: string }) {
  const schema = useResetPasswordSchema();
  const router = useRouter();

  const form = useForm<ResetPasswordFields>({
    resolver: zodResolver(schema),
  });

  const resetPassword = api.forgetPassword.resetPassword.useMutation();

  const onSubmit: SubmitHandler<ResetPasswordFields> = useCallback(
    async ({ password }) => {
      try {
        await resetPassword.mutateAsync({ password, token });
        toast.success("Senha redefinida com sucesso!", {
          duration: 1400,
        });
        await router.replace("/search");
      } catch (err) {
        toast.error("Erro ao redefinir a senha!");
      }
    },
    [resetPassword, router, token],
  );

  return (
    <main
      className={cn(
        "flex flex-col items-start justify-start gap-8 md:justify-start",
        "px-8 py-6 lg:px-14",
        className,
      )}
    >
      <h1
        className={cn(
          "font-poppins-800 text-headingPrimary",
          "text-4xl lg:text-5xl",
          "inline-block md:block",
        )}
      >
        Redefinir a sua <span className="text-headingSecondary">Senha</span>
      </h1>

      <Form {...form}>
        <form
          className="grid w-full grid-cols-1 justify-start gap-x-16 gap-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="mb-2.5 w-80 text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="password"
                >
                  Nova Senha*
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-80 md:mt-0"
                    placeholder="Senha"
                    {...field}
                    type="password"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem className="mb-2.5 w-80 text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="confirmPassword"
                >
                  Confirmar nova Senha*
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Senha"
                    {...field}
                    type="password"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div>
            <p className="pb-2.5 text-sm">*campo obrigatório</p>
            <Button variant="primary" className="w-80" type="submit">
              Redefinir Senha
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}

export const getServerSideProps = (async (context) => {
  const token = context.query.token;
  if (typeof token !== "string" || token === emptyString) {
    return {
      notFound: true,
    };
  }

  const tokenStatus = await checkResetPasswordToken(token);
  if (tokenStatus === TokenStatus.Good) {
    return {
      props: {
        token,
      },
    };
  }

  // TODO: handle "tokenStatus === TokenStatus.Expired" a little better
  // Maybe show a message to the user?
  return {
    notFound: true,
  };
}) satisfies GetServerSideProps;

export default function ResetPasswordScreen({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  console.log(token);

  return (
    <div className="flex min-h-screen flex-grow flex-col">
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
      <ResetPasswordContent token={token} />
    </div>
  );
}