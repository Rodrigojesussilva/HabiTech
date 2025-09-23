import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const caracInfraUrbUnidSchema = z.object({
    materialPredominante: z.string().optional(),
    outroMaterialPredominante: z.string().optional(),
    unidadeInsalubre: z.string().optional(),
    peDireitoAtendente230: z.string().optional(),
    iluminicaoNatural: z.string().optional(),
    areaVentilacao: z.string().optional(),
    infiltracaoMofo: z.string().optional(),
    cozinhaVentilacaoNatural: z.string().optional(),
    cozinhaSalubridade: z.string().optional(),
    banheiroVentilacaoNatural: z.string().optional(),
    banheiroSalubridade: z.string().optional(),
    demaisComodosVentilacaoNatural: z.string().optional(),
    demaisComodosSalubridade: z.string().optional(),
    abastecimentoAgua: z.string().optional(),
    outroAbastecimentoAgua: z.string().optional(),
    esgotamentoSanitario: z.string().optional(),
    outroEsgotamentoSanitario: z.string().optional(),
    ligacaoEletrica: z.string().optional(),
    outroLigacaoEletrica: z.string().optional()
});

export type FormValues = z.infer<typeof caracInfraUrbUnidSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    materialPredominante: "",
    outroMaterialPredominante: "",
    unidadeInsalubre: "",
    peDireitoAtendente230: "",
    iluminicaoNatural: "",
    areaVentilacao: "",
    infiltracaoMofo: "",
    cozinhaVentilacaoNatural: "",
    cozinhaSalubridade: "",
    banheiroVentilacaoNatural: "",
    banheiroSalubridade: "",
    demaisComodosVentilacaoNatural: "",
    demaisComodosSalubridade: "",
    abastecimentoAgua: "",
    outroAbastecimentoAgua: "",
    esgotamentoSanitario: "",
    outroEsgotamentoSanitario: "",
    ligacaoEletrica: "",
    outroLigacaoEletrica: ""
};

