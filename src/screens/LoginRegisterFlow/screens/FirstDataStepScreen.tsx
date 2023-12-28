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
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

function FirstDataStepContent({ className }: ClassNameProps) {
  const { state, resetState } = useLoginRegisterFlow();

  const schema = useFirstDataStepSchema();
  const form = useForm<FirstDataStepFields>({
    resolver: zodResolver(schema),
  });

  const register = api.auth.register.useMutation();
  const login = api.auth.login.useMutation();
  const router = useRouter();

  const onSubmit: SubmitHandler<FirstDataStepFields> = useCallback(
    async ({ name, cpf, password }) => {
      if (state.stepKey !== "firstDataStep") {
        return;
      }
      const { email, role } = state.accumulatedContext;
      await register.mutateAsync({
        email,
        name,
        cpf,
        password,
        role,
      });
      await login.mutateAsync({
        email,
        password,
      });
      await router.replace("/search");
      resetState();
    },
    [
      state.stepKey,
      state.accumulatedContext,
      register,
      login,
      router,
      resetState,
    ],
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
          className="w-full md:max-w-xs lg:max-w-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="email"
                >
                  Nome
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
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="email"
                >
                  CPF / CNPJ
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="xxx.xxx.xxx-xx"
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
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
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
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="email"
                >
                  Confirmar Senha
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
          <Button variant="primary" className="w-full" type="submit">
            Continuar
          </Button>
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
