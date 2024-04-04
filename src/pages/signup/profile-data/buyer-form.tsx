import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassNameProps, cn } from "~/utils/ui";
import {
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
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
import { Input, MaskedInput } from "~/components/ui/input";
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
import { BusinessSector, BusinessSectorLabel } from "~/server/types/user.type";
import {
  type AddressInferedData,
  useAutomaticAddressFill,
} from "./hooks/useAutomaticAddressFill";
import { AvatarUpload } from "~/components/common/AvatarUpload";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
  type BuyerProfileData,
  useBuyerProfileSchema,
} from "./hooks/useBuyerProfileSchema";

export interface BuyerFormProps extends ClassNameProps {
  onSuccess: (args: {
    data: BuyerProfileData & AddressInferedData;
    form: UseFormReturn<BuyerProfileData>;
  }) => Promise<void>;
  isLoading?: boolean;
  formProps?: Partial<UseFormProps<BuyerProfileData>>;
  submitButtonProps?: ButtonProps;
}

export function BuyerForm({
  className,
  formProps,
  onSuccess,
  isLoading = false,
  submitButtonProps,
}: BuyerFormProps) {
  const schema = useBuyerProfileSchema();
  const form = useForm<BuyerProfileData>({
    resolver: zodResolver(schema),
    ...formProps,
    defaultValues: {
      phone: "",
      secondaryPhone: "",
      zipCode: "",
      ...formProps?.defaultValues,
    },
  });

  const {
    addressInferedData,
    cityInputRef,
    provinceInputRef,
    streetInputRef,
    districtInputRef,
  } = useAutomaticAddressFill({ form });

  const onSubmitForm: SubmitHandler<BuyerProfileData> = useCallback(
    async (profileData) => {
      await onSuccess({
        data: { ...profileData, ...addressInferedData },
        form,
      });
    },
    [addressInferedData, form, onSuccess],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
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
                  <MaskedInput
                    className="w-full"
                    maskPreset="BrazilianPhone"
                    {...field}
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
                  <MaskedInput
                    className="w-full"
                    maskPreset="BrazilianPhone"
                    {...field}
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
                  className="w-full"
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
                      <MaskedInput
                        className="w-full"
                        maskPreset="ZipCode"
                        {...field}
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
        <Button
          isLoading={isLoading}
          variant="primary"
          className="mt-3 md:mt-8 w-full"
          type="submit"
          children="Cadastrar"
          {...submitButtonProps}
        />
      </form>
    </Form>
  );
}
