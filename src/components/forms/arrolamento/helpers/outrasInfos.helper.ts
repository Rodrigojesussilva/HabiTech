import { FormValues } from "../definitions/outrasInfos.definition";

// Check if form data is valid
export function validateOutrasInfosData(data: Partial<FormValues>): boolean {
    // Simple validation - for this form, any data is valid
    console.log(data);
    return true;
} 