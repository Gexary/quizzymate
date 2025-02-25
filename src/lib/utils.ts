import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPosition(position: number) {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}

export function formatCorrectCount(correctCount: number) {
  if (correctCount === 0) return "No one got the correct answer";
  return `${correctCount} player${correctCount > 1 ? "s" : ""} got the correct answer`;
}

export const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? "s" : ""}`;
