import dayjs from "dayjs";

export function formatDate(date: Date | undefined, format?: string): string {
  if (!date) {
    return "";
  }

  const dateFormat = format ?? "MMMM DD, YYYY";
  return dayjs(date).format(dateFormat);
}
