import { type ChosenRole } from "~/screens/LoginRegisterFlow/hooks/useFirstDataStepSchema";
import { formatPhone, lengthFormattedCPF } from "./formatters";
import { type BusinessSector, type User } from "~/server/api/auth/types";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { type SecondDataStepBuyerFields } from "~/screens/LoginRegisterFlow/hooks/useSecondDataStepBuyerSchema";
import { BusinessSectorLabel } from "~/server/api/auth/types";
import { emptyString } from "./constants";
import { type SecondDataStepSellerFields } from "~/screens/LoginRegisterFlow/hooks/useSecondDataStepSellerSchema";

export function cpfIsCNPJ({ cpf, role }: { cpf: string; role?: ChosenRole }) {
  if (role === "buyer") {
    return true;
  }

  return cpf.length > lengthFormattedCPF;
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
  neighborhood: "Bairro",
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
  user?: User,
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
    const hasValidFormValue = formValue !== null && formValue !== undefined &&
      fieldToFieldName.hasOwnProperty(field) 

    if (hasValidFormValue) {
      switch (field) {
        case "avatarImage":
          return "Nova imagem de logo adicionada"
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

  const compareAndAddDiff = (field: keyof SecondDataStepBuyerFields) => {
    if (user) {
      const userValue = user[field];
      const formValue =
        field === "phone" || field === "secondaryPhone"
          ? formatPhone((form.getValues()[field] as string | undefined) ?? "")
          : (form.getValues()[field] as string | boolean | undefined);

      const shouldAddToFieldObject =
        userValue !== formValue &&
        fieldToFieldName.hasOwnProperty(field);

      if (shouldAddToFieldObject) {
        diffObject[field] = {
          fieldName: fieldToFieldName[field],
          currentValue: currentValueDisplayedToUser(field, formValue),
        };
      }
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
  compareAndAddDiff("neighborhood");
  compareAndAddDiff("streetNumber");
  compareAndAddDiff("complementary");
  compareAndAddDiff("businessMainSector");

  return diffObject;
};

export const getSellerDiffObject = <T extends FieldValues>(
  form: UseFormReturn<T>,
  user?: User,
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

    const hasValidFormValue = formValue !== null && formValue !== undefined &&
      fieldToFieldName.hasOwnProperty(field) 
      
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

  const compareAndAddDiff = (field: keyof SecondDataStepSellerFields) => {
    if (user) {
      const userValue = user[field];
      const formValue =
        field === "phone"
          ? formatPhone((form.getValues()[field] as string | undefined) ?? "")
          : (form.getValues()[field] as string | boolean | undefined);
      const shouldAddToFieldObject =
        userValue !== formValue &&
        fieldToFieldName.hasOwnProperty(field)

      if (shouldAddToFieldObject) {
        diffObject[field] = {
          fieldName: fieldToFieldName[field],
          currentValue: currentValueDisplayedToUser(field, formValue)
        }
      }
    }
  };

  compareAndAddDiff("phone");
  compareAndAddDiff("phoneUsesWhatsapp");
  compareAndAddDiff("rg");
  compareAndAddDiff("zipCode");
  compareAndAddDiff("city");
  compareAndAddDiff("province");
  compareAndAddDiff("street");
  compareAndAddDiff("neighborhood");
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
