import { FormValues } from "../definitions/identResp.definition";
import { FormField } from "@/utils/formUtils";

/**
 * Get additional conditional fields based on form values for IdentResp form
 * This centralizes all conditional field logic specific to IdentResp in one place
 * @param formValues Current form values from IdentResp form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    
    // Conditionally add fields based on "responsavel" value
    if (formValues.responsavel === "nao") {
        conditionalFields.push(
            {
                name: "relacaoResponsavel",
                label: "Qual a sua relação de parentesco com a pessoa responsável?",
                type: "select",
                required: false,
                options: [
                    { label: "Cônjuge/Companheiro(a)", value: "conjuge" },
                    { label: "Filho(a)", value: "filho" },
                    { label: "Enteado(a)", value: "enteado" },
                    { label: "Genro/Nora", value: "genro_nora" },
                    { label: "Pai/Mãe", value: "pai_mae" },
                    { label: "Sogro(a)", value: "sogro" },
                    { label: "Neto(a)", value: "neto" },
                    { label: "Irmão/Irmã", value: "irmao" },
                    { label: "Outro", value: "outro" }
                ]
            },
            {
                name: "nomeCompletoEntrevistado",
                label: "Nome Completo da Pessoa Entrevistada",
                type: "text",
                required: false
            }
        );
    }
    
    // Conditionally add fields based on "relacaoResponsavel" value
    if (formValues.relacaoResponsavel === "outro") {
        conditionalFields.push({
            name: "DescrevParentesco",
            label: "Descreva a Relação de Parentesco",
            type: "text",
            required: false,
            conditions: [
                { field: "relacaoResponsavel", operator: "equals", value: "outro" }
            ]
        });
    }
    
    return conditionalFields;
}

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