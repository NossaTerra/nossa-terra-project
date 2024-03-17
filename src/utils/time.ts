export function getDisplayTime(updatedAt: Date) {
  const now = new Date();
  const postDate = new Date(updatedAt);

  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInSeconds < 120) return "feito agora";
  if (diffInMinutes < 60) return ` ${diffInMinutes} minutos`;
  if (diffInHours === 1) return `1 hora`;
  if (diffInHours < 24) return `${diffInHours} horas`;
  if (diffInDays === 1) return `1 dia`;
  if (diffInDays < 14) return `${diffInDays} dias`;
  if (diffInWeeks < 4) return `${diffInWeeks} semanas`;
  if (diffInMonths === 1) return `1 mês`;
  if (diffInMonths < 7) return `${diffInMonths} meses`;

  return "Há mais de 6 meses";
}

export function getDisplayTimeWithAgo(updatedAt: Date) {
  const now = new Date();
  const postDate = new Date(updatedAt);

  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInSeconds < 120) return "Feito agora";
  if (diffInMinutes < 60) return `Feito há ${diffInMinutes} minutos`;
  if (diffInHours === 1) return `Feito há 1 hora`;
  if (diffInHours < 24) return `Feito há ${diffInHours} horas`;
  if (diffInDays === 1) return `Feito há 1 dia`;
  if (diffInDays < 14) return `Feito há ${diffInDays} dias`;
  if (diffInWeeks < 4) return `Feito há ${diffInWeeks} semanas`;
  if (diffInMonths === 1) return `Feito há 1 mês`;
  if (diffInMonths < 7) return `Feito há ${diffInMonths} meses`;

  return "Há mais de 6 meses";
}