import { formatPhone } from "./formatters";
import {
  type Role,
  type BusinessSector,
  type User,
} from "~/server/types/user.type";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { BusinessSectorLabel } from "~/server/types/user.type";
import { emptyString } from "./constants";
import { type SellerProfileData } from "~/pages/signup/profile-data/hooks/useSellerProfileSchema";
import { type BuyerProfileData } from "~/pages/signup/profile-data/hooks/useBuyerProfileSchema";
import { cpfPattern } from "~/components/ui/input/masks/cpf-cnpj";

export function cpfIsCNPJ({ cpf, role }: { cpf: string; role?: Role }) {
  if (role === "buyer") {
    return true;
  }

  return cpf.length > cpfPattern.length;
}

const fieldToFieldName = {
  phone: "Telefone",
  secondaryPhone: "Telefone Secundário",
  phoneUsesWhatsapp: "Telefone Aceita Whatsapp",
  secondaryPhoneUsesWhatsapp: "Telefone Secundário Aceita Whatsapp",
  instagram: "Instagram",
  avatarImage: "Logo da empresa",
  zipCode: "CEP",
  city: "Cidade",
  rg: "RG",
  province: "Estado",
  street: "Endereço",
  district: "Bairro",
  streetNumber: "Número",
  complementary: "Complemento",
  businessMainSector: "Principal Ramo de atividade",
};

export type DiffObject = Record<
  string,
  {
    fieldName: string;
    currentValue: string;
  }
>;

export const getBuyerDiffObject = <T extends FieldValues>(
  form: UseFormReturn<T>,
  user: User,
): DiffObject => {
  const diffObject: DiffObject = {};
  const whatsAppCheckboxToMessage = (acceptsWhatsapp: boolean) => {
    if (acceptsWhatsapp) return "Verdadeiro";
    return "Falso";
  };

  const currentValueDisplayedToUser = (
    field: string,
    formValue: string | boolean | undefined,
  ): string => {
    const hasValidFormValue =
      formValue !== null &&
      formValue !== undefined &&
      fieldToFieldName.hasOwnProperty(field);

    if (hasValidFormValue) {
      switch (field) {
        case "avatarImage":
          return "Nova imagem de logo adicionada";
        case "phoneUsesWhatsapp":
          return whatsAppCheckboxToMessage(!!formValue).toString();
        case "secondaryPhoneUsesWhatsapp":
          return whatsAppCheckboxToMessage(!!formValue).toString();
        case "businessMainSector":
          return BusinessSectorLabel[formValue as BusinessSector];
        default:
          return formValue.toString();
      }
    }
    return emptyString;
  };

  const compareAndAddDiff = (field: keyof BuyerProfileData) => {
    const userValue = user[field];
    const formValue =
      field === "phone" || field === "secondaryPhone"
        ? formatPhone((form.getValues()[field] as string | undefined) ?? "")
        : (form.getValues()[field] as string | boolean | undefined);

    const shouldAddToDiffObject =
      userValue !== formValue && fieldToFieldName.hasOwnProperty(field);

    if (shouldAddToDiffObject) {
      diffObject[field] = {
        fieldName: fieldToFieldName[field],
        currentValue: currentValueDisplayedToUser(field, formValue),
      };
    }
  };

  compareAndAddDiff("phone");
  compareAndAddDiff("avatarImage");
  compareAndAddDiff("secondaryPhone");
  compareAndAddDiff("phoneUsesWhatsapp");
  compareAndAddDiff("secondaryPhoneUsesWhatsapp");
  compareAndAddDiff("instagram");
  compareAndAddDiff("zipCode");
  compareAndAddDiff("city");
  compareAndAddDiff("province");
  compareAndAddDiff("street");
  compareAndAddDiff("district");
  compareAndAddDiff("streetNumber");
  compareAndAddDiff("complementary");
  compareAndAddDiff("businessMainSector");

  return diffObject;
};

export const getSellerDiffObject = <T extends FieldValues>(
  form: UseFormReturn<T>,
  user: User,
): DiffObject => {
  const diffObject: DiffObject = {};

  const whatsAppCheckboxToMessage = (acceptsWhatsapp: boolean) => {
    if (acceptsWhatsapp) return "Verdadeiro";
    return "Falso";
  };

  const currentValueDisplayedToUser = (
    field: string,
    formValue: string | boolean | undefined,
  ): string => {
    const hasValidFormValue =
      formValue !== null &&
      formValue !== undefined &&
      fieldToFieldName.hasOwnProperty(field);

    if (hasValidFormValue) {
      switch (field) {
        case "phoneUsesWhatsapp":
          return whatsAppCheckboxToMessage(!!formValue).toString();
        default:
          return formValue.toString();
      }
    }
    return emptyString;
  };

  const compareAndAddDiff = (field: keyof SellerProfileData) => {
    const userValue = user[field];
    const formValue =
      field === "phone"
        ? formatPhone((form.getValues()[field] as string | undefined) ?? "")
        : (form.getValues()[field] as string | boolean | undefined);
    const shouldAddToDiffObject =
      userValue !== formValue && fieldToFieldName.hasOwnProperty(field);

    if (shouldAddToDiffObject) {
      diffObject[field] = {
        fieldName: fieldToFieldName[field],
        currentValue: currentValueDisplayedToUser(field, formValue),
      };
    }
  };

  compareAndAddDiff("phone");
  compareAndAddDiff("phoneUsesWhatsapp");
  compareAndAddDiff("rg");
  compareAndAddDiff("zipCode");
  compareAndAddDiff("city");
  compareAndAddDiff("province");
  compareAndAddDiff("street");
  compareAndAddDiff("district");
  compareAndAddDiff("streetNumber");
  compareAndAddDiff("complementary");

  return diffObject;
};

export function generateAvatarColor(username: string): string | undefined {
  const colors = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#b19c39",
    "#1abc9c",
    "#34495e",
    "#e67e22",
    "#3118db",
    "#27ae60",
    "#d35400",
  ];

  const hashCode = username.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc;
  }, 0);

  const index = Math.abs(hashCode) % colors.length;
  return colors[index];
}
