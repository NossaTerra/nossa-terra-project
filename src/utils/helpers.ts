import { type ChosenRole } from "~/screens/LoginRegisterFlow/hooks/useFirstDataStepSchema";
import { lengthFormattedCPF } from "./formatters";

export function cpfIsCNPJ({ cpf, role }: { cpf: string; role?: ChosenRole }) {
  if (role === "buyer") {
    return true;
  }

  return cpf.length > lengthFormattedCPF;
}
