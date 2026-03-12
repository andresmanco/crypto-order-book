import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (amount) =>
  amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
