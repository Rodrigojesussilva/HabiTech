/**
 * Calculate age from a date string in DD/MM/YYYY format
 * @param dateString Date string in DD/MM/YYYY format
 * @returns Calculated age as a string
 */
export function calcularIdade(dateString: string): string {
    if (!dateString || dateString.length !== 10) {
        return '';
    }

    const parts = dateString.split('/');
    if (parts.length !== 3) {
        return '';
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return '';
    }

    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age.toString();
}

/**
 * Format document number with proper mask
 * @param document Document number (CPF, RG, etc.)
 * @param type Type of document (cpf, rg, etc.)
 * @returns Formatted document string
 */
export function formatDocument(document: string, type: string): string {
    if (!document) return '';
    
    // Remove all non-numeric characters
    const numericOnly = document.replace(/\D/g, '');
    
    switch (type) {
        case 'cpf':
            if (numericOnly.length !== 11) return document;
            return numericOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        
        case 'phone':
            if (numericOnly.length === 11) {
                return numericOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (numericOnly.length === 10) {
                return numericOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            return document;
            
        default:
            return document;
    }
}

/**
 * Convert years to a formatted time period string
 * @param years Number of years
 * @returns Formatted time period string
 */
export function formatTimePeriod(years: number): string {
    if (!years || years === 0) return '0 anos';
    
    if (years < 1) {
        const months = Math.floor(years * 12);
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    }
    
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
} 