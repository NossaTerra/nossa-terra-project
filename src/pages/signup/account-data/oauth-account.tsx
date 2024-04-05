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
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { TermsAndConditionsLink } from "~/components/common/TermsAndConditions";
import { cpfIsCNPJ } from "~/utils/formHelpers";
import { z } from "zod";
import { validateCNPJ, validateCPF } from "~/utils/validators";
import { useSignUpState } from "../useSignUpState";
import type { PermittedRoles } from "~/server/types/user.type";

export function useOAuthAccountDataSchema({
  role,
}: {
  role: (typeof PermittedRoles)["Common"][number] | undefined;
}) {
  return useMemo(
    () =>
      z.object({
        name: z
          .string({ required_error: "Você deve inserir o nome" })
          .min(3, { message: "Nome com ao menos 3 caracteres" })
          .max(120, { message: "Nome deve ter no máximo 120 caracteres" }),
        cpf: z
          .string({
            required_error: "Você deve inserir um CPF ou CNPJ válido",
          })
          .refine(
            (data) =>
              cpfIsCNPJ({ cpf: data, role })
                ? validateCNPJ(data)
                : validateCPF(data),

            (data) => ({
              message: cpfIsCNPJ({ cpf: data, role })
                ? "CNPJ inválido"
                : "CPF inválido",
            }),
          ),
        agreeToTermsAndConditions: z
          .boolean({
            required_error: "Você deve concordar com os Termos e Condições",
          })
          .refine((value) => value === true, {
            message: "Você deve concordar com os Termos e Condições",
          }),
      }),
    [role],
  );
}

export type OAuthAccountData = z.infer<
  ReturnType<typeof useOAuthAccountDataSchema>
>;

export function OAuthAccountDataForm({ className }: ClassNameProps) {
  const { email, role, username, setAccountData } = useSignUpState();

  const schema = useOAuthAccountDataSchema({ role });
  const form = useForm<OAuthAccountData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: username,
    },
  });

  const onSubmit: SubmitHandler<OAuthAccountData> = useCallback(
    async (data) => {
      setAccountData({ isOAuth: true, ...data });
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
                  <Input
                    className="w-full"
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
