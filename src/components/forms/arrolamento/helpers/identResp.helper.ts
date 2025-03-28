

/**
 * Calculates age from date of birth string
 * @param dataNascimento Date string in DD/MM/YYYY format
 */
export function calcularIdade(dataNascimento: string): string {
    if (!dataNascimento) return "";
    
    const parts = dataNascimento.split('/');
    if (parts.length !== 3) return "";
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JS Date
    const year = parseInt(parts[2]);
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age.toString();
} 