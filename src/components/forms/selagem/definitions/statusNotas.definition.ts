import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";



// Form validation schema
export const statusNotasSchema = z.object({
    status: z.string().optional(),
    justificativa: z.string().optional(),
    nomeSupervisor: z.string().optional(),
    observacao: z.string().optional()   
   
});

export type FormValues = z.infer<typeof statusNotasSchema>;



// Base form structure
export const statusNotasDefinition: FormConfig = {
    title: "Status e Notas do Formulário",
    sections: [
        {
            id: "status",
            title: "Status e Notas do Formulário",
            fields: [
                {
                    name: "status",
                    label: "Status",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Concluída", value: "COMPLETED" },
                        { label: "Concluída Incompleta", value: "COMPLETED_INCOMPLETE" },
                        { label: "Concluída Morador Ausente", value: "COMPLETED_ABSENT_RESIDENT" },
                        { label: "Concluída Recusa", value: "COMPLETED_REFUSAL" }
                    ]
                },
                {
                    name: "justificativa",
                    label: "Justificativa",
                    type: "textarea", 
                    required: false,
                    conditions: [
                        { field: "status", operator: "notEquals", value: "COMPLETED" }
                    ]
                },
                {
                    name: "nomeSupervisor",
                    label: "Nome do Supervisor",
                    type: "text", 
                    required: false,
                    readonly: true,
                },
                {
                    name: "observacao",
                    label: "Observação",
                    type: "textarea", 
                    required: false
                }
               
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for PessoaDef form
 * @param formValues Current form values from PessoaDef form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    console.log(formValues);
    // Add fields that appear when a person in the family has disabilities
   
    
    // Add field that appears when the responsible person has disabilities
   
    
    // Add field for other disability type
 
    
    // Add fields for assistive technologies
   
    
   
    
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from PessoaDef form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...statusNotasDefinition.sections[0],
            fields: [
                ...statusNotasDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 