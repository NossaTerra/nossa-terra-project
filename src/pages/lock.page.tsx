import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export default function AppLockPage() {
  const schema = useMemo(
    () =>
      z.object({
        secret: z.string({ required_error: "Digite um valor" }),
      }),
    [],
  );
  type FormData = z.infer<typeof schema>;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const trySecret = api.secret.trySecret.useMutation();
  const onSubmit = useCallback(
    async ({ secret }: FormData) => {
      try {
        if (await trySecret.mutateAsync(secret)) {
          await router.replace("/");
        } else {
          form.setError("secret", { message: "Código inválido" });
        }
      } catch (e) {
        form.setError("secret", { message: "Erro de conexão" });
      }
    },
    [form, router, trySecret],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex max-w-xl flex-col gap-4 p-5">
          <h1>Digite o código de entrada</h1>
          <FormField
            control={form.control}
            name="secret"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input className="w-full" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button className="w-fit" isLoading={trySecret.isLoading}>
            Confirmar
          </Button>
        </div>
      </form>
    </Form>
  );
}
