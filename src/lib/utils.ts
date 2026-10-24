import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateExact?: string | null,
  dateYear?: number | null,
  dateType?: string | null,
  dateText?: string | null
): string {
  if (dateText) return dateText;
  if (dateExact) {
    const d = new Date(dateExact);
    if (!isNaN(d.getTime())) {
      const formatted = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
      if (dateType === "APPROXIMATE") return `Sekitar ${formatted}`;
      if (dateType === "BEFORE") return `Sebelum ${formatted}`;
      if (dateType === "AFTER") return `Setelah ${formatted}`;
      return formatted;
    }
  }
  if (dateYear) {
    if (dateType === "APPROXIMATE") return `Sekitar ${dateYear}`;
    if (dateType === "BEFORE") return `Sebelum ${dateYear}`;
    if (dateType === "AFTER") return `Setelah ${dateYear}`;
    return `${dateYear}`;
  }
  return "Tanggal tidak diketahui";
}

