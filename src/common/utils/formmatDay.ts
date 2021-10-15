export const formmatDay = (string_date: string) => {
  const date = new Date(string_date);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
};
