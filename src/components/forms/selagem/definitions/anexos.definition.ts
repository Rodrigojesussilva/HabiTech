import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";


// Form validation schema
export const anexosSchema = z.object({
    anexoSelo: z.string().optional(), 
    anexoFachada: z.string().optional(),
    anexoMorador: z.string().optional(),  
    anexoOutros: z.string().optional(),
    idLocal: z.string().optional(),
    selamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof anexosSchema>;


// Default values
export const defaultValues: Partial<FormValues> = {
    anexoSelo: "",
    anexoFachada: "",
    anexoMorador: "",
    anexoOutros: "",   
    idLocal: "not",
};

// Base form structure
export const anexosDefinition: FormConfig = {
    title: "Anexos",
    sections: [
        {
            id: "anexoSelo",
            title: "Anexos",
            fields: [
               
                {
                    name: "anexoSelo",
                    label: "Anexos-Selo",
                    type: "file" as const,
                    required: false,
                },
                 {
                    name: "botaoSelo",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoSelo",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para comprovante de renda");
                    },
                },
                {
                    name: "anexoFachada",
                    label: "Anexos-Fachada",
                    type: "file" as const,
                    required: false,
                },
                 {
                    name: "botaoFachada",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoFachada",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para comprovante de renda");
                    },
                },
                {
                    name: "anexoMorador",
                    label: "Anexos-Morador",
                    type: "file" as const,
                    required: false,
                },
                 {
                    name: "botaoMorador",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoMorador",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para comprovante de renda");
                    },
                },
                {
                    name: "anexoOutros",
                    label: "Anexos-Outros",
                    type: "file" as const,
                    required: false,
                },
                 {
                    name: "botaoComprovanteRenda",
                    label: "", // sem label no botão
                    type: "button" as const,
                    required: false,
                    insertAfterField: "anexoOutros",
                    dependent: true,
                    onClick: () => {
                        console.log("Abrir câmera para comprovante de renda");
                    },
                },

                
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