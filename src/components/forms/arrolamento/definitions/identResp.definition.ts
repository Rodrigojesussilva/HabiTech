import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const identRespSchema = z.object({
    responsavel: z.string().optional(),
    relacaoResponsavel: z.string().optional(),
    nomeCompletoResp: z.string().optional(),
    nomeCompletoEntrevistado: z.string().optional(),
    nomeSocialEntrevistado: z.string().optional(),
    dataNascimentoResp: z.string().optional(),
    idadeResp: z.string().optional(),
    respDocs: z.string().optional(),
    DescrevParentesco: z.string().optional(),
    pessoaEmancipada: z.string().optional(),
    certidaoEmancipacao: z.string().optional(),
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
    nomeSocialEntrevistado: "",
    dataNascimentoResp: "",
    idadeResp: "",
    respDocs: "",
    DescrevParentesco: "",
    pessoaEmancipada: "",
    certidaoEmancipacao: "",
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
                    type: "radio" as const,
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
                    type: "date" as const,
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
    if (formValues.idadeResp === "16" || formValues.idadeResp === "17" ) {
        conditionalFields.push(
            {
                name: "pessoaEmancipada",
                label: "A pessoa entrevistada e emancipada?",
                type: "select",
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "não" },
                   
                ]
            },

        );
    }
    if (formValues.pessoaEmancipada === "sim") {
        conditionalFields.push(
            {
                name: "certidaoEmancipacao",
                label: "Possui certidão de emancipação?",
                type: "select",
                required: false,
                options: [
                    { label: "Certidão de emancipação por escritura pública", value: "CertidãoEmancipacaoEscrituraPublica" },
                    { label: "Certidão de emancipação judicial", value: "CertidãoEmancipacaoJudicial" },
                   
                ]
            },

        );
    }
    // Conditionally add fields based on "responsavel" value
    if (formValues.responsavel === "nao") {
        conditionalFields.push(
            {
                name: "relacaoResponsavel",
                label: "Qual a sua relação de parentesco com a pessoa responsável?",
                type: "select",
                required: false,
                options: [
                    { label: "Cônjuge/Companheiro(a)", value: "conjuge_campanheiro" },
                    { label: "Filho", value: "filho" },
                    { label: "Filha", value: "filha" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Irmã", value: "irma" },
                    { label: "Pai", value: "pai" },
                    { label: "Mãe", value: "mae" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Neto", value: "neto" },
                    { label: "Neta", value: "neta" },
                    { label: "Bisneto", value: "bisneto" },
                    { label: "Bisneta", value: "bisneta" },
                    { label: "Genro", value: "genro" },
                    { label: "Nora", value: "nora" },
                    { label: "Padrasto", value: "padrasto" },
                    { label: "Madrasta", value: "madrasta" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sem Relação de Parentesco", value: "sem_parentesco" },
                    { label: "Não Sabe Informar", value: "nsi" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            },
            {
                name: "nomeCompletoEntrevistado",
                label: "Nome Completo da Pessoa Entrevistada",
                type: "text",
                required: false
            },
            {
                name: "nomeSocialEntrevistado",
                label: "Nome Social Pessoa Entrevistada",
                type: "text",
                required: false
            },
            {
                name: "naoSeAplicaEntrevistado",
                label: "Não se aplica",
                type: "checkbox",
                required: false,
                disableField: "nomeSocialEntrevistado",
                dependent: true,
            },
        );
    }

    // Conditionally add fields based on "relacaoResponsavel" value
    if (formValues.relacaoResponsavel === "outro") {
        conditionalFields.push({
            name: "DescrevParentesco",
            label: "Especifique a Relação de Parentesco",
            type: "text",
            required: false,
            conditions: [
                { field: "relacaoResponsavel", operator: "equals", value: "outro" }
            ]
        });
    }

    return conditionalFields;
}

function afterInsert(
    baseFields: any[],
    conditionalFields: any[],
    campoBase: string,
    nomesCondicionais: string[]
) {
    const extras = conditionalFields.filter(field => nomesCondicionais.includes(field.name));
    const indexBase = baseFields.findIndex(f => f.name === campoBase);
    if (indexBase !== -1 && extras.length) {
        baseFields.splice(indexBase + 1, 0, ...extras);
    }
}
/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from IdentResp form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {

        // Get conditional fields based on current form values
        const conditionalFields = getConditionalFields(formValues);
        const baseFields = [...identRespDefinition.sections[0].fields];

        afterInsert(baseFields, conditionalFields, "idadeResp", [
            "pessoaEmancipada"
        ]);
         afterInsert(baseFields, conditionalFields, "pessoaEmancipada", [
            "certidaoEmancipacao"
        ]);

        afterInsert(baseFields, conditionalFields, "responsavel", [
            "relacaoResponsavel", "nomeCompletoEntrevistado", "nomeSocialEntrevistado", "naoSeAplicaEntrevistado"
        ]);

        afterInsert(baseFields, conditionalFields, "relacaoResponsavel", [
            "DescrevParentesco"
        ]);

        // Create and return a merged form structure with base fields and conditional fields
        return [
            {
                ...identRespDefinition.sections[0],
                fields: baseFields
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        return [identRespDefinition.sections[0]];
    }
} 