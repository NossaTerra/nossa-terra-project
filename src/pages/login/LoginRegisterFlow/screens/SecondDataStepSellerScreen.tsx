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
import { ArrowLeftIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  type SecondDataStepSellerFields,
  useSecondDataStepSellerSchema,
} from "../hooks/useSecondDataStepSellerSchema";
import {
  formatPhone,
  formatRG,
  formatZIPCode,
  lengthFormattedZIPCode,
} from "~/utils/formatters";
import { emptyString } from "~/utils/constants";
import { Checkbox } from "~/components/ui/checkbox";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useAutomaticAddressFill } from "../hooks/useAutomaticAddressFill";
import { type User } from "lucia";
import { ProfileButton } from "~/components/forms/profileButton";
import useScrollToTop from "~/pages/login/LoginRegisterFlow/hooks/useScrolltoTop";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";
import useZipCodeToast from "../hooks/useZipCodeToast";
import { useState } from "react";
import toast from "react-hot-toast";

export function SellerForm({
  user,
  isEditingProfile = false,
}: Partial<ClassNameProps & { user?: User } & { isEditingProfile?: boolean }>) {
  const { state, resetState } = useLoginRegisterFlow();

  const schema = useSecondDataStepSellerSchema();
  const toastRefId = useZipCodeToast().current;

  const form = useForm<SecondDataStepSellerFields>({
    resolver: zodResolver(schema),
    mode: isEditingProfile ? "onChange" : "onSubmit",
    defaultValues: {
      rg: user?.rg ?? emptyString,
      phone: user?.phone ?? emptyString,
      phoneUsesWhatsapp: user?.phoneUsesWhatsapp ?? false,
      zipCode: user?.zipCode ?? emptyString,
      city: user?.city ?? emptyString,
      province: user?.province ?? emptyString,
      street: user?.street ?? emptyString,
      district: user?.district ?? emptyString,
      streetNumber: user?.streetNumber ?? emptyString,
      complementary: user?.complementary ?? emptyString,
    },
  });

  const {
    latitude,
    longitude,
    cityInputRef,
    provinceInputRef,
    streetInputRef,
    districtInputRef,
  } = useAutomaticAddressFill({ form });

  const register = api.auth.registerSeller.useMutation({
    onError() {
      toast.error("Erro ao se Registrar no Nossa Terra");
    },
  });
  const login = api.auth.login.useMutation({
    onError() {
      toast.error("Erro ao entrar no Nossa Terra");
    },
  });
  const router = useRouter();
  const isLoadingRegistration = register.isLoading;

  const onSubmitUserCreation: SubmitHandler<SecondDataStepSellerFields> =
    useCallback(
      async ({
        rg,
        zipCode,
        city,
        province,
        street,
        district,
        complementary,
        streetNumber,
        phone,
        phoneUsesWhatsapp,
      }) => {
        if (state.stepKey !== "secondDataStepSeller") {
          return;
        }
        const { email, name, password, cpf } = state.accumulatedContext;
        try {
          await register.mutateAsync({
            email,
            name,
            cpf,
            password,
            rg,
            social: {
              phone: formatPhone(phone),
              phoneUsesWhatsapp,
            },
            address: {
              zipCode,
              city,
              province,
              street,
              district,
              complementary,
              streetNumber,
              latitude,
              longitude,
            },
          });

          await login.mutateAsync({
            email,
            password,
          });
          await router.replace("/");
          toast.remove(toastRefId);
          resetState();
        } catch {
          console.log("Error registering seller");
        }
      },
      [
        state.stepKey,
        state.accumulatedContext,
        register,
        latitude,
        longitude,
        login,
        router,
        toastRefId,
        resetState,
      ],
    );

  const showTip = form.formState.isDirty && isEditingProfile;
  return (
    <div className="flex w-full flex-col">
      {showTip && (
        <div className="animate-fade-in font-poppins-400 mb-6 mt-4 text-sm ">
          <span className="relative flex h-3 w-3">
            <span className="absolute top-2 inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative top-2 inline-flex h-3 w-3 rounded-full bg-accent"></span>
          </span>
          <span className="ml-0.5 block px-3 pb-3">
            Clique em salvar alterações para completar edição
          </span>
        </div>
      )}
      <Form {...form}>
        <form
          className="grid w-full grid-cols-1 justify-start gap-x-16 gap-y-6 md:max-w-[72vw] md:grid-cols-2 lg:ml-0 lg:max-w-[51vw]"
          onSubmit={form.handleSubmit(onSubmitUserCreation)}
        >
          <FormField
            control={form.control}
            name="rg"
            render={({ field, fieldState }) => (
              <FormItem className="w-full text-gray-700">
                <FormLabel className="block text-sm font-medium" htmlFor="rg">
                  RG*
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="RG"
                    {...field}
                    value={formatRG(field.value ?? emptyString)}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem className="w-full text-gray-700">
                  <FormLabel
                    className="block text-sm font-medium"
                    htmlFor="phone"
                  >
                    Telefone*
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-3x w-full md:mt-0"
                      placeholder="(XX) XXXXX-XXXX"
                      {...field}
                      value={formatPhone(field.value) ?? emptyString}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneUsesWhatsapp"
              render={({ field, fieldState }) => (
                <FormItem className="ml-0.5">
                  <FormControl>
                    <div className="p-l-1 mb-1.5 mt-2 flex flex-row">
                      <Checkbox
                        id="acceptWhatsapp"
                        className="mr-2 self-center"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="acceptWhatsapp" className="text-sm">
                        <div className="mt-1 flex flex-row items-center justify-center">
                          <span className="mr-1.5"> Aceita Whatsapp </span>
                          <Image
                            priority
                            src="/images/icons/whatsapp-icon.svg"
                            height={19}
                            width={19}
                            alt="WhatsApp Icon"
                          />
                        </div>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field, fieldState }) => (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="cursor-pointer" asChild>
                    <FormItem className="mb-4 w-full text-gray-700">
                      <FormLabel
                        className="block text-sm font-medium"
                        htmlFor="zipCode"
                      >
                        CEP*
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mt-3x w-full md:mt-0"
                          maxLength={lengthFormattedZIPCode}
                          placeholder="Ex: 99999- 999"
                          {...field}
                          value={formatZIPCode(field.value)}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="mt-2 text-sm ">
                      Mora na zona rural e não possui CEP? Basta Adicionar um
                      CEP qualquer de seu município
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel className="block text-sm font-medium" htmlFor="city">
                  Cidade*
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Cidade"
                    {...field}
                    ref={cityInputRef}
                    value={field.value ?? emptyString}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="province"
                >
                  Estado*
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Estado"
                    {...field}
                    ref={provinceInputRef}
                    value={field.value ?? emptyString}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="street"
                >
                  <div>
                    {" "}
                    <MapPin className="mr-1 inline h-4 w-4" />
                    Endereço*
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Endereço"
                    {...field}
                    ref={streetInputRef}
                    value={field.value ?? emptyString}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="district"
                >
                  Bairro
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Bairro"
                    {...field}
                    ref={districtInputRef}
                    value={field.value ?? emptyString}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetNumber"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="streetNumber"
                >
                  Número
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Número"
                    {...field}
                    value={field.value ?? emptyString}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complementary"
            render={({ field, fieldState }) => (
              <FormItem className="mt-1 w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="complementary"
                >
                  Complemento
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="Complemento"
                    {...field}
                    value={field.value ?? emptyString}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <ProfileButton
            isLoadingRegistration={isLoadingRegistration}
            isEditing={isEditingProfile}
            user={user}
            form={form}
            userLatitude={latitude}
            userLongitude={longitude}
          />
        </form>
      </Form>
    </div>
  );
}

export function SecondDataStepSellerScreen() {
  useScrollToTop();

  const secondDataStepSellerAction = useLoginRegisterFlow(
    (s) => s.secondDataStepSellerAction,
  );

  const goBack = useCallback(
    () =>
      secondDataStepSellerAction({
        command: "goBack",
        nextStep: "firstDataStep",
      }),
    [secondDataStepSellerAction],
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
      <main
        className={cn(
          "flex flex-col items-start justify-start gap-8 md:justify-start",
          "px-8 py-6 lg:px-14",
        )}
      >
        <h1
          className={cn(
            "font-poppins-800 text-headingPrimary",
            "text-4xl lg:text-5xl",
            "inline-block md:block",
          )}
        >
          Estamos <span className="text-headingSecondary">quase lá!</span>
        </h1>
        <SellerForm />
      </main>
    </div>
  );
}
