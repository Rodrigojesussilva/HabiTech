import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";


// Form validation schema
export const anexosSchema = z.object({
    anexoComprovanteRenda: z.string().optional(),
    anexoCarteiraTrabalho: z.string().optional(),
    anexoArea: z.string().optional(),
    idLocal: z.string().optional(),
    selamento_id: z.string().optional(),    
});

export type FormValues = z.infer<typeof anexosSchema>;


// Default values
export const defaultValues: Partial<FormValues> = {
    anexoComprovanteRenda: "",
    anexoCarteiraTrabalho: "",
    anexoArea: "",
    idLocal: "not",
};
export const anexosDefinition: FormConfig = {
    title: "Anexos",
    sections: [
        {
            id: "anexoSelo",
            title: "Anexos",
            fields: [
                {
                    name: "anexoComprovanteRenda",
                    label: "Anexos - Comprovante de Renda",
                    type: "file" as const,
                    required: false,
                },
                {
                    name: "botaoComprovanteRenda",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoComprovanteRenda",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para comprovante de renda");
                    },
                },

                {
                    name: "anexoCarteiraTrabalho",
                    label: "Anexos - Carteira de trabalho",
                    type: "file" as const,
                    required: false,
                },
                {
                    name: "botaoCarteiraTrabalho",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoCarteiraTrabalho",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para carteira de trabalho");
                    },
                },

                {
                    name: "anexoArea",
                    label: "Anexos - Área",
                    type: "file" as const,
                    required: false,
                },
                {
                    name: "botaoArea",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoArea",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para área");
                    },
                },
            ],
        },
    ],
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