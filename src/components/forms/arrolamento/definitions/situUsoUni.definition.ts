import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const situUsoUniSchema = z.object({
    regime_ocupacao: z.string().optional(),
    valor_locacao: z.string().optional(),
    nsi_valor_locacao: z.boolean().optional(),
    contrato_locacao: z.string().optional(),
    nome_proprietario: z.string().optional(),
    contato_proprietario: z.string().optional(),
    nsi_contato_proprietario: z.boolean().optional(),

    // Própria
    documentoComprovacao: z.string().optional(),
    descricaoDocumento: z.string().optional(),

    // Cedida
    nome_proprietario_cedida: z.string().optional(),
    telefone_proprietario_cedida: z.string().optional(),

    // Tempo de moradia
    tempoMoradiaAnos: z.string().optional(),
    tempoMoradiaMeses: z.string().optional(),
    tempoMoradiaNaoSabe: z.boolean().optional(),
    tempoMoradiaNaoSabe1: z.boolean().optional(),

    // Compartilhamento
    cozinhaCompartilhada: z.string().optional(),
    banheiroCompartilhado: z.string().optional(),

    // Resíduos - simplificados para string
    separaResiduos: z.string().optional(),
    destinoReciclavel: z.string().optional(),
    outroDestinoReciclavel: z.string().optional(),
    destinoOrganico: z.string().optional(),
    outroDestinoOrganico: z.string().optional(),
    destinoDomestico: z.string().optional(),
    outroDestinoDomestico: z.string().optional(),

    // Identificadores
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof situUsoUniSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    regime_ocupacao: "select",
    valor_locacao: "",
    nsi_valor_locacao: false,
    contrato_locacao: "select",
    nome_proprietario: "",
    contato_proprietario: "",
    nsi_contato_proprietario: false,

    documentoComprovacao: "select",
    descricaoDocumento: "",

    nome_proprietario_cedida: "",
    telefone_proprietario_cedida: "",

    tempoMoradiaAnos: "",
    tempoMoradiaMeses: "",
    tempoMoradiaNaoSabe: false,
    tempoMoradiaNaoSabe1: false,

    cozinhaCompartilhada: "select",
    banheiroCompartilhado: "select",

    separaResiduos: "select",
    destinoReciclavel: "select",
    outroDestinoReciclavel: "",
    destinoOrganico: "select",
    outroDestinoOrganico: "",
    destinoDomestico: "select",
    outroDestinoDomestico: "",

    idLocal: "not",
};

// Base form structure (without conditional fields)
export const situUsoUniDefinition: FormConfig = {
    title: "Situação e Uso da Unidade",
    sections: [
        {
            id: "situacaoUsoUnidade",
            title: "Situação e Uso da Unidade",
            fields: [
                {
                    name: "regime_ocupacao",
                    label: "Regime de Ocupação da Unidade",
                    type: "select" as const,
                    required: true,
                    options: [
                        { label: "Selecione uma opção", value: "select" },
                        { label: "Alugada", value: "alugada" },
                        { label: "Cedida (Emprestada)", value: "cedida" },
                        { label: "Ocupada", value: "ocupada" },
                        { label: "Própria", value: "propria" },
                        { label: "Não sabe informar", value: "naoSabeInformar" }
                    ]
                },
                {
                    name: "tempoMoradiaAnos",
                    label: "Tempo de moradia na Unidade (Anos)",
                    type: "text" as const,
                    required: false,

                },
                {
                    name: "tempoMoradiaNaoSabe",
                    label: "Não se aplica Moradia Anos",
                    type: "checkbox" as const,
                    required: false,
                    disableField: "tempoMoradiaAnos",
                    dependent: true,
                },
                {
                    name: "tempoMoradiaMeses",
                    label: "Tempo de moradia na Unidade (Meses)",
                    type: "text" as const,
                    required: false,

                },

                {
                    name: "tempoMoradiaNaoSabe1",
                    label: "Não se aplica Moradia Mêses",
                    type: "checkbox" as const,
                    required: false,
                    disableField: "tempoMoradiaMeses",
                    dependent: true,
                },
                {
                    name: "cozinhaCompartilhada",
                    label: "A cozinha é compartilhada com outras famílias?",
                    type: "radio" as const,
                    required: true,
                    options: [                      
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "banheiroCompartilhado",
                    label: "O banheiro é compartilhado com outras famílias?",
                    type: "radio" as const,
                    required: true,
                    options: [
                       
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "separaResiduos",
                    label: "Você separa os resíduos domésticos?",
                    type: "radio" as const,
                    required: false,
                    options: [
                       
                        { label: "Sim", value: "Sim" },
                        { label: "Não", value: "Não" },
                        { label: "Não sabe informar", value: "Não sabe informar" },
                        { label: "Não respondeu", value: "Não respondeu" }
                    ]
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for SituUsoUni form
 * @param formValues Current form values
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];

    // Fields based on regime_ocupacao
    if (formValues.regime_ocupacao === "alugada") {
        conditionalFields.push(
            {
                name: "valor_locacao",
                label: "Informe o valor do aluguel",
                type: "text",
                required: false,

            },
            {
                name: "nsi_valor_locacao",
                label: "Não sabe informar valor do aluguel",
                type: "checkbox",
                required: false,
                disableField: "valor_locacao",
                dependent: true,
            },
            {
                name: "contrato_locacao",
                label: "Contrato de locação",
                type: "radio" as const,
                required: false,
                options: [                   
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                    { label: "Não sabe informar", value: "naoSabeInformar" }
                ]
            },
            {
                name: "nome_proprietario",
                label: "Nome completo do proprietário da unidade",
                type: "text",
                required: false
            },
            {
                name: "contato_proprietario",
                label: "Contato do proprietário da unidade (Celular)",
                type: "text",
                required: false,
                placeholder:"(00) 00000-0000"

            },
            {
                name: "nsi_contato_proprietario",
                label: "Não sabe informar",
                type: "checkbox",
                required: false,
                disableField: "contato_proprietario",
                dependent: true,
            }
        );
    }

    // Fields for "própria"
    if (formValues.regime_ocupacao === "propria") {
        conditionalFields.push(
            {
                name: "documentoComprovacao",
                label: "Qual é o documento de comprovação de aquisição da unidade?",
                type: "select",
                required: false,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Contrato de venda e compra", value: "contratoVendaCompra" },
                    { label: "Somente recibo de compra", value: "somenteRecibo" },
                    { label: "Escritura", value: "escritura" },
                    { label: "Ação Judicial de usucapião", value: "acaoUsucapiao" },
                    { label: "Outro", value: "outro" }
                ]
            }
        );

        // If documentoComprovacao is "outro", show descricaoDocumento
        if (formValues.documentoComprovacao === "outro") {
            conditionalFields.push({
                name: "descricaoDocumento",
                label: "Especifique o documento",
                type: "text",
                required: false,
            });
        }
    }

    // Fields for "cedida"
    if (formValues.regime_ocupacao === "cedida") {
        conditionalFields.push(
            {
                name: "nome_proprietario_cedida",
                label: "Nome do proprietário",
                type: "text",
                required: false
            },
            {
                name: "telefone_proprietario_cedida",
                label: "Telefone do proprietário",
                type: "text",
                required: false
            }
        );
    }

    // Fields for separaResiduos = "Sim"
    if (formValues.separaResiduos === "Sim") {
        conditionalFields.push(
            {
                name: "destinoReciclavel",
                label: "Qual a destinação do resíduo reciclável?",
                type: "select",
                required: false,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Retirado pelo caminhão de coleta seletiva prefeitura", value: "Retirado pelo caminhão de coleta seletiva prefeitura" },
                    { label: "Coletado em lixeiras coletivas / caçambas", value: "Coletado em lixeiras coletivas / caçambas" },
                    { label: "Coletado por cooperativas e/ou catadores de materiais recicláveis", value: "Coletado por cooperativas e/ou catadores de materiais recicláveis" },
                    { label: "Não faz separação dos resíduos, segue destinação do resíduo orgânico", value: "Não faz separação dos resíduos, segue destinação do resíduo orgânico" },
                    { label: "Ecoponto da região", value: "Ecoponto da região" },
                    { label: "Não possui destinação oficial", value: "Não possui destinação oficial" },
                    { label: "Não identificado", value: "Não identificado" },
                    { label: "Outros", value: "Outros" }
                ]
            }
        );

        // If destinoReciclavel includes "Outros", show outroDestinoReciclavel
        if (formValues.destinoReciclavel === "Outros") {
            conditionalFields.push({
                name: "outroDestinoReciclavel",
                label: "Especifique o destino do resíduo reciclável",
                type: "text",
                required: false,
            });
        }

        conditionalFields.push({
            name: "destinoOrganico",
            label: "Qual a destinação do resíduo orgânico?",
            type: "select",
            required: false,
            options: [
                { label: "Selecione uma opção", value: "select" },
                { label: "Retirado pelo caminhão de coleta seletiva prefeitura", value: "Retirado pelo caminhão de coleta seletiva prefeitura" },
                { label: "Coletado em lixeiras coletivas / caçambas", value: "Coletado em lixeiras coletivas / caçambas" },
                { label: "Compostagem doméstica", value: "Compostagem doméstica" },
                { label: "Não identificado", value: "Não identificado" },
                { label: "Outros", value: "Outros" }
            ]
        });

        // If destinoOrganico includes "Outros", show outroDestinoOrganico
        if (formValues.destinoOrganico === "Outros") {
            conditionalFields.push({
                name: "outroDestinoOrganico",
                label: "Especifique o destino do resíduo orgânico",
                type: "text",
                required: false,
            });
        }
    }

    // Fields for separaResiduos = "Não"
    if (formValues.separaResiduos === "Não") {
        conditionalFields.push({
            name: "destinoDomestico",
            label: "Qual a destinação dos resíduos domésticos?",
            type: "select",
            required: false,
            options: [
                { label: "Selecione uma opção", value: "select" },
                { label: "Retirado pelo caminhão de coleta seletiva prefeitura", value: "Retirado pelo caminhão de coleta seletiva prefeitura" },
                { label: "Coletado em lixeiras coletivas / caçambas", value: "Coletado em lixeiras coletivas / caçambas" },
                { label: "Jogado no córrego", value: "Jogado no córrego" },
                { label: "Jogado em terreno vazio/rua", value: "Jogado em terreno vazio/rua" },
                { label: "Queimado em local próximo", value: "Queimado em local próximo" },
                { label: "Não possui destinação oficial", value: "Não possui destinação oficial" },
                { label: "Não identificado", value: "Não identificado" },
                { label: "Outros", value: "Outros" }
            ]
        });

        // If destinoDomestico includes "Outros", show outroDestinoDomestico
        if (formValues.destinoDomestico === "Outros") {
            conditionalFields.push({
                name: "outroDestinoDomestico",
                label: "Especifique o destino dos resíduos domésticos",
                type: "text",
                required: false,
            });
        }
    }

    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values
 * @returns Array of form sections with merged fields
 */
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
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {

        // Get conditional fields based on current form values
        const conditionalFields = getConditionalFields(formValues);
        const baseFields = [...situUsoUniDefinition.sections[0].fields];

        if (formValues.regime_ocupacao === "alugada") {
            afterInsert(baseFields, conditionalFields, "regime_ocupacao", [
                "valor_locacao", "nsi_valor_locacao", "contrato_locacao", "nome_proprietario", "contato_proprietario", "nsi_contato_proprietario"
            ]);
        }
        else if (formValues.regime_ocupacao === "propria") {
            afterInsert(baseFields, conditionalFields, "regime_ocupacao", [
                "documentoComprovacao"
            ]);
            if (formValues.documentoComprovacao === "outro") {
                afterInsert(baseFields, conditionalFields, "documentoComprovacao", [
                    "descricaoDocumento"
                ]);

            }
        }
        else if (formValues.regime_ocupacao === "cedida") {
            afterInsert(baseFields, conditionalFields, "regime_ocupacao", [
                "nome_proprietario_cedida", "telefone_proprietario_cedida"
            ]);
        }
        if (formValues.separaResiduos === "Sim") {
            afterInsert(baseFields, conditionalFields, "separaResiduos", [
                "destinoReciclavel", "destinoOrganico"
            ]);
            if (formValues.destinoReciclavel === "Outros") {
                afterInsert(baseFields, conditionalFields, "destinoReciclavel", [
                    "outroDestinoReciclavel"
                ]);
            }
            if (formValues.destinoOrganico === "Outros") {
                afterInsert(baseFields, conditionalFields, "destinoOrganico", [
                    "outroDestinoDomestico"
                ]);
            }
        }
        else if (formValues.separaResiduos === "Não") {
            afterInsert(baseFields, conditionalFields, "separaResiduos", [
                "destinoDomestico"
            ]);
            if (formValues.destinoDomestico === "Outros") {
                afterInsert(baseFields, conditionalFields, "destinoDomestico", [
                    "outroDestinoOrganico"
                ]);
            }
        }

        // Create and return a merged form structure
        return [
            {
                ...situUsoUniDefinition.sections[0],
                fields: baseFields
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        // Em caso de erro, retornar apenas os campos base
        return [situUsoUniDefinition.sections[0]];
    }
} 