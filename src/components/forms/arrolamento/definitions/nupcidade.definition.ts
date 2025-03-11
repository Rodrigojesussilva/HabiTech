import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const nupcidadeSchema = z.object({
    estadoCivil: z.string().optional(),
    viveComCompanheiro: z.string().optional(),
    nomeCompanheiro: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof nupcidadeSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    estadoCivil: "",
    viveComCompanheiro: "",
    nomeCompanheiro: "",
    idLocal: "not",
};

// Base form structure
export const nupcidadeDefinition: FormConfig = {
    title: "Nupcialidade",
    sections: [
        {
            id: "nupcialidade",
            title: "Nupcialidade",
            fields: [
                {
                    name: "estadoCivil",
                    label: "Qual o estado civil?",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Solteiro", value: "solteiro" },
                        { label: "Casado(a)", value: "casado" },
                        { label: "Viúvo(a)", value: "viuvo" },
                        { label: "Separado(a) Judicialmente", value: "separado" },
                        { label: "Divorciado(a)", value: "divorciado" }
                    ]
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for Nupcidade form
 * @param formValues Current form values from Nupcidade form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    
    // Conditionally add fields based on "estadoCivil" value
    if (formValues.estadoCivil) {
        conditionalFields.push({
            name: "viveComCompanheiro",
            label: "Vive em companhia do(a) cônjuge ou companheiro(a)?",
            type: "select",
            required: false,
            options: [
                { label: "Sim", value: "sim" },
                { label: "Não", value: "nao" }
            ]
        });
    }
    
    // Conditionally add fields based on "viveComCompanheiro" value
    if (formValues.viveComCompanheiro === "sim") {
        conditionalFields.push({
            name: "nomeCompanheiro",
            label: "Nome completo do(a) cônjuge ou companheiro(a)",
            type: "text",
            required: false,
            conditions: [
                { field: "viveComCompanheiro", operator: "equals", value: "sim" }
            ]
        });
    }
    
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from Nupcidade form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...nupcidadeDefinition.sections[0],
            fields: [
                ...nupcidadeDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 