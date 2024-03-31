import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassNameProps, cn } from "~/utils/ui";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
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
import { useCallback, useState } from "react";
import {
  useGreetingSchema,
  type GreetingFields,
} from "../hooks/useGreetingSchema";
import { useLoginRegisterFlow } from "../state/machine";
import { api } from "~/utils/api";
import useScrollToTop from "~/pages/login/LoginRegisterFlow/hooks/useScrolltoTop";
import { Separator } from "~/components/ui/separator";
import { GoogleOAuthButton } from "~/components/common/OAuthButton";

function GreetingContent({ className }: ClassNameProps) {
  const greetingAction = useLoginRegisterFlow((s) => s.greetingAction);

  const schema = useGreetingSchema();
  const form = useForm<GreetingFields>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { checkUserExists } = api.useUtils().auth;
  const onSubmit: SubmitHandler<GreetingFields> = useCallback(
    async ({ email }) => {
      try {
        setIsLoading(true);
        const userExists = await checkUserExists.fetch({ email });
        if (userExists) {
          greetingAction({
            command: "loginFlow",
            data: { email },
            nextStep: "welcomeBack",
          });
        } else {
          greetingAction({
            command: "newUserFlow",
            data: { email },
            nextStep: "chooseRole",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [checkUserExists, greetingAction],
  );

  return (
    <main
      className={cn(
        "flex items-center justify-center md:justify-start",
        className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-[28rem] md:max-w-none",
          "flex flex-col md:flex-row",

          // Align
          "items-center md:items-start",
          "justify-center",

          // Spacing
          "px-8 py-10",
          "gap-10 md:gap-16 lg:gap-28",
        )}
      >
        <h1
          className={cn(
            "font-poppins-700 text-headingPrimary",
            "text-left md:text-right",
            "text-2xl md:text-3xl lg:text-4xl",
          )}
        >
          Seja bem vindo(a) à{" "}
          <span
            className={cn(
              "font-poppins-800 text-headingSecondary",
              "text-3xl md:text-4xl lg:text-5xl",
              "inline-block md:block",
            )}
          >
            Nossa Terra
          </span>
        </h1>

        <Form {...form}>
          <form
            className="w-full md:max-w-xs lg:max-w-sm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <GoogleOAuthButton className="mb-4 w-full justify-center" />

            <div className="flex flex-row items-center gap-4 py-4 text-gray-600">
              <Separator className="flex flex-1 bg-gray-400" />
              ou
              <Separator className="flex flex-1 bg-gray-400" />
            </div>

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
                      className="w-full md:mt-0"
                      placeholder="Email"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button
              isLoading={isLoading}
              variant="primary"
              className="w-full"
              type="submit"
            >
              Continuar
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}

export function GreetingScreen() {
  useScrollToTop();
  return (
    <div className="flex h-screen flex-grow flex-col justify-center">
      <header className="flex  items-start justify-center pt-12 md:justify-end">
        <div className="absolute right-4 top-10 hidden px-12 md:block">
          <NossaTerraLogo />
        </div>
      </header>
      <GreetingContent className="flex " />
      <footer className="flex flex-col justify-center">
        <div className="mt-8 flex justify-center p-12 md:hidden">
          <NossaTerraLogo />
        </div>
      </footer>
    </div>
  );
}
