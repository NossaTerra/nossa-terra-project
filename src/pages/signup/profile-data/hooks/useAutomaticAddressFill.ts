import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type RouterOutputs, api } from "~/utils/api";
import { emptyString } from "~/utils/constants";
import type { Prettify } from "~/utils/typescript";
import { validateZIPCode } from "~/utils/validators";

// OBS: Vai facilitar bastante essa parte se a gente fizer a extração do
// useAddressSchema que eu tinha sugerido ali em cima, daí seria só pegar
// essa definição de FormData dele, muito mais fácil!
interface AddressFormData {
  zipCode: string;
  city: string;
  province: string;
  street: string;
  district?: string | undefined;
  complementary?: string | undefined;
  streetNumber?: string | undefined;
}

export type AddressInferedData = Prettify<{
  latitude?: number | undefined;
  longitude?: number | undefined;
}>;

interface Props<FormData extends AddressFormData> {
  form: UseFormReturn<FormData>;
}

export function useAutomaticAddressFill<FormData extends AddressFormData>({
  form: anoyinglyTypedForm,
}: Props<FormData>) {
  // NOTE: the typesafety here is messy because ReactHookForms's
  // internal types, but it is great actually!
  //
  // We are just casting the form to a more specific type
  // The safe constraint was already infered by the generic
  const form = anoyinglyTypedForm as unknown as UseFormReturn<AddressFormData>;

  const [addressInferedData, setAddressInferedData] = useState<
    AddressInferedData | undefined
  >();

  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const provinceInputRef = useRef<HTMLInputElement | null>(null);
  const streetInputRef = useRef<HTMLInputElement | null>(null);
  const districtInputRef = useRef<HTMLInputElement | null>(null);

  const mapAffectedFieldInputRef = useMemo(
    () =>
      ({
        city: cityInputRef,
        province: provinceInputRef,
        street: streetInputRef,
        district: districtInputRef,
      }) as const,
    [],
  );

  const enableFields = useCallback(
    () =>
      Object.values(mapAffectedFieldInputRef).forEach((ref) => {
        if (ref.current) ref.current.disabled = false;
      }),
    [mapAffectedFieldInputRef],
  );

  type AffectedField = keyof typeof mapAffectedFieldInputRef;
  type AffectedFieldsValues = {
    [key in AffectedField]?: string | null | undefined;
  };

  const disableFilledFields = useCallback(
    (fieldValues: AffectedFieldsValues) => {
      const fields = Object.keys(mapAffectedFieldInputRef) as AffectedField[];

      fields.forEach((field) => {
        if (!fieldValues[field]) {
          return;
        }
        form.clearErrors(field);
        const inputRef = mapAffectedFieldInputRef[field];
        if (inputRef.current) {
          inputRef.current.disabled = true;
        }
      });
    },
    [form, mapAffectedFieldInputRef],
  );

  const onSuccessFetchAddress = useCallback(
    ({
      street,
      city,
      coordinates,
      province,
      district,
    }: RouterOutputs["auth"]["getAddressDetails"]) => {
      // OBS: this behavior of preserving the last "lat lon" state is
      // result of a pure refactor, not necessarily the best approach
      setAddressInferedData((previousData) => ({
        ...previousData,
        latitude: coordinates?.latitude ?? undefined,
        longitude: coordinates?.longitude ?? undefined,
      }));

      form.clearErrors("zipCode");

      //NOTE: form fields must be set regardless
      form.setValue("city", city ?? emptyString);
      form.setValue("province", province ?? emptyString);
      form.setValue("street", street ?? emptyString);
      form.setValue("district", district ?? emptyString);

      disableFilledFields({
        city,
        province,
        street,
        district,
      });
    },
    [form, disableFilledFields],
  );

  const onErrorFetchAddress = useCallback(() => {
    enableFields();

    setAddressInferedData(undefined);

    form.setError("zipCode", {
      type: "manual",
      message: "Error ao buscar o cep, confira o cep por favor",
    });
    form.resetField("city");
    form.resetField("province");
    form.resetField("street");
    form.resetField("district");
  }, [enableFields, form]);

  // NOTE: It's best to call the React Query Client directly without using its hooks
  // React Query hooks are great when the fetch is triggered by a React State changing
  // and forms don't trigger state change!
  const addressQuery = api.useUtils().auth.getAddressDetails;
  const [isLoading, setIsLoading] = useState(false);

  const queryAndUpdateFields = useCallback(
    (zipCode: string) => {
      setIsLoading(true);
      addressQuery
        .fetch({ zipCode }, { staleTime: Infinity })
        .then(onSuccessFetchAddress)
        .catch(onErrorFetchAddress)
        .finally(() => setIsLoading(false));
    },
    [addressQuery, onErrorFetchAddress, onSuccessFetchAddress],
  );

  useEffect(() => {
    const { unsubscribe } = form.watch((value, info) => {
      if (info.name === "zipCode" && info.type === "change") {
        const zipCode = value?.zipCode ?? "";

        if (validateZIPCode(zipCode)) {
          queryAndUpdateFields(zipCode);
        } else {
          enableFields();
        }
      }
    });
    return () => unsubscribe();
  }, [enableFields, form, queryAndUpdateFields]);

  const { data: user } = api.auth.getUser.useQuery();
  useEffect(() => {
    if (user && !form.formState.dirtyFields.zipCode) {
      disableFilledFields(form.getValues());
    }
  }, [disableFilledFields, form, user]);

  return {
    isLoading,

    addressInferedData,

    cityInputRef,
    provinceInputRef,
    streetInputRef,
    districtInputRef,
  };
}
