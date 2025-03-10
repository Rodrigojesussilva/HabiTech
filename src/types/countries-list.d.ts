declare module 'countries-list' {
  export interface Country {
    name: string;
    native: string;
    phone: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string[];
    [key: string]: any;
  }

  export const countries: Record<string, Country>;
} 