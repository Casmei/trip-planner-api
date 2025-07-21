const monthsPtBr = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function formatDatePtBr(date: Date): string {
  const day = date.getDate();
  const month = monthsPtBr[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}
