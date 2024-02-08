// CPF
export const lengthFormattedCPF = "xxx.xxx.xxx-xx".length;

export function formatCPF(cpf: string): string {
  return cpf
    .slice()
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

// CNPJ
export const lengthFormattedCNPJ = "xx.xxx.xxx/xxxx-xx".length;

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

// ZIP Code
export const lengthFormattedZIPCode = "xxxxx-xxx".length;

export function formatZIPCode(zipCode: string): string {
  return zipCode
    .slice()
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// Phone
export const lowerEndLengthFormattedPhone = 14;
export const higherEndLengthFormattedPhone = 15;

export function formatPhone(phone: string): string {
  // Remove non-digit characters
  const cleanedPhone = phone.replace(/\D/g, '');

  // Check if the phone number is already formatted
  const isFormatted = /^(\(\d{2}\) \d{5}-\d{4})$/.test(phone);

  if (!cleanedPhone) return '';
  if (isFormatted) {
    return phone;
  } else {
    const formattedPhone = cleanedPhone.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
    return formattedPhone;
  }
}

// RG
export function formatRG(rg: string): string {
  const rgDigits = rg.replace(/\D/g, "");
  if (rgDigits.length <= 8) {
    return rgDigits.replace(/^(\d{7})(\d{1})$/, "$1-$2");
  } else if (rgDigits.length <= 9) {
    return rgDigits;
  } else {
    return rgDigits.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  }
}

// Instagram
export const lowerEndLengthInstagram = 2;
export const higherEndLengthInstagram = 90;
