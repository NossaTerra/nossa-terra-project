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