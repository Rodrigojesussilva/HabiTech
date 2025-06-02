import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";


// Form validation schema
export const pessoaDefSchema = z.object({
    temPessoaDeficienciaFam: z.string().optional(),
    qtdPessoasComDefFam: z.number().optional(),
    responsavelTemDeficiencia: z.string().optional(),
    responsavelPossuiLaudo: z.string().optional(),
    defFisica: z.string().optional(),
    defVisual: z.string().optional(),
    defAuditiva: z.string().optional(),
    defIntelectualMental: z.string().optional(),
    defMultiplas: z.string().optional(),
    defMobilidadeReduzida: z.string().optional(),
    defSurdoCegueira: z.string().optional(),
    defOutra: z.string().optional(),
    tecnologiaAssistiva: z.string().optional(),
    aparelhoAuditivo: z.string().optional(),
    ortesesProteses: z.string().optional(),
    cadeiraRoda: z.string().optional(),
    camaHospitalar: z.string().optional(),
    muletaBengala4pontasAndador: z.string().optional(),
    lupaLenteFontaAmpliada: z.string().optional(),
    brailleEquipSinteseVoz: z.string().optional(),
    libras: z.string().optional(),
    leituraFacialLabial: z.string().optional(),
    bengalaBrancaOuVerdeVermelha: z.string().optional(),
    caoGuia: z.string().optional(),
    pranchaComunicacaoAlternativa: z.string().optional(),
    outrasTecAssistiva: z.string().optional(),
    quantFisica: z.string().optional(),
    quantVisual: z.string().optional(),
    quantAuditiva: z.string().optional(),
    quantIntelectual: z.string().optional(),
    quantMultiplas: z.string().optional(),
    quantMobilidade: z.string().optional(),
    quantSurdo: z.string().optional(),
    eOutras: z.string().optional(),
    responsavelDefFisica: z.string().optional(),
    responsavelDefVisual: z.string().optional(),
    responsavelDefAuditiva: z.string().optional(),
    responsavelDefIntelectual: z.string().optional(),
    responsavelDefMultipla: z.string().optional(),
    responsavelDefMobilidade: z.string().optional(),
    responsavelDefSurdoCegueira: z.string().optional(),
    responsavelDefOutra: z.string().optional(),
    responsavelAparelhoAuditivo: z.string().optional(),
    responsavelOrteseProtese: z.string().optional(),
    responsavelCadeiraRoda: z.string().optional(),
    responsavelCamaHospitalar: z.string().optional(),
    responsavelMuletaBengala4pontasAndador: z.string().optional(),
    responsavelLupaLenteFontaAmpliada: z.string().optional(),
    responsavelBrailleEquipSinteseVoz: z.string().optional(),
    responsavelLibras: z.string().optional(),
    responsavelLeituraFacialLabial: z.string().optional(),
    responsavelBnglBranOuVerdVerm: z.string().optional(),
    responsavelCaoGuia: z.string().optional(),
    responsavelPrancha: z.string().optional(),
    responsavelOutraTecAssistiva: z.string().optional(),
    

    
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),

});

export type FormValues = z.infer<typeof pessoaDefSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    temPessoaDeficienciaFam: "",
    qtdPessoasComDefFam: 0,
    responsavelTemDeficiencia: "",
    responsavelPossuiLaudo: "",
    defFisica: "",
    defVisual: "",
    defAuditiva: "",
    defIntelectualMental: "",
    defMultiplas: "",
    defMobilidadeReduzida: "",
    defSurdoCegueira: "",
    defOutra: "",
    tecnologiaAssistiva: "",
    aparelhoAuditivo: "",
    ortesesProteses: "",
    cadeiraRoda: "",
    camaHospitalar: "",
    muletaBengala4pontasAndador: "",
    lupaLenteFontaAmpliada: "",
    brailleEquipSinteseVoz: "",
    libras: "",
    leituraFacialLabial: "",
    bengalaBrancaOuVerdeVermelha: "",
    caoGuia: "",
    pranchaComunicacaoAlternativa: "",
    outrasTecAssistiva: "",
    quantFisica: "",
    quantVisual: "",
    quantAuditiva: "",
    quantIntelectual: "",
    quantMultiplas: "",
    quantMobilidade: "",
    quantSurdo: "",
    eOutras: "",
    responsavelDefFisica: "",
    responsavelDefVisual: "",
    responsavelDefAuditiva: "",
    responsavelDefIntelectual: "",
    responsavelDefMultipla: "",
    responsavelDefMobilidade: "",
    responsavelDefSurdoCegueira: "",
    responsavelDefOutra: "",
    responsavelAparelhoAuditivo: "",
    responsavelOrteseProtese: "",
    responsavelCadeiraRoda: "",
    responsavelCamaHospitalar: "",
    responsavelMuletaBengala4pontasAndador: "",
    responsavelLupaLenteFontaAmpliada: "",
    responsavelBrailleEquipSinteseVoz: "",
    responsavelLibras: "",
    responsavelLeituraFacialLabial: "",
    responsavelBnglBranOuVerdVerm: "",
    responsavelCaoGuia: "",
    responsavelPrancha: "",
    responsavelOutraTecAssistiva: "",
    


    idLocal: "not",
};





