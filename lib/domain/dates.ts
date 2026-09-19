export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function offsetDateKey(days: number, from = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

export function minutesNow(date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatMinutes(minutes: number): string {
  const clamped = Math.max(0, Math.min(1440, minutes));
  if (clamped === 1440) return "12:00 AM";
  const hours24 = Math.floor(clamped / 60);
  const mins = clamped % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hour = hours24 % 12 || 12;
  return `${hour}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export function formatDuration(minutes: number): string {
  const value = Math.max(0, Math.round(minutes));
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  if (!hours) return `${mins}m`;
  if (!mins) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function dateLabel(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function isoAtLocalMinutes(dateKey: string, minutes: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  date.setMinutes(minutes);
  return date.toISOString();
}
