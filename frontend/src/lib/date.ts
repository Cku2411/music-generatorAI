export const getDaysAgo = (day: number) => {
  const today = new Date();
  today.setDate(today.getDate() - day);
  const daysAgo = today;

  return daysAgo;
};
