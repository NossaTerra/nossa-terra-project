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
import { Input } from "~/components/ui/input";
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
import {
  type AddressInferedData,
  useAutomaticAddressFill,
} from "./hooks/useAutomaticAddressFill";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
  type SellerProfileData,
  useSellerProfileSchema,
} from "./hooks/useSellerProfileSchema";

export interface SellerFormProps extends ClassNameProps {
  onSuccess: (args: {
    data: SellerProfileData & AddressInferedData;
    form: UseFormReturn<SellerProfileData>;
  }) => Promise<void>;
  isLoading?: boolean;
  formProps?: Partial<UseFormProps<SellerProfileData>>;
  submitButtonProps?: ButtonProps;
}

export function SellerForm({
  className,
  formProps,
  onSuccess,
  isLoading = false,
  submitButtonProps,
}: SellerFormProps) {
  const schema = useSellerProfileSchema();
  const form = useForm<SellerProfileData>({
    resolver: zodResolver(schema),
    ...formProps,
    defaultValues: {
      phone: "",
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

  const onSubmitForm: SubmitHandler<SellerProfileData> = useCallback(
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
        className={cn(
          "grid w-full grid-cols-1 justify-start gap-x-16 gap-y-6 md:max-w-[72vw] md:grid-cols-2 lg:ml-0 lg:max-w-[51vw]",
          className,
        )}
        onSubmit={form.handleSubmit(onSubmitForm)}
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
        <Button
          isLoading={isLoading}
          variant="primary"
          className="mt-3 w-full"
          type="submit"
          children="Cadastrar"
          {...submitButtonProps}
        />
      </form>
    </Form>
  );
}
