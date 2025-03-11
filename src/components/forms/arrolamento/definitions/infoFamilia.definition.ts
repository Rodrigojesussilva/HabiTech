import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const infoFamiliaSchema = z.object({
    rendaFamiliar: z.string().optional(),
    criancas0a3: z.number().default(0),
    criancas4a6: z.number().default(0),
    criancas7a11: z.number().default(0),
    adolescentes12a18: z.number().default(0),
    adultos19a59: z.number().default(0),
    idosos60: z.number().default(0),
    pessoasComDeficiencia: z.number().default(0),
    pessoasComDoencasCronicas: z.number().default(0),
    gestantes: z.number().default(0),
    pessoasImigrantes: z.number().default(0),
    nacionalidadesSelecionadas: z.array(z.string()).default([]),
    numerosPorPais: z.record(z.string(), z.number()).default({}),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof infoFamiliaSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    rendaFamiliar: "",
    criancas0a3: 0,
    criancas4a6: 0,
    criancas7a11: 0,
    adolescentes12a18: 0,
    adultos19a59: 0,
    idosos60: 0,
    pessoasComDeficiencia: 0,
    pessoasComDoencasCronicas: 0,
    gestantes: 0,
    pessoasImigrantes: 0,
    nacionalidadesSelecionadas: [],
    numerosPorPais: {},
    idLocal: "not",
};

// Base form structure
export const infoFamiliaDefinition: FormConfig = {
    title: "Informações sobre a Família",
    sections: [
        {
            id: "infoFamilia",
            title: "Informações sobre a Família",
            fields: [
                {
                    name: "totalPessoas",
                    label: "Quantidade total de pessoas",
                    type: "display" as const,
                    required: false,
                    displayValue: (data: Partial<FormValues>) => {
                        const total = (
                            (data.criancas0a3 || 0) +
                            (data.criancas4a6 || 0) +
                            (data.criancas7a11 || 0) +
                            (data.adolescentes12a18 || 0) +
                            (data.adultos19a59 || 0) +
                            (data.idosos60 || 0)
                        ).toString();
                        return total;
                    }
                },
                {
                    name: "rendaFamiliar",
                    label: "Informe a renda familiar",
                    type: "text" as const,
                    required: false,
                    placeholder: "R$ 0,00"
                },
                {
                    name: "criancas0a3",
                    label: "Nº de crianças (0 a 3 anos)",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "criancas4a6",
                    label: "Nº de crianças (4 a 6 anos)",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "criancas7a11",
                    label: "Nº de crianças (7 a 11 anos)",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "adolescentes12a18",
                    label: "Nº de adolescentes (12 a 18 anos)",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "adultos19a59",
                    label: "Nº de pessoas adultas (19 a 59 anos)",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "idosos60",
                    label: "Nº de pessoas idosas (a partir de 60 anos)",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "pessoasComDoencasCronicas",
                    label: "Nº de pessoas com doenças crônicas graves",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "gestantes",
                    label: "Nº de gestantes",
                    type: "text" as const,
                    required: false,
                    mask: "9999",
                    placeholder: "0"
                },
                {
                    name: "pessoasImigrantes",
                    label: "Nº de pessoas imigrantes",
                    type: "display" as const,
                    required: false,
                    displayValue: (data: Partial<FormValues>) => {
                        return data.pessoasImigrantes?.toString() || "0";
                    }
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values and/or user selections
 * Note: The nationality selection and country-specific fields would ideally be handled
 * by a custom field component that can render the autocomplete and dynamic fields
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    
    // Add a field for nationality selection (this would need a custom renderer component)
    conditionalFields.push({
        name: "nacionalidadesSelecionadas",
        label: "Selecione as nacionalidades",
        type: "select" as const,
        required: false,
        placeholder: "Países",
        // Note: Multi-select would need to be handled by a custom component
        options: [] // This would be populated with country options in the form component
    });

    // For each selected nationality, we would need to add a field
    // This would be handled in the form component with a custom approach
    // since dynamic field generation based on user input is not easily
    // representable in a static definition

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

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...infoFamiliaDefinition.sections[0],
            fields: [
                ...infoFamiliaDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 