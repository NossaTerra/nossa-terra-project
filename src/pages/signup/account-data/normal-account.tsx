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
import { CheckIcon } from "lucide-react";
import { Input, MaskedInput, PasswordInput } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { TermsAndConditionsLink } from "~/components/common/TermsAndConditions";
import { z } from "zod";
import { useSignUpState } from "../useSignUpState";
import { useOAuthAccountDataSchema } from "./oauth-account";
import type { PermittedRoles } from "~/server/types/user.type";

function useAccountDataSchema({
  role,
}: {
  role: (typeof PermittedRoles)["Common"][number] | undefined;
}) {
  const oauthAccountSchema = useOAuthAccountDataSchema({ role });

  return useMemo(
    () =>
      oauthAccountSchema
        .merge(
          z.object({
            password: z
              .string({ required_error: "Você deve inserir uma senha" })
              .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
              .max(30, { message: "A senha deve ter no máximo 30 caracteres" })
              .refine((value) => /[A-Z]/.test(value), {
                message:
                  "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número",
              })
              .refine((value) => /[a-z]/.test(value), {
                message:
                  "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número",
              })
              .refine((value) => /\d/.test(value), {
                message:
                  "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número",
              }),
            confirmPassword: z
              .string({
                required_error: "Você deve inserir a confirmação de senha",
              })
              .min(8, {
                message:
                  "A confirmação de senha deve ter no mínimo 8 caracteres",
              }),
          }),
        )
        .refine((data) => data.password === data.confirmPassword, {
          message: "As senhas devem ser iguais",
          path: ["confirmPassword"],
        }),
    [oauthAccountSchema],
  );
}

export type AccountData = z.infer<ReturnType<typeof useAccountDataSchema>>;

export function AccountDataForm({ className }: ClassNameProps) {
  const { email, role, setAccountData } = useSignUpState();

  const schema = useAccountDataSchema({ role });
  const form = useForm<AccountData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<AccountData> = useCallback(
    async (data) => {
      setAccountData({ isOAuth: false, ...data });
    },
    [setAccountData],
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
        Vamos fazer o seu{" "}
        <span className="text-headingSecondary">cadastro</span>
      </h1>

      <div className="flex flex-col gap-2 font-bold">
        <label>Email</label>
        <span className="opacity-60">{email ?? "----"}</span>
      </div>

      <div className="flex flex-col gap-2 font-bold">
        <label>Modalidade</label>
        <div className="flex flex-row items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-headingSecondary">
            <CheckIcon className="text-white" size={18} />
          </div>
          <span>{role === "seller" ? "Produtor" : "Comprador"}</span>
        </div>
      </div>

      <Form {...form}>
        <form
          className="grid w-full grid-cols-1 justify-start gap-x-16 gap-y-6 md:max-w-[72vw] md:grid-cols-2 lg:ml-0 lg:max-w-[51vw]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel className="block text-sm font-medium" htmlFor="name">
                  {role === "seller" ? "Nome*" : "Nome da empresa*"}
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Nome"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel className="block text-sm font-medium" htmlFor="cpf">
                  {role === "seller" ? "CPF/CNPJ*" : "CNPJ*"}
                </FormLabel>
                <FormControl>
                  <MaskedInput
                    className="w-full"
                    placeholder="xxx.xxx.xxx-xx"
                    maskPreset={role === "buyer" ? "CNPJ" : "CPF_or_CNPJ"}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="mb-2.5 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="password"
                >
                  Senha*
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    className="w-full"
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
              <FormItem className="mb-2.5 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="confirmPassword"
                >
                  Confirmar Senha*
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    className="w-full"
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
            name="agreeToTermsAndConditions"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div className="mt-5 flex flex-row rounded-md border p-1.5 pl-2.5">
                    <Checkbox
                      id="terms"
                      className="mr-2 self-center"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="terms" className="font-poppins-400 text-sm">
                      Aceitar <TermsAndConditionsLink />
                    </label>
                  </div>
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div>
            <p className="pb-2.5 text-sm">*campo obrigatório</p>
            <Button variant="primary" className="w-full" type="submit">
              Continuar
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
