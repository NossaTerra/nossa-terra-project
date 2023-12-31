export function formatCPF(cpf: string): string {
  return cpf
    .slice()
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export function formatCNPJ(cnpj: string): string {
  return cnpj
    .slice()
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export const lengthFormattedCPF = "xxx.xxx.xxx-xx".length;
export const lengthFormattedCNPJ = "xx.xxx.xxx/xxxx-xx".length;
