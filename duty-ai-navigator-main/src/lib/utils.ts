
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateSimulationId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function formatExchangeRate(rate: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate).replace('₩', '') + ' 원/USD';
}

// Calculate exchange rate based on a date (mock implementation)
export function getExchangeRate(date: Date): number {
  // In a real app, this would fetch from an API or database
  // For demonstration, we'll use mock rates
  const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const week = Math.floor(date.getDate() / 7);
  
  // Generate a slightly different rate based on the week number
  const baseRate = 1330 + (week * 5);
  return baseRate + (day * 0.5);
}

// Helper function to get country name from country code
export function getCountryName(code: string, countries: {code: string, name: string}[]): string {
  const country = countries.find(c => c.code === code);
  return country ? `${country.name} (${country.code})` : "원산지 국가 선택";
}

// 국가 리스트를 한글 이름 순으로 정렬하는 함수
export function getSortedCountries(countries: {code: string, name: string}[]): {code: string, name: string}[] {
  // 깊은 복사를 통해 원본 배열을 변경하지 않도록 함
  const sortedCountries = [...countries];
  
  // 한글 이름 기준으로 정렬
  sortedCountries.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  
  // '알 수 없음' 옵션을 맨 앞에 추가
  return [
    { code: "UNKNOWN", name: "알 수 없음" },
    ...sortedCountries
  ];
}

