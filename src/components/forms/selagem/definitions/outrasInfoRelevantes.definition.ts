import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const outrasInfoRelevantesSchema = z.object({
    outrasInformacoes: z.string().optional(),
    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
    
});

export type FormValues = z.infer<typeof outrasInfoRelevantesSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    outrasInformacoes: "",
    idLocal: "",
    selagem_id: ""
  
};

// Base form structure
export const outrasInfoRelevantesDefinition: FormConfig = {
    title: "OUTRAS INFORMAÇÕES RELEVANTES",
    sections: [
        {
            id: "outrasInfoRelevantes",
            title: "Outras Informações Relevantes ",
            fields: [
                {
                    name: "outrasInformacoes",
                    label: "Especifique outras informações relevantes",
                    type: "textarea", 
                    required: false
                }
            ]
        },
        
    ]
};


// No conditional fields for this simple form
export function getConditionalFields(_formValues: Partial<FormValues>): FormField[] {
    return [];
}

// Function to get merged form sections
export function getMergedFormSections(_formValues: Partial<FormValues>) {
    return outrasInfoRelevantesDefinition.sections;
} 