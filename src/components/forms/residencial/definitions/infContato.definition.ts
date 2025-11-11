import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const infContatoSchema = z.object({

    telefoneCelular: z.string().optional(),
    telefoneAdicional: z.string().optional(),
    nomeRecado: z.string().optional(),
    email: z.string().optional(),
    outroContato: z.string().optional(),
    selagem_id: z.string().optional(),
    idLocal: z.string().optional(),

});

export type FormValues = z.infer<typeof infContatoSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {

    telefoneCelular: "",
    telefoneAdicional: "",
    nomeRecado: "",
    email: "",
    outroContato: "",
    idLocal: "not",

};

// Base form structure (without conditional fields)
export const infContatoDefinition: FormConfig = {
    title: "Informações de contato",
    sections: [
        {
            id: "infContato",
            title: "Informações de contato",
            fields: [
                {
                    name: "telefoneCelular",
                    label: "Telefone Celular para Contato",
                    type: "text",
                    required: true,

                },
                {
                    name: "telefoneAdicional",
                    label: "Telefone adicional/recado",
                    type: "text",
                    required: true,

                },
                {
                    name: "nomeRecado",
                    label: "Nome de para Recado",
                    type: "text",
                    required: true,

                },
                {
                    name: "email",
                    label: "E-mail ",
                    type: "email",
                    required: true,
                    min: 1,
                    max: 100,
                    step: 1,
                },
                {
                    name: "outroContato",
                    label: "Outro meio de contato",
                    type: "textarea",
                    required: true,

                },
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
            ...infContatoDefinition.sections[0],
            fields: [
                ...infContatoDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 