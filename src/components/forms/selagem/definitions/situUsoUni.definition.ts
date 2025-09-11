import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const situUsoUniSchema = z.object({
    situacaoUsoUnidade: z.string().optional(),
    usoUnidade: z.string().optional(),
    qualUso: z.string().optional(),
    quaisTipos: z.string().optional(),
    uso: z.string().optional(),
    nome_responsavel: z.string().optional(),
    telefone_responsavel: z.string().optional(),
    responsavel_nao_identificado: z.boolean().optional(),
    uso_terreno: z.string().optional(),

    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});

export type FormValues = z.infer<typeof situUsoUniSchema>;

export const defaultValues: Partial<FormValues> = {
    situacaoUsoUnidade: "select",
    usoUnidade: "select",
    qualUso: "",
    quaisTipos: "",
    uso: "",
    nome_responsavel: "",
    telefone_responsavel: "",
    responsavel_nao_identificado: false,
    uso_terreno: "",

    idLocal: "not",
};

export const situUsoUniDefinition: FormConfig = {
    title: "Situação e Uso da Unidade",
    sections: [
        {
            id: "situacaoUsoUnidade",
            title: "Situação e Uso da Unidade",
            fields: [
                {
                    name: "situacaoUsoUnidade",
                    label: "Situação da Unidade",
                    type: "select" as const,
                    required: true,
                    options: [
                        { label: "Ocupado (Habitado)", value: "Ocupado" },
                        { label: "Em construção (vazio)", value: "ConstrucaoVazio" },
                        { label: "Em construção (habitado)", value: "ConstrucaoHabitado" },
                        { label: "Em reforma (vazio)", value: "ReformaVazio" },
                        { label: "Em reforma (habitado)", value: "ReformaHabitado" },
                        { label: "Terreno cercado", value: "TerrenoCercado" },
                        { label: "Terreno sem cercamento", value: "TerrenoSemCercamento" },
                        { label: "Unidade vazia", value: "UnidadeVazia" },
                    ]
                },
                {
                    name: "usoUnidade",
                    label: "Uso da unidade",
                    type: "select" as const,
                    required: true,
                    options: [
                        { label: "Selecione uma opção", value: "select" },
                        { label: "Residencial", value: "Residencial" },
                        { label: "Comercial", value: "Comercial" },
                        { label: "Uso Misto", value: "UsoMisto" },
                        { label: "Institucional", value: "Institucional" },
                        { label: "Serviço", value: "Servico" },
                        { label: "Industrial", value: "Industrial" },
                        { label: "Uso não Identificado", value: "UsoNaoIdentificado" },
                        { label: "Outros", value: "Outros" }
                    ],
                    conditions: [
                        { field: "situacaoUsoUnidade", operator: "notEquals", value: "TerrenoCercado" },
                        { field: "situacaoUsoUnidade", operator: "notEquals", value: "TerrenoSemCercamento" }
                    ]
                },
            ]
        }
    ]
};

// Utilitário para inserir campos após um campo específico
function insertAfter(fields: FormField[], targetName: string, toInsert: FormField[]) {
    const index = fields.findIndex(f => f.name === targetName);
    if (index === -1) return [...fields, ...toInsert];
    return [
        ...fields.slice(0, index + 1),
        ...toInsert,
        ...fields.slice(index + 1)
    ];
}

// Retorna campos condicionais baseados nos valores do formulário
export function getConditionalFields(formValues: Partial<FormValues>) {
    const usoUnidadeConditionals: FormField[] = [];
    const situacaoUsoUnidadeConditionals: FormField[] = [];

    if (
        formValues.usoUnidade === "Comercial" ||
        formValues.usoUnidade === "Servico" ||
        formValues.usoUnidade === "Institucional" ||
        formValues.usoUnidade === "Industrial"
    ) {
        usoUnidadeConditionals.push({
            name: "qualUso",
            label: "Quais tipos?",
            type: "text",
            required: false,
            placeholder: "Digite qual o uso aqui"
        });
    }

    if (formValues.usoUnidade === "Outros") {
        usoUnidadeConditionals.push({
            name: "uso",
            label: "Descreva o uso da unidade:",
            type: "text",
            required: true,
            placeholder: "Digite qual o uso aqui"
        });
    }

    if (formValues.usoUnidade === "UsoMisto") {
        usoUnidadeConditionals.push({
            name: "quaisTipos",
            label: "Quais tipos?",
            type: "select",
            required: true,
            options: [
                { label: "Residencial + comércio", value: "ResidencialComercio" },
                { label: "Residencial + serviço", value: "ResidencialServico" },
                { label: "Residencial + institucional", value: "ResidencialInstitucional" },
                { label: "Residencial + industrial", value: "ResidencialIndustrial" },
            ]
        });
    }

    if (
        formValues.situacaoUsoUnidade === "TerrenoCercado" ||
        formValues.situacaoUsoUnidade === "TerrenoSemCercamento"
    ) {
        // 1) Primeiro, inserir o seletor de uso do terreno
        situacaoUsoUnidadeConditionals.push({
            name: "uso_terreno",
            label: "Uso do terreno",
            type: "select",
            required: false,
            options: [
                { label: "Selecione uma opção", value: "select" },
                { label: "Uso não Identificado", value: "UsoNaoIdentificado" },
                { label: "Outros", value: "Outros" }
            ]
        });

        // 2) Se "Outros", inserir imediatamente a descrição do uso do terreno
        if (formValues.uso_terreno === "Outros") {
            situacaoUsoUnidadeConditionals.push({
                name: "uso",
                label: "Descreva o uso do terreno:",
                type: "text",
                required: true,
                placeholder: "Digite qual o uso do terreno aqui",
            });
        }

        // 3) Depois, os campos do responsável
        situacaoUsoUnidadeConditionals.push(
            {
                name: "nome_responsavel",
                label: "Nome da pessoa responsável pelo terreno",
                type: "text" as const,
                required: false,
                conditions: [
                    { field: "responsavel_nao_identificado", operator: "equals", value: false }
                ]
            },
            {
                name: "responsavel_nao_identificado",
                label: "Responsável não identificado",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "telefone_responsavel",
                label: "Telefone da pessoa responsável pelo terreno",
                type: "text" as const,
                required: false,
                conditions: [
                    { field: "responsavel_nao_identificado", operator: "equals", value: false }
                ]
            }
        );
    }

    return { usoUnidadeConditionals, situacaoUsoUnidadeConditionals };
}

// Retorna todas as seções do formulário com campos condicionais na posição correta
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {
        const baseFields = [...situUsoUniDefinition.sections[0].fields];
        const { usoUnidadeConditionals, situacaoUsoUnidadeConditionals } = getConditionalFields(formValues);

        let fields = [...baseFields];
        fields = insertAfter(fields, "situacaoUsoUnidade", situacaoUsoUnidadeConditionals);
        fields = insertAfter(fields, "usoUnidade", usoUnidadeConditionals);

        return [
            {
                ...situUsoUniDefinition.sections[0],
                fields,
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        return [situUsoUniDefinition.sections[0]];
    }
}
