/**
 * Formats a numeric value to Brazilian currency format (R$)
 * @param value The input value to format as currency
 * @returns Formatted currency string
 */
export function formatCurrency(value: string | number): string {
    if (value === null || value === undefined || value === '') return "R$ 0,00";

    let numValue: number;

    if (typeof value === 'string') {
        // Remove todos os caracteres que não sejam dígitos ou vírgula
        const sanitized = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
        numValue = parseFloat(sanitized);
    } else {
        numValue = value;
    }

    if (isNaN(numValue)) return "R$ 0,00";

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numValue);
}

/**
 * Extracts raw numeric value from formatted currency string
 * @param formattedValue The formatted currency string
 * @returns Raw numeric value as string
 */
export function extractNumericValue(formattedValue: string): string {
    if (!formattedValue) return "";
    return formattedValue.replace(/\D/g, '');
}

/**
 * Verifica se um valor é válido para ser usado em um componente select
 * Evita erros de renderização quando o valor não é uma string válida
 * @param value O valor a ser verificado
 * @param defaultValue Valor padrão a ser retornado se inválido
 * @returns Um valor seguro para usar em um select
 */
export function ensureValidSelectValue(value: any, defaultValue: string = "select"): string {
    // Se for undefined, null ou não for uma string, retornar o valor padrão
    if (value === undefined || value === null || typeof value !== 'string') {
        return defaultValue;
    }
    
    // Se for string vazia, retornar o valor padrão
    if (value === "") {
        return defaultValue;
    }
    
    // Caso contrário, retornar o valor original
    return value;
} 
export function formatarTelefone(value: string): string {
    if (!value) return "";
    
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 12);

    if (limited.length <= 2) return `(${limited}`;
    if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 12)}`;
} 