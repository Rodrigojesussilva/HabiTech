import { FormValues } from "../definitions/infoFamilia.definition";

/**
 * Format a number as Brazilian currency (R$)
 * @param value The number or string to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: string | number): string {
    if (!value) return "R$ 0,00";
    
    // Convert to number if it's a string
    let numValue = typeof value === 'string'
        ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'))
        : value;
    
    // Handle NaN
    if (isNaN(numValue)) return "R$ 0,00";
    
    // Format as Brazilian Real
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(numValue);
}
export function formatInteger(value: string | number): string {
    if (!value) return "0";

    // Converte para número, removendo tudo que não for dígito
    let numValue = typeof value === 'string'
        ? parseInt(value.replace(/[^\d]/g, ''), 10)
        : Math.floor(value); // Garante que seja inteiro

    // Verifica se é um número válido
    if (isNaN(numValue)) return "0";

    // Formata com separadores de milhar no padrão brasileiro
    return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0,
    }).format(numValue);
}
/**
 * Calculate the total number of people from age groups
 * @param data Form data containing age group counts
 * @returns Total number of people
 */
export function calculateTotalPeople(data: Partial<FormValues>): number {
    return (
        (data.criancas0a3 || 0) +
        (data.criancas4a6 || 0) +
        (data.criancas7a11 || 0) +
        (data.adolescentes12a18 || 0) +
        (data.adultos19a59 || 0) +
        (data.idosos60 || 0)
    );
}

/**
 * Calculate the total number of immigrants from nationality data
 * @param numerosPorPais Record of countries and their counts
 * @returns Total number of immigrants
 */
export function calculateTotalImmigrants(numerosPorPais: Record<string, number> = {}): number {
    return Object.values(numerosPorPais).reduce((total, count) => total + (count || 0), 0);
}

/**
 * Validate the form data for the InfoFamilia section
 * @param data Form data to validate
 * @returns Boolean indicating if the data is valid
 */
export function validateInfoFamiliaData(data: Partial<FormValues>): boolean {
    // Basic validation - should have at least one person
    if (calculateTotalPeople(data) <= 0) {
        return false;
    }
    
    // If immigrant count > 0, must have selected nationalities
    if (data.pessoasImigrantes && data.pessoasImigrantes > 0) {
        if (!data.nacionalidadesSelecionadas || data.nacionalidadesSelecionadas.length === 0) {
            return false;
        }
        
        // Total immigrants from countries must match the overall count
        const totalFromCountries = calculateTotalImmigrants(data.numerosPorPais);
        if (totalFromCountries !== data.pessoasImigrantes) {
            return false;
        }
    }
    
    return true;
} 