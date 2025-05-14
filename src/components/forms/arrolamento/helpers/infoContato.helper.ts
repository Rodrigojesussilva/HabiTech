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

export function formatarTelefoneFixo(value: string): string {
    if (!value) return "";

    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10); // DDD (2) + número (8)

    if (limited.length <= 2) return `(${limited}`;
    if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6, 10)}`;
}

export function formatarTelefoneAuto(value: string): string {
    if (!value) return "";

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
        // Celular
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        // Fixo
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length <= 2) {
        return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }
}
