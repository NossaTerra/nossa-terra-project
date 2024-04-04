// Phone
export const lowerEndLengthFormattedPhone = 14;
export const higherEndLengthFormattedPhone = 15;

export function formatPhone(phone: string): string {
  // Remove non-digit characters
  const cleanedPhone = phone.replace(/\D/g, "");

  // Check if the phone number is already formatted
  const isFormatted = /^(\(\d{2}\) \d{5}-\d{4})$/.test(phone);

  if (!cleanedPhone) return "";
  if (isFormatted) {
    return phone;
  } else {
    const formattedPhone = cleanedPhone
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
    return formattedPhone;
  }
}

// Instagram
export const lowerEndLengthInstagram = 2;
export const higherEndLengthInstagram = 90;
