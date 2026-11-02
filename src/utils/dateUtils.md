export const ITALIAN_HOLIDAYS = [
  { month: 1, day: 1 }, // New Year's Day
  { month: 6, day: 2 }, // Epiphany
  { month: 4, day: 25 }, // Liberation Day
  { month: 2, day: 1 }, // Republic Day
  { month: 8, day: 15 }, // Assumption
  { month: 8, day: 8 }, // Immaculate Conception
  { month: 12, day: 8 }, // Immaculate Conception (optional)
  { month: 12, day: 25 }, // Christmas
  { month: 12, day: 26 }, // St. Stephen's Day
];

export function isHoliday(date: string): boolean {
  const [_, monthStr, dayStr] = date.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  return ITALIAN_HOLIDAYS.some(h => h.month === month && h.day === day);
}