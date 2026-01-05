import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatExerciseTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/([^\n])\s*(Mô tả:)/g, '$1\n$2')
    .replace(/([^\n])\s*(Thời gian:)/g, '$1\n$2')
    .replace(/([^\n])\s*(Tổng điểm:)/g, '$1\n$2')
    .trim();
}
