import { type ChosenRole } from "~/screens/LoginRegisterFlow/hooks/useFirstDataStepSchema";
import { formatPhone, lengthFormattedCPF } from "./formatters";
import { type User } from "~/server/api/auth/types";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { type SecondDataStepBuyerFields } from "~/Screens/LoginRegisterFlow/hooks/useSecondDataStepBuyerSchema";

export function cpfIsCNPJ({ cpf, role }: { cpf: string; role?: ChosenRole }) {
  if (role === "buyer") {
    return true;
  }

  return cpf.length > lengthFormattedCPF;
}

const fieldToFieldName = {
  'phone': "Telefone",
  'secondaryPhone': "Telefone Secundário",
  'phoneUsesWhatsapp': "Telefone Aceita Whatsapp",
  'secondaryPhoneUsesWhatsapp': "Telefone Secundário Aceita Whatsapp",
  'instagram': "Instagram",
  'zipCode': "CEP",
  'city': "Cidade",
  'province': "Estado",
  'street': "Endereço",
  'neighborhood': "Bairro",
  'streetNumber': "Número",
  'complementary': "Complemento",
  'businessMainSector': "Principal Ramo de atividade",
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

  const compareAndAddDiff = (field: keyof SecondDataStepBuyerFields) => {
    if (user) {
      const userValue = user[field];
      const formValue =
        field === "phone" || field === "secondaryPhone"
          ? formatPhone((form.getValues()[field] as string | undefined) ?? "")
          : (form.getValues()[field] as string | boolean | undefined);

    if (userValue !== formValue && !!formValue && fieldToFieldName.hasOwnProperty(field) && field !== 'avatarImage') {           
         diffObject[field] = {
          fieldName: fieldToFieldName[field],
          currentValue:
            field === "phoneUsesWhatsapp" ||
            field === "secondaryPhoneUsesWhatsapp"
            ? whatsAppCheckboxToMessage(!!formValue).toString()
            : formValue.toString(),
        };
      }
    }
  };

  compareAndAddDiff("phone");
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

  const compareAndAddDiff = (field: keyof SecondDataStepBuyerFields) => {
    if (user) {
      const userValue = user[field];
      const formValue =
        field === "phone"
          ? formatPhone((form.getValues()[field] as string | undefined) ?? "")
          : (form.getValues()[field] as string | boolean | undefined);

   if (userValue !== formValue && !!formValue && fieldToFieldName.hasOwnProperty(field) && field !== 'avatarImage') {           
        diffObject[field] = {
          fieldName: fieldToFieldName[field],
          currentValue:
            field === "phoneUsesWhatsapp"
              ? whatsAppCheckboxToMessage(!!formValue).toString()
              : formValue.toString(),
        };
      }
    }
  };

  compareAndAddDiff("phone");
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
