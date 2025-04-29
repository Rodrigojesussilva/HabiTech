import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const identEticRacGeneSchema = z.object({
    etnicoRacial: z.string().optional(),
    genero: z.string().optional(),
    generoOutro: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof identEticRacGeneSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    etnicoRacial: "",
    genero: "",
    generoOutro: "",
    idLocal: "not",
};

// Base form structure
export const CaracInfraUrbUnidDefinition: FormConfig = {
    title: "Caracterização da Infraestrutura Urbana e da Unidade",
    sections: [
        {
            id: "CaracterizaçãoInfraestruturaUrbanaUnidade",
            title: "Caracterização da Infraestrutura Urbana e da Unidade",
            fields: [
                {
                    name: "etnicoRacial",
                    label: "Identidade Étnico-Racial",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Amarela", value: "amarela" },
                        { label: "Branca", value: "branca" },
                        { label: "Indígena", value: "indigena" },
                        { label: "Parda/Negra", value: "parda" },
                        { label: "Preta/Negra", value: "preta" }
                    ]
                },
                {
                    name: "genero",
                    label: "Identidade de Gênero",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Agênero", value: "agenero" },
                        { label: "Gênero Fluido", value: "generoFluido" },
                        { label: "Homem Cisgênero", value: "homemCis" },
                        { label: "Homem Transexual", value: "homemTrans" },
                        { label: "Mulher Cisgênero", value: "mulherCis" },
                        { label: "Mulher Transexual", value: "mulherTrans" },
                        { label: "Intersexo", value: "intersexo" },
                        { label: "Não Binarie", value: "naoBinarie" },
                        { label: "Travesti", value: "travesti" },
                        { label: "Não sabe informar", value: "naoSabeInformar" },
                        { label: "Não respondeu", value: "naoRespondeu" },
                        { label: "Outros", value: "outros" }
                    ]
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for IdentEticRacGene form
 * @param formValues Current form values from IdentEticRacGene form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    
    // Conditionally add fields based on "genero" value
    if (formValues.genero === "outros") {
        conditionalFields.push({
            name: "generoOutro",
            label: "Especifique o Gênero",
            type: "text",
            required: false,
            conditions: [
                { field: "genero", operator: "equals", value: "outros" }
            ]
        });
    }
    
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from IdentEticRacGene form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...CaracInfraUrbUnidDefinition.sections[0],
            fields: [
                ...CaracInfraUrbUnidDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 