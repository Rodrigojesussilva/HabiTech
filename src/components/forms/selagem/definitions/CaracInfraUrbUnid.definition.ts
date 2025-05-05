import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const caracInfraUrbUnidSchema = z.object({
    materialPredominante: z.string().optional(),
    unidadeInsalubre: z.string().optional(),
    peDireitoAtendente230: z.string().optional(),
    iluminicaoNatural: z.string().optional(),
    areaVentilacao: z.string().optional(),
    infiltracaoMofo: z.string().optional(),
    cozinhaVentilacaoNatural: z.string().optional(),
    banheiroVentilacaoNatural: z.string().optional(),
    demaisComodosVentilacaoNatural: z.string().optional(),
    abastecimentoAgua: z.string().optional(),
    esgotamentoSanitario: z.string().optional(),
    ligacaoEletrica: z.string().optional(),
    residuosDomesticos: z.string().optional()

});

export type FormValues = z.infer<typeof caracInfraUrbUnidSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    materialPredominante: "",
    unidadeInsalubre: "",
    peDireitoAtendente230: "",
    iluminicaoNatural: "",
    areaVentilacao: "",
    infiltracaoMofo: "",
    cozinhaVentilacaoNatural: "",
    banheiroVentilacaoNatural: "",
    demaisComodosVentilacaoNatural: "",
    abastecimentoAgua: "",
    esgotamentoSanitario: "",
    ligacaoEletrica: "",
    residuosDomesticos:""
};

// Base form structure
export const caracInfraUrbUnidDefinition: FormConfig = {
    title: "Caracterização da Infraestrutura Urbana e da Unidade",
    sections: [
        {
            id: "CaracterizaçãoInfraestruturaUrbanaUnidade",
            title: "Caracterização da Infraestrutura Urbana e da Unidade",
            fields: [
                {
                    name: "materialPredominante",
                    label: "Material predominante nas paredes externas",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Alvenaria", value: "Alvenaria" },
                        { label: "Madeira", value: "Madeira" },
                        { label: "Misto Madeira/Alvenaria", value: "Misto Madeira/Alvenaria" },
                        { label: "Material Reaproveitado", value: "Matrial Reaproiveitado" },
                        { label: "Outros", value: "Outros" }
                    ]
                },
                {
                    name: "unidadeInsalubre",
                    label: "Unidade apresenta condições de insalubridade?",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "Sim" },
                        { label: "Não", value: "Nao" }
                    ]
                },
                {
                    name: "abastecimentoAgua",
                    label: "Abastecimento de Água",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Rede Publica/ligação individual(oficial)", value: "RedePublicaLigacaoIndividual" },
                        { label: "Rede Publica/ligação coletiva(oficial)", value: "RedePublicaLigacaoColetiva" },
                        { label: "Poço Artesiano", value: "PocoArtesiano" },
                        { label: "Instalação de água não oficial", value: "InstalacaoNaoOficial" },
                        { label: "Não possui", value: "NaoPossui" },
                        { label: "Não identificado", value: "NaoIdentificado" },
                        { label: "Outros", value: "Outros" },

                    ]
                },
                {
                    name: "esgotamentoSanitario",
                    label: "Esgotamento sanitário",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Rede Publica/ligação individual(oficial)", value: "RedePublicaLigacaoIndividual" },
                        { label: "Rede Publica/ligação coletiva(oficial)", value: "RedePublicaLigacaoColetiva" },
                        { label: "Rede de esgotamento sanitário não oficial", value: "EsgotamentoSanitarioNaoOficial" },
                        { label: "Esgotamento Sanitário conectado água pluvial", value: "EsgotamentoSanitarioAguaPluvial" },
                        { label: "Instalação de água não oficial", value: "InstalacaoAguaNaoOficial" },
                        { label: "A céu aberto córrego/encosta", value: "CeuAbertoCorregoEncosta" },
                        { label: "Fossa séptica", value: "FossaSéptica" },
                        { label: "Fossa rudimentar", value: "FossaRudimentar" },
                        { label: "Sistema individualizado de tratamento de esgoto(área mananciais)", value: "SistemaIndividualizadoTratamentoEsgoto" },
                        { label: "Não Possui", value: "NaoPossui" },
                        { label: "Não identificado", value: "NaoIdentificado" },
                        { label: "Outros", value: "Outros" },

                    ]
                },
                {
                    name: "ligacaoEletrica",
                    label: "Ligação Elétrica",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Relógio próprio/modidor individual", value: "RologioProprioMedidorIndividual" },
                        { label: "Instalação de energia Elétrica não oficial", value: "InstalacaoEnergiaNaoOficial" },
                        { label: "Relógio comunitário/medidor coletivo", value: "RelogioComunitario" },
                        { label: "Não possui", value: "NaoPossui" },
                        { label: "Não identificado", value: "NaoIdentificado" },
                        { label: "Outros", value: "Outros" },

                    ]
                },
                {
                    name: "residuosDomesticos",
                    label: "Você separa os resíduos domêsticos?",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "Sim" },
                        { label: "Não", value: "Nao" },
                        { label: "Não sabe informar", value: "NaoSabeInformar" },
                        { label: "Não respondeu", value: "NaoRespondeu" }

                    ]
                }
            ]

        }
    ]
};
/**
 * Get additional conditional fields based on form values for IdentEticRacGene form
 * @param formValues Current form values from IdentEticRacGene form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    // Fields based on regime_ocupacao
    if (formValues.unidadeInsalubre === "Sim") {
        conditionalFields.push(
            {
                name: "peDireitoAtendente230",
                label: "O pe direito da unidade atende ao mínimo de 2,30m?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            },
            {
                name: "iluminacaoNatural",
                label: "Possui iluminação natural na unidade?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            },
            {
                name: "areaVetilacao",
                label: "A área de ventilação transmite sensação de salubridade?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            },
            {
                name: "infiltracaoMofo",
                label: "Há infiltração e/ou mofo na unidade?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            },
            {
                name: "cozinhaVentilacaoNatural",
                label: "Cozinha: Possui ventilação natural?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            },
            {
                name: "banheiroVentilacaoNatural",
                label: "Banheiro: Possui ventilação natural?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            },
            {
                name: "demaisComodosVentilacaoNatural",
                label: "Demais cômodos: Possui ventilação natural?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ]
            }
        );
    }

    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from IdentEticRacGene form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    const conditionalFields = getConditionalFields(formValues);

    // Campos fixos
    const allFields = caracInfraUrbUnidDefinition.sections[0].fields;

    // Encontrar o índice do campo abastecimentoAgua
    const indexAbastecimento = allFields.findIndex(field => field.name === "abastecimentoAgua");

    // Dividir os campos fixos
    const beforeAbastecimento = allFields.slice(0, indexAbastecimento);
    const afterAbastecimento = allFields.slice(indexAbastecimento);

    return [
        {
            ...caracInfraUrbUnidDefinition.sections[0],
            fields: [
                ...beforeAbastecimento,
                ...conditionalFields,
                ...afterAbastecimento
            ]
        }
    ];
} 