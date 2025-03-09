import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const identRespSchema = z.object({
    responsavel: z.string().optional(),
    relacaoResponsavel: z.string().optional(),
    nomeCompletoResp: z.string().optional(),
    nomeCompletoEntrevistado: z.string().optional(),
    dataNascimentoResp: z.string().optional(),
    idadeResp: z.string().optional(),
    sexoResp: z.string().optional(),
    cpf: z.string().optional(),
    celular: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    respDocs: z.string().optional(),
    DescrevParentesco: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof identRespSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    responsavel: "",
    relacaoResponsavel: "",
    nomeCompletoResp: "",
    nomeCompletoEntrevistado: "",
    dataNascimentoResp: "",
    idadeResp: "",
    sexoResp: "",
    cpf: "",
    celular: "",
    whatsapp: "",
    email: "",
    respDocs: "",
    DescrevParentesco: "",
    idLocal: "not",
};

// Base form structure (without conditional fields)
export const identRespDefinition: FormConfig = {
    title: "Identificação",
    sections: [
        {
            id: "identificacaoResponsavel",
            title: "Identificação da(o) Responsável",
            fields: [
                {
                    name: "responsavel",
                    label: "Você é a pessoa responsável da unidade residencial?",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "nomeCompletoResp",
                    label: "Nome Completo da pessoa responsável pela unidade residencial",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "dataNascimentoResp",
                    label: "Data de Nascimento",
                    type: "text" as const,
                    required: false,
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA"
                },
                {
                    name: "idadeResp",
                    label: "Idade",
                    type: "display" as const,
                    required: false,
                    displayValue: (data: Partial<FormValues>) => data?.idadeResp || ""
                },
                {
                    name: "sexoResp",
                    label: "Sexo",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Feminino", value: "feminino" },
                        { label: "Masculino", value: "masculino" }
                    ]
                },
                {
                    name: "cpf",
                    label: "CPF",
                    type: "text" as const,
                    required: false,
                    mask: "999.999.999-99"
                },
                {
                    name: "celular",
                    label: "Celular",
                    type: "text" as const,
                    required: false,
                    mask: "(99) 99999-9999"
                },
                {
                    name: "whatsapp",
                    label: "Este celular tem WhatsApp?",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "email",
                    label: "E-mail",
                    type: "text" as const,
                    required: false
                }
            ]
        }
    ]
}; 

/**
 * Get additional conditional fields based on form values for IdentResp form
 * This centralizes all conditional field logic specific to IdentResp in one place
 * @param formValues Current form values from IdentResp form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    
    // Conditionally add fields based on "responsavel" value
    if (formValues.responsavel === "nao") {
        conditionalFields.push(
            {
                name: "relacaoResponsavel",
                label: "Qual a sua relação de parentesco com a pessoa responsável?",
                type: "select",
                required: false,
                options: [
                    { label: "Cônjuge/Companheiro(a)", value: "conjuge" },
                    { label: "Filho(a)", value: "filho" },
                    { label: "Enteado(a)", value: "enteado" },
                    { label: "Genro/Nora", value: "genro_nora" },
                    { label: "Pai/Mãe", value: "pai_mae" },
                    { label: "Sogro(a)", value: "sogro" },
                    { label: "Neto(a)", value: "neto" },
                    { label: "Irmão/Irmã", value: "irmao" },
                    { label: "Outro", value: "outro" }
                ]
            },
            {
                name: "nomeCompletoEntrevistado",
                label: "Nome Completo da Pessoa Entrevistada",
                type: "text",
                required: false
            }
        );
    }
    
    // Conditionally add fields based on "relacaoResponsavel" value
    if (formValues.relacaoResponsavel === "outro") {
        conditionalFields.push({
            name: "DescrevParentesco",
            label: "Descreva a Relação de Parentesco",
            type: "text",
            required: false,
            conditions: [
                { field: "relacaoResponsavel", operator: "equals", value: "outro" }
            ]
        });
    }
    
    return conditionalFields;
} 

/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from IdentResp form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...identRespDefinition.sections[0],
            fields: [
                ...identRespDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 