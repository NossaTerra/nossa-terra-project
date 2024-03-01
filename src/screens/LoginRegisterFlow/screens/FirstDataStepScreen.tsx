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
import { useCallback } from "react";
import { useLoginRegisterFlow } from "../state/machine";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import {
  type FirstDataStepFields,
  useFirstDataStepSchema,
} from "../hooks/useFirstDataStepSchema";
import { Input, PasswordInput } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { formatCPF, formatCNPJ, lengthFormattedCNPJ } from "~/utils/formatters";
import { TermsAndConditionsLink } from "~/components/common/TermsAndConditions";
import { cpfIsCNPJ } from "~/utils/formHelpers";

function FirstDataStepContent({ className }: ClassNameProps) {
  const { state } = useLoginRegisterFlow();

  const schema = useFirstDataStepSchema(
    state.stepKey === "firstDataStep"
      ? state.accumulatedContext.role
      : undefined,
  );
  const form = useForm<FirstDataStepFields>({
    resolver: zodResolver(schema),
  });

  const firstDataStepAction = useLoginRegisterFlow(
    (s) => s.firstDataStepAction,
  );

  const onSubmit: SubmitHandler<FirstDataStepFields> = useCallback(
    async ({
      name,
      cpf,
      password,
      confirmPassword,
      agreeToTermsAndConditions,
    }) => {
      if (state.stepKey !== "firstDataStep") {
        return;
      }
      const { role } = state.accumulatedContext;

      if (role === "seller") {
        firstDataStepAction({
          command: "nextSeller",
          data: {
            name,
            cpf,
            password,
            confirmPassword,
            agreeToTermsAndConditions,
          },
          nextStep: "secondDataStepSeller",
        });
        return;
      }

      if (role === "buyer") {
        firstDataStepAction({
          command: "nextBuyer",
          data: {
            name,
            cpf,
            password,
            confirmPassword,
            agreeToTermsAndConditions,
          },
          nextStep: "secondDataStepBuyer",
        });
        return;
      }
    },
    [state.stepKey, state.accumulatedContext, firstDataStepAction],
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
        <span className="opacity-60">
          {state.stepKey === "firstDataStep"
            ? state.accumulatedContext.email
            : "----"}
        </span>
      </div>

      <div className="flex flex-col gap-2 font-bold">
        <label>Modalidade</label>
        <div className="flex flex-row items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-headingSecondary">
            <CheckIcon className="text-white" size={18} />
          </div>
          <span>
            {state.stepKey === "firstDataStep"
              ? state.accumulatedContext.role === "seller"
                ? "Produtor"
                : "Comprador"
              : "----"}
          </span>
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
                  {state.stepKey === "firstDataStep"
                    ? state.accumulatedContext.role === "seller"
                      ? "Nome*"
                      : "Nome da empresa*"
                    : "----"}
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
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
                  {state.stepKey === "firstDataStep"
                    ? state.accumulatedContext.role === "seller"
                      ? "CPF/CNPJ*"
                      : "CNPJ*"
                    : "----"}
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="xxx.xxx.xxx-xx"
                    {...field}
                    value={
                      state.stepKey === "firstDataStep" &&
                      cpfIsCNPJ({
                        cpf: field.value ?? "",
                        role: state.accumulatedContext.role,
                      })
                        ? formatCNPJ(field?.value ?? "")
                        : formatCPF(field?.value ?? "")
                    }
                    maxLength={lengthFormattedCNPJ}
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

export function FirstDataStepScreen() {
  const firstDataStepAction = useLoginRegisterFlow(
    (s) => s.firstDataStepAction,
  );

  const goBack = useCallback(
    () =>
      firstDataStepAction({
        command: "goBack",
        nextStep: "chooseRole",
      }),
    [firstDataStepAction],
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
      <FirstDataStepContent />
    </div>
  );
}
