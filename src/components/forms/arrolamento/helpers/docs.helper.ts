import { isValid, parse } from 'date-fns';
import { countries } from "countries-list";

// Import estados and cidadesPorEstado from a utility file
// This should be created or already exists
import { estados, cidadesPorEstado } from "@/utils/estadosCidades";

export type Estado = keyof typeof cidadesPorEstado;

/**
 * Calculates years and months since a given date
 * @param dataExped Date string in DD/MM/YYYY format
 * @returns Object with anos (years) and meses (months)
 */
export function calcularAnosMeses(dataExped: string): { anos: number, meses: number } {
    if (!dataExped) {
        return { anos: 0, meses: 0 };
    }
    
    try {
        const dataParse = parse(dataExped, 'dd/MM/yyyy', new Date());
        
        if (!isValid(dataParse)) {
            throw new Error('Data inválida. Por favor, use o formato DD/MM/AAAA.');
        }
        
        const hoje = new Date();
        
        // Validate if expedition date is in the future
        if (dataParse > hoje) {
            throw new Error('A data de expedição não pode ser maior que a data atual.');
        }
        
        let anos = hoje.getFullYear() - dataParse.getFullYear();
        let meses = hoje.getMonth() - dataParse.getMonth();
        
        if (meses < 0) {
            anos--;
            meses += 12;
        }
        
        return { anos, meses };
    } catch (error) {
        console.error('Erro ao calcular tempo:', error);
        return { anos: 0, meses: 0 };
    }
}

/**
 * Validates CPF number
 * @param cpf CPF string in format XXX.XXX.XXX-XX
 * @returns Boolean indicating if CPF is valid
 */
export function isValidCPF(cpf: string): boolean {
    // Remove non-numeric characters
    cpf = cpf.replace(/\D/g, "");
    
    // Check if CPF has 11 digits
    if (cpf.length !== 11) {
        return false;
    }
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }
    
    // Validate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(9))) {
        return false;
    }
    
    // Validate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(10))) {
        return false;
    }
    
    return true;
}

/**
 * Formats a CPF string with proper masks
 * @param cpf Raw CPF input
 * @returns Formatted CPF string
 */
export function formatCPF(cpf: string): string {
    // Remove non-numeric characters
    cpf = cpf.replace(/\D/g, "");
    
    // Apply formatting
    if (cpf.length <= 3) {
        return cpf;
    } else if (cpf.length <= 6) {
        return `${cpf.substring(0, 3)}.${cpf.substring(3)}`;
    } else if (cpf.length <= 9) {
        return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6)}`;
    } else {
        return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
    }
}

/**
 * Validates expedition date based on document type and person's age
 * @param date Date string in DD/MM/YYYY format
 * @param docType Document type (RG, CPF, CIN)
 * @param personAge Person's age
 * @returns Error message if invalid, empty string if valid
 */
export function validateExpeditionDate(date: string, docType: string, personAge: number): string {
    try {
        const { anos } = calcularAnosMeses(date);
        
        if (docType === "RG") {
            if (personAge < 12 && anos >= 5) {
                return 'A data de expedição não pode ser maior que 5 anos para menos de 12 anos.';
            } else if (personAge < 60 && anos >= 10) {
                return 'A data de expedição não pode ser maior que 10 anos para pessoas entre 12 e 60 anos.';
            }
        } else if (docType === "CIN") {
            if (personAge < 12 && anos >= 5) {
                return 'A data de expedição não pode ser maior que 5 anos para menos de 12 anos.';
            } else if (personAge < 60 && anos >= 10) {
                return 'A data de expedição não pode ser maior que 10 anos para pessoas entre 12 e 60 anos.';
            }
        }
        
        return '';
    } catch (error: any) {
        return error.message;
    }
}

/**
 * Gets all countries for the select dropdown
 * @returns Array of country options formatted for select fields
 */
export function getCountryOptions() {
    return Object.values(countries).map(country => ({
        label: country.name === "Brazil" ? "Brasil" : country.name,
        value: country.name
    }));
}

/**
 * Gets all states (UFs) for the select dropdown
 * @returns Array of state options formatted for select fields
 */
export function getStateOptions() {
    return estados.map(estado => ({
        label: estado.nome,
        value: estado.sigla
    }));
}

/**
 * Gets cities for a given state (UF)
 * @param uf State code (UF)
 * @returns Array of city options for the selected state
 */
export function getCityOptions(uf: Estado | string) {
    if (!uf || !cidadesPorEstado[uf as Estado]) {
        return [];
    }
    
    return cidadesPorEstado[uf as Estado].map(cidade => ({
        label: cidade,
        value: cidade
    }));
}

// Função de formatação de data
export function formatarData(value: string): string {
    if (!value) return "";

    // Remove todos os caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 8); // Limita o número de caracteres para 8 (DDMMYYYY)

    // Formata conforme a quantidade de caracteres digitados
    if (limited.length <= 2) return `${limited}`;
    if (limited.length <= 4) return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4, 8)}`;
}

export function validarData(
  data: string | undefined,
  familyIndex: number,
  fieldName: string,
  setValue: Function
) {
  if (!data || typeof data !== "string") return;

  // Verifica se o formato geral é YYYY-MM-DD
  const isFormatoValido = /^\d{4}-\d{2}-\d{2}$/.test(data);
  if (!isFormatoValido) {
    alert("Data inválida. Use o formato AAAA-MM-DD.");
    setValue(`families[${familyIndex}].${fieldName}`, "", { shouldValidate: true });
    return;
  }

  // Verifica se o ano tem exatamente 4 dígitos
  const ano = data.split("-")[0];
  if (ano.length !== 4) {
    alert("Ano inválido. O ano deve ter exatamente 4 dígitos.");
    setValue(`families[${familyIndex}].${fieldName}`, "", { shouldValidate: true });
    return;
  }

  const hoje = new Date().toISOString().split("T")[0];

  if (data > hoje) {
    alert("Data não pode ser futura.");
    setValue(`families[${familyIndex}].${fieldName}`, "", { shouldValidate: true });
    return;
  }
}


