import { FormValues } from "../definitions/identEticRacGene.definition";

/**
 * Validate the form data for the IdentEticRacGene section
 * @param data Form data to validate
 * @returns Boolean indicating if the data is valid
 */
export function validateEticRacGeneData(data: Partial<FormValues>): boolean {
    // Validate required fields or perform any other validation
    // For now, just check if at least one of the main fields is filled
    return Boolean(data.etnicoRacial || data.genero);
} 