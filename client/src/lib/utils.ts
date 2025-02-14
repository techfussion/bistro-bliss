import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (
  amount: number, 
  options: { 
    notation?: 'standard' | 'compact',
    minimumFractionDigits?: number,
    maximumFractionDigits?: number 
  } = {}
): string => {
  const { 
    notation = 'standard',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0
  } = options;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    notation,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
};

// Helper function for compact notation (e.g., "₦1.2M")
export const formatCompactCurrency = (amount: number): string => {
  return formatCurrency(amount, { notation: 'compact' });
};

// Function to parse currency string back to number
export const parseCurrencyToNumber = (currencyString: string): number => {
  return Number(currencyString.replace(/[₦,]/g, ''));
};