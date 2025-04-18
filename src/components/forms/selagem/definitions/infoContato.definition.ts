import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const infoContatoSchema = z.object({
    // Instead of an array, we'll define individual telefone fields that can be enabled/disabled
    telefone1: z.string().optional(),
    telefone1WhatsApp: z.boolean().optional(),
    telefone2: z.string().optional(),
    telefone2WhatsApp: z.boolean().optional(),
    telefone3: z.string().optional(),
    telefone3WhatsApp: z.boolean().optional(),
    ativarTelefone2: z.boolean().optional(),
    ativarTelefone3: z.boolean().optional(),
    
    telefoneResidencial: z.string().optional(),
    recado: z.boolean().optional(),
    telefoneRecado: z.string().optional(),
    nomeRecado: z.string().optional(),
    parentesco: z.string().optional(),
    escrevParentesco: z.string().optional(),
    telefoneComercial: z.string().optional(),
    email: z.string().optional(),
    naoSabeTelefoneComercial: z.boolean().optional(),
    naoSabeEmail: z.boolean().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof infoContatoSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    telefone1: "",
    telefone1WhatsApp: false,
    telefone2: "",
    telefone2WhatsApp: false,
    telefone3: "",
    telefone3WhatsApp: false,
    ativarTelefone2: false,
    ativarTelefone3: false,
    
    telefoneResidencial: "",
    recado: false,
    telefoneRecado: "",
    nomeRecado: "",
    parentesco: "",
    escrevParentesco: "",
    telefoneComercial: "",
    email: "",
    naoSabeTelefoneComercial: false,
    naoSabeEmail: false,
    idLocal: "not",
};

// Base form structure (without conditional fields)
export const infoContatoDefinition: FormConfig = {
    title: "Informações para Contato",
    sections: [
        {
            id: "informacoesContato",
            title: "Informações para Contato",
            fields: [
                // First telefone is always shown
                {
                    name: "telefone1",
                    label: "Telefone Celular 1",
                    type: "text" as const,
                    required: false,
                    mask: "(99) 99999-9999"
                },
                {
                    name: "telefone1WhatsApp",
                    label: "Este celular tem WhatsApp?",
                    type: "checkbox" as const,
                    required: false
                },
                // Option to add second telefone
                {
                    name: "ativarTelefone2",
                    label: "Adicionar segundo telefone celular",
                    type: "checkbox" as const,
                    required: false
                },
                {
                    name: "telefoneResidencial",
                    label: "Telefone Residencial",
                    type: "text" as const,
                    required: false,
                    mask: "(99) 9999-9999"
                },
                {
                    name: "recado",
                    label: "Telefone para Recado?",
                    type: "checkbox" as const,
                    required: false
                },
                {
                    name: "telefoneComercial",
                    label: "Telefone Comercial",
                    type: "text" as const,
                    required: false,
                    mask: "(99) 9999-9999",
                    conditions: [
                        { field: "naoSabeTelefoneComercial", operator: "equals", value: false }
                    ]
                },
                {
                    name: "naoSabeTelefoneComercial",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false
                },
                {
                    name: "email",
                    label: "Email",
                    type: "text" as const,
                    required: false,
                    conditions: [
                        { field: "naoSabeEmail", operator: "equals", value: false }
                    ]
                },
                {
                    name: "naoSabeEmail",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false
                }
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
    
    // Add telefone2 fields if ativarTelefone2 is checked
    if (formValues.ativarTelefone2 === true) {
        conditionalFields.push(
            {
                name: "telefone2",
                label: "Telefone Celular 2",
                type: "text",
                required: false,
                mask: "(99) 99999-9999"
            },
            {
                name: "telefone2WhatsApp",
                label: "Este celular tem WhatsApp?",
                type: "checkbox",
                required: false
            },
            {
                name: "ativarTelefone3",
                label: "Adicionar terceiro telefone celular",
                type: "checkbox",
                required: false
            }
        );
    }
    
    // Add telefone3 fields if ativarTelefone3 is checked
    if (formValues.ativarTelefone3 === true && formValues.ativarTelefone2 === true) {
        conditionalFields.push(
            {
                name: "telefone3",
                label: "Telefone Celular 3",
                type: "text",
                required: false,
                mask: "(99) 99999-9999"
            },
            {
                name: "telefone3WhatsApp",
                label: "Este celular tem WhatsApp?",
                type: "checkbox",
                required: false
            }
        );
    }
    
    // Conditionally add fields based on "recado" value
    if (formValues.recado === true) {
        conditionalFields.push(
            {
                name: "telefoneRecado",
                label: "Telefone para Recado",
                type: "text",
                required: false,
                mask: "(99) 99999-9999"
            },
            {
                name: "nomeRecado",
                label: "Nome da Pessoa para Recado",
                type: "text",
                required: false
            },
            {
                name: "parentesco",
                label: "Relação de Parentesco",
                type: "select",
                required: false,
                options: [
                    { label: "Selecione uma opção", value: "" },
                    { label: "Cônjuge/Campanheiro", value: "conjuge_campanheiro" },
                    { label: "Filha", value: "filha" },
                    { label: "Filho", value: "filho" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Irmã", value: "irma" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Mãe", value: "mae" },
                    { label: "Pai", value: "pai" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Neta", value: "neta" },
                    { label: "Neto", value: "neto" },
                    { label: "Nora", value: "Nora" },
                    { label: "Genro", value: "genro" },
                    { label: "Madrasta", value: "madrasta" },
                    { label: "Padrasto", value: "Padrasto" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sem Relação de Parentesco", value: "sem_relacao" },
                    { label: "Não Sabe Informar", value: "nao_sabe" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            }
        );
    }
    
    // Add escrevParentesco field only when parentesco is "outro"
    if (formValues.parentesco === "outro") {
        conditionalFields.push({
            name: "escrevParentesco",
            label: "Descreva o parentesco",
            type: "text",
            required: false,
            conditions: [
                { field: "parentesco", operator: "equals", value: "outro" }
            ]
        });
    }
    
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
            ...infoContatoDefinition.sections[0],
            fields: [
                ...infoContatoDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 