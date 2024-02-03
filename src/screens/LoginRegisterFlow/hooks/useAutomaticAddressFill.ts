import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type RouterOutputs, api } from "~/utils/api";
import { emptyString } from "~/utils/constants";
import { validateZIPCode } from "~/utils/validators";

// OBS: Vai facilitar bastante essa parte se a gente fizer a extração do
// useAddressSchema que eu tinha sugerido ali em cima, daí seria só pegar
// essa definição de FormData dele, muito mais fácil!
interface AddressFormData {
  zipCode: string;
  city: string;
  province: string;
  street: string;
  neighborhood?: string | undefined;
  complementary?: string | undefined;
  streetNumber?: string | undefined;
}

interface Props<FormData extends AddressFormData> {
  form: UseFormReturn<FormData>;
  isEditing?: boolean;  // New variable
}

export function useAutomaticAddressFill<FormData extends AddressFormData>({
  form: anoyinglyTypedForm,
  isEditing
}: Props<FormData>) {
  // NOTE: the typesafety here is messy because ReactHookForms's
  // internal types, but it is great actually!
  //
  // We are just casting the form to a more specific type
  // The safe constraint was already infered by the generic
  const form = anoyinglyTypedForm as unknown as UseFormReturn<AddressFormData>;

  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const provinceInputRef = useRef<HTMLInputElement | null>(null);
  const streetInputRef = useRef<HTMLInputElement | null>(null);
  const neighborhoodInputRef = useRef<HTMLInputElement | null>(null);
  const affectedInputRefs = useMemo(
    () =>
      [
        cityInputRef,
        provinceInputRef,
        streetInputRef,
        neighborhoodInputRef,
      ] as const,
    [],
  );

  const enableInputs = useCallback(
    () =>
      affectedInputRefs.forEach((ref) => {
        if (ref.current) ref.current.disabled = false;
      }),
    [affectedInputRefs],
  );

  const onSuccessFetchAddress = useCallback(
    ({
      street,
      city,
      location,
      province,
      neighborhood,
    }: RouterOutputs["auth"]["getAddressDetails"]) => {

      // NOTE: this is not necessary if you use the AddressDetails
      // as a Zod object because you can do this transformation
      // inside the zod object!
      setLatitude(location?.coordinates?.latitude);
      setLongitude(location?.coordinates?.longitude);
      form.clearErrors("zipCode");
      
      //NOTE: form field must be set regardless
      form.setValue("city", city ?? emptyString);
      if (city) {
        if (cityInputRef.current) cityInputRef.current.disabled = true;
        form.clearErrors("city");
      }
       //NOTE: form field must be set regardless
      form.setValue("province", province ?? emptyString);
      if (province) {
        if (provinceInputRef.current) provinceInputRef.current.disabled = true;
        form.clearErrors("province");
      }
       //NOTE: form field must be set regardless
      form.setValue("street", street ?? emptyString);
      if (street) {
        if (streetInputRef.current) streetInputRef.current.disabled = true;
        form.clearErrors("street");
      }
       //NOTE: form field must be set regardless
      form.setValue("neighborhood", neighborhood ?? emptyString);
      if (neighborhood) {
        if (neighborhoodInputRef.current)
          neighborhoodInputRef.current.disabled = true;
        form.clearErrors("neighborhood");
      }
    },
    [form],
  );

  const onErrorFetchAddress = useCallback(() => {
    enableInputs();

    setLatitude(undefined);
    setLongitude(undefined);

    form.setError("zipCode", {
      type: "manual",
      message: "Error ao buscar o cep, confira o cep por favor",
    });
    form.resetField("city");
    form.resetField("province");
    form.resetField("street");
    form.resetField("neighborhood");
  }, [enableInputs, form]);

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
          enableInputs();
        }
      }
    });
    return () => unsubscribe();
  }, [enableInputs, form, queryAndUpdateFields]);


  /*NOTE:  If user is editing and haven't changed the zip code, the already saved address information should not be edited, 
   user must change the zip code if wants to change address info */
  useEffect(() => {
    const disableInputIfValueExists = (inputRef: RefObject<HTMLInputElement>, value?: string) => {
      if (!!value && inputRef.current) {
        inputRef.current.disabled = true;
      }
    };
    if (isEditing) {
      const { city, province, street, neighborhood } = form.getValues();
  
      disableInputIfValueExists(cityInputRef, city);
      disableInputIfValueExists(provinceInputRef, province);
      disableInputIfValueExists(streetInputRef, street);
      disableInputIfValueExists(neighborhoodInputRef, neighborhood);
    }
  }, [form, isEditing]);

  return {
    isLoading,

    latitude,
    longitude,

    cityInputRef,
    provinceInputRef,
    streetInputRef,
    neighborhoodInputRef,
  };
}
