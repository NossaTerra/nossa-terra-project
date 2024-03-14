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
import {
  type ChooseRoleFields,
  useChooseRoleSchema,
} from "../hooks/useChooseRoleSchema";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useLoginRegisterFlow } from "../state/machine";
import { ArrowLeftIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import useScrollToTop from "~/pages/login/LoginRegisterFlow/hooks/useScrolltoTop";

function ChooseRoleContent({ className }: ClassNameProps) {
  const { state, chooseRoleAction } = useLoginRegisterFlow();

  const schema = useChooseRoleSchema();
  const form = useForm<ChooseRoleFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ChooseRoleFields> = useCallback(
    ({ role }) => {
      chooseRoleAction({
        command: "next",
        data: {
          role,
        },
        nextStep: "firstDataStep",
      });
    },
    [chooseRoleAction],
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
          {state.stepKey === "chooseRole"
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
            name="role"
            render={({ field }) => (
              // TODO: Style radio buttons like cards
              // Look at this example which styles the "Theme" radio buttons like so
              // @link https://ui.shadcn.com/examples/forms/appearance
              // @link https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/appearance/appearance-form.tsx
              <FormItem className="mb-4 space-y-6">
                <h2 className="text-2xl font-bold">Qual a sua modalidade?</h2>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="buyer" />
                      </FormControl>
                      <FormLabel>Comprador</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="seller" />
                      </FormControl>
                      <FormLabel>Produtor</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
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

export function ChooseRoleScreen() {
  const { chooseRoleAction } = useLoginRegisterFlow();
  useScrollToTop();

  const goBack = useCallback(
    () =>
      chooseRoleAction({
        command: "goBack",
        nextStep: "greeting",
      }),
    [chooseRoleAction],
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
      <ChooseRoleContent />
    </div>
  );
}
