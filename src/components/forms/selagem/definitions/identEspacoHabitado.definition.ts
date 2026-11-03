import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";


// Form validation schema
export const identEspacoHabitadoSchema = z.object({
    nomeEspacoHabitado: z.string().optional(),
    identificacaoSeloSetor: z.string().optional(),
    identificacaoSeloLote: z.string().optional(),
    identificacaoSeloUnidade: z.string().optional(),
    identificacaoSeloComplemento: z.string().optional(),
    seloComplementoNaoAplica: z.string().optional(),
    numeroSelo: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof identEspacoHabitadoSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    nomeEspacoHabitado: "",
    identificacaoSeloSetor:"", 
    identificacaoSeloLote: "",
    identificacaoSeloUnidade: "",
    identificacaoSeloComplemento: "",
    seloComplementoNaoAplica: "",
    numeroSelo:"",
    idLocal: "not",
};

// Base form structure (without conditional fields)
// Base form structure (without conditional fields)
export const identEspacoHabitadoDefinition: FormConfig = {
    title: "Identificação Espaço Habitado",
    sections: [
        {
            id: "identificacaoEspacoHabitado",
            title: "Identificação do Espaço Habitado",
            fields: [
                {
                    name: "nomeEspacoHabitado",
                    label: "Nome do espaço habitado",
                    type: "text" as const,
                    required: false,
                    
                },
                {
                    name: "identificacaoSeloSetor",
                    label: "Identificação do Selo - Setor",
                    type: "text" as const,
                    required: false,
                    placeholder: "000" // Adicionando o placeholder
                },
                {
                    name: "identificacaoSeloLote",
                    label: "Identificação do Selo - Lote",
                    type: "text" as const,
                    required: false,
                    placeholder:"0000"
                },
                {
                    name: "identificacaoSeloUnidade",
                    label: "Identificação do Selo - Unidade",
                    type: "text" as const,
                    required: false,
                    placeholder:"00"
                },
                {
                    name: "identificacaoSeloComplemento",
                    label: "Identificação do Selo - Complemento",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "seloComplementoNaoAplica",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    disableField: "identificacaoSeloComplemento",
                    dependent: true
                },
                {
                    name: "numeroSelo",
                    label: "Número do Selo",
                    type: "text" as const,
                    required: false,
                    readonly:true
                }
                
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for IdentResp form
 * This centralizes all conditional field logic specific to IdentResp in one place
 * @param formValues Current form values from IdentResp form
 */
export function getConditionalFields(_formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from IdentResp form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...identEspacoHabitadoDefinition.sections[0],
            fields: [
                ...identEspacoHabitadoDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
}


