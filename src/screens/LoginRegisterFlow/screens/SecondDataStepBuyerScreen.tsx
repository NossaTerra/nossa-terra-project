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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";
import { useCallback } from "react";
import { useLoginRegisterFlow } from "../state/machine";
import { ArrowLeftIcon } from "lucide-react";
import { NossaTerraLogo } from "~/components/common/NossaTerraLogo";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  type SecondDataStepBuyerFields,
  useSecondDataStepBuyerSchema,
} from "../hooks/useSecondDataStepBuyerSchema";
import {
  formatPhone,
  formatZIPCode,
  lengthFormattedZIPCode,
} from "~/utils/formatters";
import { emptyString } from "~/utils/constants";
import { Checkbox } from "~/components/ui/checkbox";
import { MapPin } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import {
  BusinessSector,
  BusinessSectorLabel,
  type User,
} from "~/server/types/user.type";
import { useAutomaticAddressFill } from "../hooks/useAutomaticAddressFill";
import { AvatarUpload } from "~/components/common/AvatarUpload";
import { ProfileButton } from "~/components/forms/profileButton";
import useScrollToTop from "~/screens/LoginRegisterFlow/hooks/useScrolltoTop";
import useZipCodeToast from "~/screens/LoginRegisterFlow/hooks/useZipCodeToast";
import { toast } from "react-hot-toast";

