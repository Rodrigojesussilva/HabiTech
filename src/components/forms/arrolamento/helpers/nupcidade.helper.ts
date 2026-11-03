import { FormValues } from "../definitions/nupcidade.definition";

/**
 * Validate the form data for the Nupcidade section
 * @param data Form data to validate
 * @returns Boolean indicating if the data is valid
 */
export function validateNupcidadeData(data: Partial<FormValues>): boolean {
    // Basic validation to check if the required field is filled
    if (!data.estadoCivil) {
        return false;
    }
    
    // If person lives with a partner, they must provide the partner's name
    if (data.viveComCompanheiro === 'sim' && !data.nomeCompanheiro) {
        return false;
    }
    
    return true;
} 