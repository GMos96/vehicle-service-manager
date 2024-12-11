import dayjs from "dayjs";

export function formatDate(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  return dayjs(date).format("MMMM DD, YYYY");
}
