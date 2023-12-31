export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < 9; i++) {
    sum1 += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit1 = (sum1 * 10) % 11;
  if (digit1 === 10) {
    digit1 = 0;
  }

  for (let i = 0; i < 10; i++) {
    sum2 += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let digit2 = (sum2 * 10) % 11;
  if (digit2 === 10) {
    digit2 = 0;
  }

  return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
}

export const regexCNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/

function matchNumbers(value: string | number | number[] = '') {
  const match = value.toString().match(/\d/g)
  return Array.isArray(match) ? match.map(Number) : []
}

function validCalc(x: number, numbers: number[]): number {
  const slice = numbers.slice(0, x);
  let factor = x - 7;
  let sum = 0;

  for (let i = x; i > 0; i--) {
    const n = slice[x - i];
    if (n !== undefined) {
      sum += n * factor--;
      if (factor < 2) factor = 9;
    } else {
      // Handle the case where n is undefined (optional)
      console.error("Element is undefined at index:", x - i);
    }
  }
  const result = 11 - (sum % 11);
  return result > 9 ? 0 : result;
}

export function validateCNPJ(value: string | number | number[] = ''): boolean {
  if (!value) return false
  const isString = typeof value === 'string'
  const validTypes = isString || Number.isInteger(value) || Array.isArray(value)

  if (!validTypes) return false

  if (isString) {
    const digitsOnly = /^\d{14}$/.test(value)
    const validFormat = regexCNPJ.test(value)
    const isValid = digitsOnly || validFormat

    if (!isValid) return false
  }

  const numbers = matchNumbers(value)

  if (numbers.length !== 14) return false

  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  const digits = numbers.slice(12)

  const digit0 = validCalc(12, numbers)
  if (digit0 !== digits[0]) return false

  const digit1 = validCalc(13, numbers)
  return digit1 === digits[1]
}