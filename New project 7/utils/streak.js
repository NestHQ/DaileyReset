import { dayKey, isYesterday } from "@/utils/date";

export function recalculateStreak({ currentStreak, lastResetDate, now = new Date() }) {
  const today = dayKey(now);
  if (lastResetDate === today) {
    return { nextStreak: currentStreak || 1, alreadyDoneToday: true, today };
  }
  if (isYesterday(lastResetDate, now)) {
    return { nextStreak: (currentStreak || 0) + 1, alreadyDoneToday: false, today };
  }
  return { nextStreak: 1, alreadyDoneToday: false, today };
}
