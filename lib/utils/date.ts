import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function formatRelativeTime(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ko,
  });
}

export function formatDateTime(date: Date) {
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
