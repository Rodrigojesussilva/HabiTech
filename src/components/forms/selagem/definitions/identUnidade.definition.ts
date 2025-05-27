import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const identUnidadeSchema = z.object({
    cep: z.string().optional(),
    naoAplica: z.string().optional(), 
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    complemento: z.string().optional(),
    uf: z.string().optional(),
    cidade: z.string().optional(),
    subPrefeitura: z.string().optional(),
    distrito: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof identUnidadeSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    cep: "",
    naoAplica: "",
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    uf: "",
    cidade: "",
    subPrefeitura: "",
    distrito: "",
    idLocal: "not",
};

// Base form structure (without conditional fields)
export const identUnidadeDefinition: FormConfig = {
    title: "Identificação da Unidade",
    sections: [
        {
            id: "identificacaoUnidade",
            title: "Identificação da Unidade",
            fields: [
                // First telefone is always shown
                {
                    name: "cep",
                    label: "Cep",
                    type: "text" as const,
                    required: false,
                    mask: "9999-999",
                    placeholder: "0000-000",
                },
                {
                    name: "naoAplica",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    disableField: "cep",
                    dependent: true
                },
                {
                    name: "logradouro",
                    label: "Logradouro",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "numero",
                    label: "Número",
                    type: "numberSpinner" as const,
                    required: false,

                },
                {
                    name: "bairro",
                    label: "Bairro",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "complemento",
                    label: "Complemento",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "uf",
                    label: "Uf",
                    type: "combobox" as const,
                    required: true,
                    options: [
                      
                    ]
                },
                {
                    name: "cidade",
                    label: "Cidade",
                    type: "combobox" as const,
                    required: true,
                    options: [
                    
                    ]
                },
                {
                    name: "subPrefeitura",
                    label: "Subprefeitura",
                    type: "combobox" as const,
                    required: false,
                    options: [
                        { label: "Obter opções para Subprefeitura", value: "#" },
                    ]
                },
                {
                    name: "distrito",
                    label: "Distrito",
                    type: "combobox" as const,
                    required: false,
                    options: [
                        { label: "Obter opções para Distrito", value: "#" },
                    ]
                },

            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for InfoContato form
 * This centralizes all conditional field logic specific to InfoContato in one place
 * @param formValues Current form values from InfoContato form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];

    console.log(formValues);
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from InfoContato form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...identUnidadeDefinition.sections[0],
            fields: [
                ...identUnidadeDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 