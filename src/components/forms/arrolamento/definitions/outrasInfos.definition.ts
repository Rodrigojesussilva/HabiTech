import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const outrasInfosSchema = z.object({
    texto: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

// Type for form values based on schema
export type FormValues = z.infer<typeof outrasInfosSchema>;

// Default values for the form
export const defaultValues: Partial<FormValues> = {
    texto: "",
    idLocal: "",
    arrolamento_id: "",
};

// Base form structure
export const outrasInfosDefinition: FormConfig = {
    title: "OUTRAS INFORMAÇÕES RELEVANTES",
    sections: [
        {
            id: "outrasInfos",
            title: "Outras informações relevantes",
            fields: [
                {
                    name: "texto",
                    label: "Especifique outras informações relevantes",
                    type: "text",
                    placeholder: "Digite aqui informações adicionais relevantes",
                    required: false,
                },
            ]
        }
    ]
};

// No conditional fields for this simple form
export function getConditionalFields(_formValues: Partial<FormValues>): FormField[] {
    return [];
}

// Function to get merged form sections
export function getMergedFormSections(_formValues: Partial<FormValues>) {
    return outrasInfosDefinition.sections;
} 