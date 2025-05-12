import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const caractUnidadeSchema = z.object({
    numeroComodos: z.string().optional(),
    numeroPavimento: z.string().optional(),
    numeroSanitario: z.string().optional(),

    selagem_id: z.string().optional(),
    idLocal: z.string().optional(),
  
});

export type FormValues = z.infer<typeof caractUnidadeSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    numeroComodos: "",
    numeroPavimento:"",
    numeroSanitario: "",

    idLocal: "not",
    
};

// Base form structure (without conditional fields)
export const caractUnidadeDefinition: FormConfig = {
    title: "Caracteristicas Unidade",
    sections: [
        {
            id: "caractUnidade",
            title: "Características da Unidade",
            fields: [
                {
                    name: "numeroComodos",
                    label: "Número de Cômodos(exceto banheiro)",
                    type: "numberSpinner", 
                    required: true,
                    min: 1,
                    max: 100,
                    step: 1,
                },
                {
                    name: "numeroPavimento",
                    label: "Número de Pavimentos na Unidade",
                    type: "numberSpinner", 
                    required: true,
                    min: 1,
                    max: 100,
                    step: 1,
                },
                {
                    name: "numeroSanitarios",
                    label: "Número de Sanitários na Unidade",
                    type: "numberSpinner", 
                    required: true,
                    min: 1,
                    max: 100,
                    step: 1,
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for Docs form
 * This centralizes all conditional field logic specific to Docs in one place
 * @param formValues Current form values from Docs form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    console.log(formValues);
    
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from Docs form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);
	console.log("Conditional Fields", conditionalFields);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...caractUnidadeDefinition.sections[0],
            fields: [
                ...caractUnidadeDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 