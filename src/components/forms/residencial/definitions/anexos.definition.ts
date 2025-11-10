import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";


// Form validation schema
export const anexosSchema = z.object({
    upLoadArquivo: z.string().optional(),
    descricaoArquivo: z.string().optional(), 

    idLocal: z.string().optional(),
    selamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof anexosSchema>;


// Default values
export const defaultValues: Partial<FormValues> = {
    upLoadArquivo: "",

    idLocal: "not",
};

// Base form structure
export const anexosDefinition: FormConfig = {
    title: "Anexos",
    sections: [
        {
            id: "upLoadArquivo",
            title: "Anexos",
            fields: [
                {
                    name: "upLoadArquivo",   // Corrigir aqui
                    label: "Uploads de arquivos",
                    type: "file" as const,
                    required: false,
                },
                 {
                    name: "descricaoArquivo",   // Corrigir aqui
                    label: "Descrição do arquivo",
                    type: "text" as const,
                    required: false,
                }
            ]
        },
        
        

    ]
};

/**
 * Get additional conditional fields based on form values and/or user selections
 * Note: The nationality selection and country-specific fields would ideally be handled
 * by a custom field component that can render the autocomplete and dynamic fields
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    console.log(formValues);
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from InfoFamilia form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);
    console.log(formValues);
    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...anexosDefinition.sections[0],
            fields: [
                ...anexosDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 