// Base form structure
export const caracInfraUrbUnidDefinition: FormConfig = {
    title: "Caracterização da Infraestrutura e da Unidade",
    sections: [
        {
            id: "CaracterizaçãoInfraestruturaUrbanaUnidade",
            title: "Caracterização da Infraestrutura e da Unidade",
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
                    label: "Unidade aparenta condições de insalubridade?",
                    type: "radio" as const,
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
                        { label: "Não identificado", value: "NaoIdentificado" },
                        { label: "Outros", value: "Outros" },

                    ]
                },
                {
                    name: "esgotamentoSanitario",
                    label: "Esgotamento Sanitário",
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
                        { label: "Relógio próprio/ medidor individual (oficial)", value: "RologioProprioMedidorIndividual" },
                        { label: "Relógio comunitário/ medidor coletivo (oficial)", value: "RelogioComunitario" },
                        { label: "Instalação de energia elétrica não oficial", value: "InstalacaoEnergiaNaoOficial" },
                        { label: "Não identificado", value: "NaoIdentificado" },
                        { label: "Outros", value: "Outros" },
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
    
    // Campos para opção "Outros" selecionada
    if (formValues.materialPredominante === "Outros") {
        conditionalFields.push({
            name: "outroMaterialPredominante",
            label: "Especifique o material",
            type: "text" as const,
            required: false,
            insertAfterField: "materialPredominante",
            mask: "alpha"
        });
    }
    
    if (formValues.abastecimentoAgua === "Outros") {
        conditionalFields.push({
            name: "outroAbastecimentoAgua",
            label: "Especifique o abastecimento",
            type: "text" as const,
            required: false,
            insertAfterField: "abastecimentoAgua"
        });
    }
    
    if (formValues.esgotamentoSanitario === "Outros") {
        conditionalFields.push({
            name: "outroEsgotamentoSanitario",
            label: "Especifique o esgotamento",
            type: "text" as const,
            required: false,
            insertAfterField: "esgotamentoSanitario"
        });
    }
    
    if (formValues.ligacaoEletrica === "Outros") {
        conditionalFields.push({
            name: "outroLigacaoEletrica",
            label: "Especifique a ligação elétrica",
            type: "text" as const,
            required: false,
            insertAfterField: "ligacaoEletrica",
            mask: "alpha"
        });
    }
    
    // Fields based on unidade insalubre
    if (formValues.unidadeInsalubre === "Sim") {
        conditionalFields.push(
            {
                name: "peDireitoAtendente230",
                label: "O pe direito da unidade atende ao mínimo de 2,30m?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "unidadeInsalubre"
            },
            {
                name: "iluminicaoNatural",
                label: "Possui iluminação natural na unidade?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "peDireitoAtendente230"
            },
            {
                name: "areaVentilacao",
                label: "A área de ventilação da unidade transmite sensação de salubridade?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "iluminicaoNatural"
            },
            {
                name: "infiltracaoMofo",
                label: "Há infiltração e/ou mofo na unidade?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "areaVentilacao"
            },
            {
                name: "cozinhaVentilacaoNatural",
                label: "Cozinha: Possui ventilação natural?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "infiltracaoMofo"
            }
        );
        
        // Adiciona campo de salubridade para cozinha se tiver ventilação natural
        if (formValues.cozinhaVentilacaoNatural === "Sim") {
            conditionalFields.push({
                name: "cozinhaSalubridade",
                label: "Cozinha: A área de ventilação transmite sensação de salubridade?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "cozinhaVentilacaoNatural"
            });
        }
        
        conditionalFields.push({
            name: "banheiroVentilacaoNatural",
            label: "Banheiro: Possui ventilação natural?",
            type: "radio" as const,
            required: false,
            options: [
                { label: "Sim", value: "Sim" },
                { label: "Não", value: "Nao" }
            ],
            insertAfterField: formValues.cozinhaVentilacaoNatural === "Sim" ? "cozinhaSalubridade" : "cozinhaVentilacaoNatural"
        });
        
        // Adiciona campo de salubridade para banheiro se tiver ventilação natural
        if (formValues.banheiroVentilacaoNatural === "Sim") {
            conditionalFields.push({
                name: "banheiroSalubridade",
                label: "Banheiro: A área de ventilação transmite sensação de salubridade?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "banheiroVentilacaoNatural"
            });
        }
        
        conditionalFields.push({
            name: "demaisComodosVentilacaoNatural",
            label: "Demais cômodos: Possui ventilação natural?",
            type: "radio" as const,
            required: false,
            options: [
                { label: "Sim", value: "Sim" },
                { label: "Não", value: "Nao" }
            ],
            insertAfterField: formValues.banheiroVentilacaoNatural === "Sim" ? "banheiroSalubridade" : "banheiroVentilacaoNatural"
        });
        
        // Adiciona campo de salubridade para demais cômodos se tiver ventilação natural
        if (formValues.demaisComodosVentilacaoNatural === "Sim") {
            conditionalFields.push({
                name: "demaisComodosSalubridade",
                label: "Demais cômodos: A área de ventilação transmite sensação de salubridade?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "Sim" },
                    { label: "Não", value: "Nao" }
                ],
                insertAfterField: "demaisComodosVentilacaoNatural"
            });
        }
    }

    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from IdentEticRacGene form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Começar com os campos base da seção
    const baseFields = [...caracInfraUrbUnidDefinition.sections[0].fields];
    
    // Para cada campo condicional, determinar onde inserir
    conditionalFields.forEach(conditionalField => {
        if (conditionalField.insertAfterField) {
            // Se tiver insertAfterField, encontrar este campo na lista
            const targetIndex = baseFields.findIndex(field => field.name === conditionalField.insertAfterField);
            
            if (targetIndex !== -1) {
                // Inserir após o campo de referência
                baseFields.splice(targetIndex + 1, 0, conditionalField);
            } else {
                // Se o campo referenciado não for encontrado, inserir após unidadeInsalubre
                const defaultIndex = baseFields.findIndex(field => field.name === "unidadeInsalubre");
                if (defaultIndex !== -1) {
                    baseFields.splice(defaultIndex + 1, 0, conditionalField);
                } else {
                    // Fallback: adicionar ao final
                    baseFields.push(conditionalField);
                }
            }
        } else {
            // Para manter compatibilidade com o código existente, 
            // se não tiver insertAfterField, inserir após unidadeInsalubre
            const defaultIndex = baseFields.findIndex(field => field.name === "unidadeInsalubre");
            if (defaultIndex !== -1) {
                baseFields.splice(defaultIndex + 1, 0, conditionalField);
            } else {
                // Fallback: adicionar ao final
                baseFields.push(conditionalField);
            }
        }
    });

    // Create and return a merged form structure
    return [
        {
            ...caracInfraUrbUnidDefinition.sections[0],
            fields: baseFields
        }
    ];
} 