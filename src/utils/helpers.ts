import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// Combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

// Format date with time
export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

// Format number with suffix (e.g., 1.2K)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format percentage
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Delay helper for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
