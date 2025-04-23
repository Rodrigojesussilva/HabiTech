import { FormValues } from "../definitions/identResp.definition";

/**
 * Calculates age from date of birth string
 * @param dataNascimento Date string in DD/MM/YYYY format
 */

export function formatDate(value: string | number): string {
    // Se o valor não for fornecido, retorne uma string vazia
    if (!value) return ""; 

    // Converte para string caso seja um número ou data
    let dateValue = typeof value === 'string' ? value : value.toString();

    // Remove caracteres que não sejam números
    dateValue = dateValue.replace(/[^\d]/g, '');

    // Limita a 8 dígitos
    if (dateValue.length > 8) {
        dateValue = dateValue.slice(0, 8);
    }

    // Se a string não tiver 8 caracteres, retorne o valor atual (permitindo edição)
    if (dateValue.length < 8) return dateValue; 

    // Formata a data para o formato dd/MM/yyyy
    const day = dateValue.slice(0, 2);
    const month = dateValue.slice(2, 4);
    const year = dateValue.slice(4, 8);
    return `${day}/${month}/${year}`;
}


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