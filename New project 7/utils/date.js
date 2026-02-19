export function dayKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

export function isYesterday(dayString, baseDate = new Date()) {
  if (!dayString) return false;
  const yesterday = new Date(baseDate);
  yesterday.setDate(yesterday.getDate() - 1);
  return dayString === dayKey(yesterday);
}