export function BuyerForm({
  className,
  user,
  isEditingProfile = false,
}: Partial<ClassNameProps & { user?: User } & { isEditingProfile?: boolean }>) {
  const { state, resetState } = useLoginRegisterFlow();
  const toastRefId = useZipCodeToast().current;

  const schema = useSecondDataStepBuyerSchema();
  const form = useForm<SecondDataStepBuyerFields>({
    resolver: zodResolver(schema),
    mode: isEditingProfile ? "onChange" : "onSubmit",
    defaultValues: {
      avatarImage: user?.avatarImage ?? emptyString,
      phone: user?.phone ?? emptyString,
      secondaryPhone: user?.secondaryPhone ?? emptyString,
      phoneUsesWhatsapp: user?.phoneUsesWhatsapp ?? false,
      secondaryPhoneUsesWhatsapp: user?.secondaryPhoneUsesWhatsapp ?? false,
      instagram: user?.instagram ?? emptyString,
      zipCode: user?.zipCode ?? emptyString,
      city: user?.city ?? emptyString,
      province: user?.province ?? emptyString,
      street: user?.street ?? emptyString,
      district: user?.district ?? emptyString,
      streetNumber: user?.streetNumber ?? emptyString,
      complementary: user?.complementary ?? emptyString,
      businessMainSector: user?.businessMainSector ?? undefined,
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

  const registerBuyer = api.auth.registerBuyer.useMutation();
  const login = api.auth.login.useMutation();
  const router = useRouter();

  const onSubmitUserCreation: SubmitHandler<SecondDataStepBuyerFields> =
    useCallback(
      async ({
        avatarImage,
        zipCode,
        city,
        province,
        street,
        district,
        complementary,
        streetNumber,
        phone,
        phoneUsesWhatsapp,
        secondaryPhone,
        secondaryPhoneUsesWhatsapp,
        instagram,
        businessMainSector,
      }) => {
        if (state.stepKey !== "secondDataStepBuyer") {
          return;
        }

        const { email, name, password, cpf } = state.accumulatedContext;

        await registerBuyer.mutateAsync({
          email,
          name,
          cpf,
          password,
          businessMainSector,
          avatarImage,
          social: {
            phone: formatPhone(phone),
            phoneUsesWhatsapp,
            secondaryPhone: secondaryPhone
              ? formatPhone(secondaryPhone)
              : undefined,
            secondaryPhoneUsesWhatsapp,
            instagram,
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

        await router.replace("/search");
        toast.remove(toastRefId);
        resetState();
      },
      [
        state.stepKey,
        state.accumulatedContext,
        registerBuyer,
        latitude,
        longitude,
        login,
        router,
        toastRefId,
        resetState,
      ],
    );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitUserCreation)}
        className={cn(
          "grid w-full grid-cols-1 justify-start gap-x-16 gap-y-6 md:max-w-[72vw] md:grid-cols-2 lg:ml-0 lg:max-w-[51vw]",
          className,
        )}
      >
        <div className="flex w-full items-center justify-center md:col-span-2 lg:absolute lg:right-[32vw] lg:w-0 ">
          <AvatarUpload form={form} />
        </div>
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
                    value={formatPhone(field.value ?? emptyString)}
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
                      id="phoneUsesWhatsapp"
                      className="mr-2 self-center"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="phoneUsesWhatsapp" className="text-sm">
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
        <div>
          <FormField
            control={form.control}
            name="secondaryPhone"
            render={({ field, fieldState }) => (
              <FormItem className="w-full text-gray-700">
                <FormLabel
                  className="block text-sm font-medium"
                  htmlFor="secondaryPhone"
                >
                  Telefone secundário (opcional)
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-3x w-full md:mt-0"
                    placeholder="(XX) XXXXX-XXXX"
                    {...field}
                    value={formatPhone(field.value ?? emptyString)}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryPhoneUsesWhatsapp"
            render={({ field, fieldState }) => (
              <FormItem className="ml-0.5">
                <FormControl>
                  <div className="p-l-1 mb-1.5 mt-2 flex flex-row">
                    <Checkbox
                      id="acceptsWhatsapp"
                      className="mr-2 self-center"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="acceptsWhatsapp" className="text-sm">
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
          name="instagram"
          render={({ field, fieldState }) => (
            <FormItem className="w-full text-gray-700">
              <FormLabel
                className="block text-sm font-medium"
                htmlFor="instagram"
              >
                <div className="row flex gap-2">
                  <Image
                    priority
                    src="/images/icons/instagram-app-icon.svg"
                    height={19}
                    width={19}
                    alt="Instagram Icon"
                  />
                  Instagram @ (opcional)
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  className="mt-3x w-full md:mt-0"
                  placeholder=" Ex: @minhaempresa"
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
                        value={formatZIPCode(field.value ?? emptyString)}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="mt-2 text-sm ">
                    Mora na zona rural e não possui CEP? Basta Adicionar um CEP
                    qualquer de seu município
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
                  value={field.value ?? emptyString}
                  ref={cityInputRef}
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
                  value={field.value ?? emptyString}
                  ref={provinceInputRef}
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
              <FormLabel className="block text-sm font-medium" htmlFor="street">
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
                  value={field.value ?? emptyString}
                  ref={streetInputRef}
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
                  value={field.value ?? emptyString}
                  ref={districtInputRef}
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
        <FormField
          control={form.control}
          name="businessMainSector"
          render={({ field }) => (
            <FormItem className="mt-1 w-full text-gray-700">
              <FormLabel
                className="block text-sm font-medium"
                htmlFor="businessMainField"
              >
                Principal ramo de atividade comercial*
              </FormLabel>{" "}
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o principal ramo da empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(BusinessSector).map((field) => {
                    return (
                      <SelectItem key={field} value={field}>
                        {BusinessSectorLabel[field]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <ProfileButton
          isEditing={isEditingProfile}
          user={user}
          form={form}
          userLatitude={latitude}
          userLongitude={longitude}
        />
      </form>
    </Form>
  );
}

export function SecondDataStepBuyerScreen() {
  useScrollToTop();

  const secondDataStepBuyerAction = useLoginRegisterFlow(
    (s) => s.secondDataStepBuyerAction,
  );

  const goBack = useCallback(
    () =>
      secondDataStepBuyerAction({
        command: "goBack",
        nextStep: "firstDataStep",
      }),
    [secondDataStepBuyerAction],
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
        <BuyerForm />
      </main>
    </div>
  );
}
