/**
 * Formats a phone number string to the Brazilian phone number format
 * @param value The input phone number string
 * @returns Formatted phone number
 */
export function formatarTelefone(value: string): string {
    if (!value) return "";
    
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 12);

    if (limited.length <= 2) return `(${limited}`;
    if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 12)}`;
} 