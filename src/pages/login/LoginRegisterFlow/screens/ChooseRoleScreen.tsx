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
import { RadioGroup } from "~/components/ui/radio-group";
import { RadioGroupItem as RadixRadioGroupItem } from "@radix-ui/react-radio-group";
import { useLoginRegisterFlow } from "../state/machine";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import useScrollToTop from "~/pages/login/LoginRegisterFlow/hooks/useScrolltoTop";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { H3 } from "~/components/ui/typography";
import { type Role } from "@prisma/client";
import { AdsCarouselFooter } from "~/components/common/AdsCarrousel";

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
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>
                  <H3 className="py-2 font-medium">
                    Você deseja se cadastrar como{" "}
                    <span className="font-bold">"Produtor"</span> ou{"  "}
                    <span className="font-bold">"Comprador"</span> ?
                  </H3>
                </FormLabel>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex w-full flex-row flex-wrap gap-8 pb-16 pt-2"
                >
                  <RoleRadioGroupItem
                    title="Produtor"
                    role="seller"
                    description="Ver as ofertas de compras do seu produto e entrar em contato com os compradores!"
                    isSelected={field.value === "seller"}
                  />
                  <RoleRadioGroupItem
                    title="Comprador"
                    role="buyer"
                    description="Faça suas ofertas de compra!"
                    isSelected={field.value === "buyer"}
                  />
                </RadioGroup>
              </FormItem>
            )}
          />
          <Button
            variant="primary"
            className="w-full md:max-w-xs lg:max-w-sm"
            type="submit"
          >
            Continuar
          </Button>
        </form>
      </Form>
    </main>
  );
}

function RoleRadioGroupItem({
  isSelected,
  role,
  title,
  description,
}: {
  isSelected?: boolean;
  role: Role;
  title: string;
  description: string;
}) {
  return (
    <FormItem>
      <FormControl>
        <RadixRadioGroupItem
          value={role}
          className={cn("h-full rounded-lg border-4 border-transparent", {
            "border-basedDark": isSelected,
          })}
        >
          <Card className="relative h-full min-h-36 w-80 bg-cardShade p-4 text-left shadow-lg">
            <div
              className={cn(
                "absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-basedDark p-1 text-cardShade",
                {
                  hidden: !isSelected,
                },
              )}
            >
              <CheckIcon />
            </div>
            <CardHeader className="p-0">
              <CardTitle className="pb-2 text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-md">{description}</p>
            </CardContent>
          </Card>
        </RadixRadioGroupItem>
      </FormControl>
    </FormItem>
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
    <div className="flex h-screen flex-grow flex-col">
      <header className="items-between flex justify-between pt-12">
        <Button
          className="ml-8 gap-3 p-6 text-lg md:mt-8 lg:ml-14"
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
      <AdsCarouselFooter />
    </div>
  );
}
