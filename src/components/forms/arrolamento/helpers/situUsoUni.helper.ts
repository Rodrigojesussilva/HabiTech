/**
 * Formats a numeric value to Brazilian currency format (R$)
 * @param value The input value to format as currency
 * @returns Formatted currency string
 */
export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === '') return "R$ 0,00";

  // Remove tudo que não for número (deixa só dígitos)
  const onlyNums = String(value).replace(/\D/g, '');

  // Interpreta os últimos 2 dígitos como centavos
  const numberValue = parseInt(onlyNums || '0', 10);

  // Formata para moeda BRL com 2 casas decimais
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(numberValue / 100);
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