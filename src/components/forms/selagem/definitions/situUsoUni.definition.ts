import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const situUsoUniSchema = z.object({
    situacaoUsoUnidade: z.string().optional(),
    usoUnidade: z.string().optional(),
    qualUso: z.string().optional(),
    quaisTipos: z.string().optional(),

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
                    label: "Situação e Uso da Unidade",
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
                        { label: "Não indentificado", value: "NaoIdentificado" },
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
        formValues.usoUnidade === "UsoMisto" ||
        formValues.usoUnidade === "Servico" ||
        formValues.usoUnidade === "Institucional" ||
        formValues.usoUnidade === "Industrial" ||
        formValues.usoUnidade === "UsoNaoIdentificado"
    ) {
        usoUnidadeConditionals.push({
            name: "qualUso",
            label: "Qual o uso?",
            type: "text",
            required: false,
            placeholder: "Digite qual o uso aqui"
        });
    }

    if (formValues.usoUnidade === "Outros") {
        usoUnidadeConditionals.push({
            name: "qualUso",
            label: "Descreva o uso da unidade:",
            type: "text",
            required: true,
            placeholder: "Digite qual o uso aqui"
        });
    }

    if (formValues.usoUnidade === "UsoMisto") {
        usoUnidadeConditionals.push({
            name: "quaisTipos",
            label: "Quais tipos?:",
            type: "text",
            required: true,
            placeholder: "Digite quais os usos aqui"
        });
    }

    if (
        formValues.situacaoUsoUnidade === "TerrenoCercado" ||
        formValues.situacaoUsoUnidade === "TerrenoSemCercamento"
    ) {
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
                name: "telefone_responsavel",
                label: "Telefone da pessoa responsável pelo terreno",
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
                name: "uso_terreno",
                label: "Uso do terreno",
                type: "text",
                required: false
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
