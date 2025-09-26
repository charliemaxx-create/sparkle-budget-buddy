import type { CurrencyCode } from '@/types';

// Mock exchange rates (for demonstration purposes)
const MOCK_EXCHANGE_RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  USD: {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    CAD: 1.37,
    AUD: 1.51,
    JPY: 157.00,
    NGN: 1470.00,
  },
  EUR: {
    USD: 1.08,
    EUR: 1,
    GBP: 0.85,
    CAD: 1.47,
    AUD: 1.62,
    JPY: 168.00,
    NGN: 1580.00,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.17,
    GBP: 1,
    CAD: 1.73,
    AUD: 1.90,
    JPY: 197.00,
    NGN: 1850.00,
  },
  CAD: {
    USD: 0.73,
    EUR: 0.68,
    GBP: 0.58,
    CAD: 1,
    AUD: 1.10,
    JPY: 114.00,
    NGN: 1070.00,
  },
  AUD: {
    USD: 0.66,
    EUR: 0.62,
    GBP: 0.53,
    CAD: 0.91,
    AUD: 1,
    JPY: 103.00,
    NGN: 970.00,
  },
  JPY: {
    USD: 0.0064,
    EUR: 0.0060,
    GBP: 0.0051,
    CAD: 0.0088,
    AUD: 0.0097,
    JPY: 1,
    NGN: 9.36,
  },
  NGN: {
    USD: 0.00068,
    EUR: 0.00063,
    GBP: 0.00054,
    CAD: 0.00093,
    AUD: 0.00103,
    JPY: 0.106,
    NGN: 1,
  },
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getExchangeRate(fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  const rate = MOCK_EXCHANGE_RATES[fromCurrency]?.[toCurrency];
  if (rate) {
    return rate;
  }
  // Fallback: try inverse if direct not found
  const inverseRate = MOCK_EXCHANGE_RATES[toCurrency]?.[fromCurrency];
  if (inverseRate) {
    return 1 / inverseRate;
  }
  // Default to 1 if no rate found (should ideally throw an error or log a warning)
  console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}. Defaulting to 1.`);
  return 1;
}

export function convertCurrency(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
  const rate = getExchangeRate(fromCurrency, toCurrency);
  return amount * rate;
}

export const currencyCodes: { value: CurrencyCode; label: string }[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'NGN', label: 'NGN - Nigerian Naira' },
];