// Base form structure
export const pessoaDefDefinition: FormConfig = {
    title: "Pessoa com Deficiência",
    sections: [
        {
            id: "pessoaComDeficiencia",
            title: "Pessoa com Deficiência",
            fields: [
                {
                    name: "temPessoaDeficienciaFam",
                    label: "Alguma pessoa da família tem deficiência?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for PessoaDef form
 * @param formValues Current form values from PessoaDef form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];


    if (formValues.temPessoaDeficienciaFam === "sim") {
        conditionalFields.push(

            {
                name: "qtdPessoasComDefFam",
                label: "Quantidade de pessoas com deficiência na família",
                type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,


            },
            {
                name: "responsavelTemDeficiencia",
                label: "A pessoa responsável pela unidade tem deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ],

            },
            {
                name: "tiposDeficiencia",
                label: "Qual/quais os tipos de deficiência?",
                type: "label" as const,
                required: false,

            },
            {
                name: "defFisica",
                label: "Física",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defVisual",
                label: "Visual",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defAuditiva",
                label: "Auditiva",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defIntelectualMental",
                label: "Intelectual/Mental",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defMultiplas",
                label: "Múltiplas",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defMobilidadeReduzida",
                label: "Mobilidade Reduzida",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defSurdoCegueira",
                label: "Surdo-cegueira",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "defOutra",
                label: "Outra",
                type: "checkbox" as const,
                required: false,
                dependent: true,

            },
            {
                name: "tecnologiaAssistiva",
                label: "Utiliza tecnologia assistiva",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ],

            },


        );

        if (formValues.defFisica && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefFisica",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defFisica) {
            conditionalFields.push(
                {
                    name: "quantFisica",
                    label: "Quantas pessoas tem deficiência",
                    type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true

                },

            );
        }

        if (formValues.defVisual && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefVisual",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defVisual) {
            conditionalFields.push(
                {
                    name: "quantVisual",
                    label: "Quantas pessoas tem deficiência",
                    type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true

                },

            );
        }

        if (formValues.defAuditiva && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefAuditiva",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defAuditiva) {
            conditionalFields.push(
                {
                    name: "quantAuditiva",
                    label: "Quantas pessoas tem deficiência Auditiva",
                    type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true

                },

            );
        }

        if (formValues.defIntelectualMental && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefIntelectual",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defIntelectualMental) {
            conditionalFields.push(
                {
                    name: "quantIntelectual",
                    label: "Quantas pessoas tem deficiência Intelectual/Mental",
                     type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true

                },

            );
        }

        if (formValues.defMultiplas && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefMultipla",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defMultiplas) {
            conditionalFields.push(
                {
                    name: "quantMultiplas",
                    label: "Quantas pessoas tem deficiência Multiplas",
                    type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true

                },

            );
        }

        if (formValues.defMobilidadeReduzida && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefMobilidade",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defMobilidadeReduzida) {
            conditionalFields.push(
                {
                    name: "quantMobilidade",
                    label: "Quantas pessoas tem deficiência de Mobilidade Reduzida",
                    type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true

                },

            );
        }

        if (formValues.defSurdoCegueira && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefSurdoCegueira",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defSurdoCegueira) {
            conditionalFields.push(
                {
                    name: "quantSurdo",
                    label: "Quantas pessoas tem deficiência de Surdez-Cegueira",
                    type: "numberSpinner" as const,
                    required: false,
                    placeholder: "0",
                    min: 1,
                    max: 100,
                    step: 1,
                    dependent:true
                },

            );
        }

        if (formValues.defOutra && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelDefOutra",
                    label: "O responsável tem essa deficiência",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }

        if (formValues.defOutra) {
            conditionalFields.push(
                {
                    name: "eOutras",
                    label: "Especificar outros tipos de deficiência:",
                    type: "textarea" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
    }

    if (formValues.tecnologiaAssistiva === "sim") {
        conditionalFields.push(
            {
                name: "tecnologiasAssistivasUsadas",
                label: "Quais tecnologias assistivas são utilizadas?",
                type: "label" as const,
                required: false,
            },
            {
                name: "aparelhoAuditivo",
                label: "Aparelho Auditivo",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "ortesesProteses",
                label: "Órteses/Próteses",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "cadeiraRoda",
                label: "Cadeira de Roda",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "camaHospitalar",
                label: "Cama Hospitalar",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "muletaBengala4pontasAndador",
                label: "Muleta/Bengala 4 pontas/Andador",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "lupaLenteFontaAmpliada",
                label: "Lupa/Lente/Fonta Ampliada ou Contraste",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "brailleEquipSinteseVoz",
                label: "Braille Equipamento com Síntese Voz",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "libras",
                label: "Libras",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "leituraFacialLabial",
                label: "Leitura Facial/Labial",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "bengalaBrancaOuVerdeVermelha",
                label: "Bengala Branca ou Verde Vermelha",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "caoGuia",
                label: "Cão Guia",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "pranchaComunicacaoAlternativa",
                label: "Prancha de Comunicação Alternativa",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },
            {
                name: "outrasTecAssistiva",
                label: "Outras",
                type: "checkbox" as const,
                required: false,
                dependent: true,
            },


        );
        if (formValues.aparelhoAuditivo && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelAparelhoAuditivo",
                    label: "O responsável utiliza aparelho aditivo",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,
                    
                },

            );
        }
        if (formValues.ortesesProteses && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelOrteseProtese",
                    label: "O responsável utiliza Órteses/Próteses",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.cadeiraRoda && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelCadeiraRoda",
                    label: "O responsável utiliza Cadeira de Roda",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.camaHospitalar && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelCamaHospitalar",
                    label: "O responsável utiliza Cama Hospitalar",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.muletaBengala4pontasAndador && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelMuletaBengala4pontasAndador",
                    label: "O responsável utliza Muleta/Bengala 4 pontas/Andador",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.lupaLenteFontaAmpliada && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelLupaLenteFontaAmpliada",
                    label: "O responsável utliza Lupa/Lente/Fonta Ampliada ou Contraste",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.brailleEquipSinteseVoz && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelBrailleEquipSinteseVoz",
                    label: "O responsável utiliza Braille Equipamento com Síntese Voz",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.libras && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelLibras",
                    label: "O responsável utliza Libras",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.leituraFacialLabial && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelLeituraFacialLabial",
                    label: "O responsável utiliza Leitura Facial/Labial",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.bengalaBrancaOuVerdeVermelha && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelBnglBranOuVerdVerm",
                    label: "O responsável utiliza Bengala Branca ou Verde Vermelha",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.caoGuia && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelCaoGuia",
                    label: "O responsável utliza Cão Guia",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
        if (formValues.pranchaComunicacaoAlternativa && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelPrancha",
                    label: "O responsável utiliza Prancha de Comunicação Alternativa",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
         if (formValues.outrasTecAssistiva && formValues.responsavelTemDeficiencia === "sim") {
            conditionalFields.push(
                {
                    name: "responsavelOutraTecAssistiva",
                    label: "Especificar outros tipos tecnologias assistivas",
                    type: "textarea" as const,
                    required: false,
                    dependent: true,

                },

            );
        }
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
 * @param formValues Current form values from PessoaDef form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {

        // Get conditional fields based on current form values
        const conditionalFields = getConditionalFields(formValues);
        const baseFields = [...pessoaDefDefinition.sections[0].fields];

        afterInsert(baseFields, conditionalFields, "temPessoaDeficienciaFam", [
            "qtdPessoasComDefFam",
            "responsavelTemDeficiencia",
            "tiposDeficiencia",
            "defFisica",
            "defVisual",
            "defAuditiva",
            "defIntelectualMental",
            "defMultiplas",
            "defMobilidadeReduzida",
            "defSurdoCegueira",
            "defOutra",
            "especifiqueOutra",
            "tecnologiaAssistiva"
        ]);
        afterInsert(baseFields, conditionalFields, "tecnologiaAssistiva", [
            "tecnologiasAssistivasUsadas",
            "aparelhoAuditivo",
            "ortesesProteses",
            "cadeiraRoda",
            "camaHospitalar",
            "muletaBengala4pontasAndador",
            "lupaLenteFontaAmpliada",
            "brailleEquipSinteseVoz",
            "libras",
            "leituraFacialLabial",
            "bengalaBrancaOuVerdeVermelha",
            "caoGuia",
            "pranchaComunicacaoAlternativa",
            "outrasTecAssistiva",

        ]);
        afterInsert(baseFields, conditionalFields, "defFisica", [
            "quantFisica", "responsavelDefFisica"
        ]);
        afterInsert(baseFields, conditionalFields, "defVisual", [
            "quantVisual", "responsavelDefVisual"
        ]);
        afterInsert(baseFields, conditionalFields, "defAuditiva", [
            "quantAuditiva", "responsavelDefAuditiva",
        ]);
        afterInsert(baseFields, conditionalFields, "defIntelectualMental", [
            "quantIntelectual", "responsavelDefIntelectual",
        ]);
        afterInsert(baseFields, conditionalFields, "defMultiplas", [
            "quantMultiplas", "responsavelDefMultipla",
        ]);
        afterInsert(baseFields, conditionalFields, "defMobilidadeReduzida", [
            "quantMobilidade", "responsavelDefMobilidade",
        ]);
        afterInsert(baseFields, conditionalFields, "defSurdoCegueira", [
            "quantSurdo", "responsavelDefSurdoCegueira"
        ]);
        afterInsert(baseFields, conditionalFields, "defOutra", [
            "eOutras", "responsavelDefOutra"
        ]);
        afterInsert(baseFields, conditionalFields, "aparelhoAuditivo", [
            "responsavelAparelhoAuditivo"
        ]);
        afterInsert(baseFields, conditionalFields, "ortesesProteses", [
            "responsavelOrteseProtese"
        ]);
        afterInsert(baseFields, conditionalFields, "cadeiraRoda", [
            "responsavelCadeiraRoda"
        ]);
        afterInsert(baseFields, conditionalFields, "camaHospitalar", [
            "responsavelCamaHospitalar"
        ]);
        afterInsert(baseFields, conditionalFields, "muletaBengala4pontasAndador", [
            "responsavelMuletaBengala4pontasAndador"
        ]);
        afterInsert(baseFields, conditionalFields, "lupaLenteFontaAmpliada", [
            "responsavelLupaLenteFontaAmpliada"
        ]);
        afterInsert(baseFields, conditionalFields, "brailleEquipSinteseVoz", [
            "responsavelBrailleEquipSinteseVoz"
        ]);
        afterInsert(baseFields, conditionalFields, "libras", [
            "responsavelLibras"
        ]);
        afterInsert(baseFields, conditionalFields, "leituraFacialLabial", [
            "responsavelLeituraFacialLabial"
        ])
        afterInsert(baseFields, conditionalFields, "bengalaBrancaOuVerdeVermelha", [
            "responsavelBnglBranOuVerdVerm"
        ])
         afterInsert(baseFields, conditionalFields, "caoGuia", [
            "responsavelCaoGuia"
        ])
         afterInsert(baseFields, conditionalFields, "pranchaComunicacaoAlternativa", [
            "responsavelPrancha"
        ])
         afterInsert(baseFields, conditionalFields, "outrasTecAssistiva", [
            "responsavelOutraTecAssistiva"
        ])

        return [
            {
                ...pessoaDefDefinition.sections[0],
                fields: baseFields
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        return [pessoaDefDefinition.sections[0]];
    }
} 