import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Define the disability and assistive technology types
export interface DeficienciaItem {
    deficiencia: string;
    quantidade: number;
    defDoResponsavel: boolean;
}

export interface TecnologiaItem {
    tecnologia: string;
    defDoResponsavel: boolean;
}

// Form validation schema
export const pessoaDefSchema = z.object({
    temPessoaDeficienciaFam: z.string().optional(),
    qtdPessoasComDefFam: z.number().optional(),
    responsavelTemDeficiencia: z.string().optional(),
    responsavelPossuiLaudo: z.string().optional(),
    tiposDeficiencia: z.array(z.string()).optional(),
    deficienciaEspecifica: z.string().optional(),
    utilizaTecnologiaAssistida: z.string().optional(),
    tecnologiasAssistivas: z.array(z.string()).optional(),
    tecnologiaEspecifica: z.string().optional(),
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
    tiposDeficiencia: [],
    deficienciaEspecifica: "",
    utilizaTecnologiaAssistida: "",
    tecnologiasAssistivas: [],
    tecnologiaEspecifica: "",
    idLocal: "not",
};

// Disability types list
export const deficienciasList: DeficienciaItem[] = [
    { deficiencia: 'Física', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Visual', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Auditiva', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Intelectual/Mental', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Múltiplas', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Mobilidade Reduzida', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Surdo-cegueira', quantidade: 0, defDoResponsavel: false },
    { deficiencia: 'Outra', quantidade: 0, defDoResponsavel: false }
];

// Assistive technology types list
export const tecnologiasList: TecnologiaItem[] = [
    { tecnologia: "Aparelho Auditivo", defDoResponsavel: false },
    { tecnologia: "Órteses/Próteses", defDoResponsavel: false },
    { tecnologia: "Cadeira de Rodas", defDoResponsavel: false },
    { tecnologia: "Cama Hospitalar", defDoResponsavel: false },
    { tecnologia: "Muleta/Bengala 4 Pontas/Andador", defDoResponsavel: false },
    { tecnologia: "Lupas/Lentes/Fonte Ampliadas ou Contraste", defDoResponsavel: false },
    { tecnologia: "Braille ou Equipamento com Síntese de Voz", defDoResponsavel: false },
    { tecnologia: "Libras", defDoResponsavel: false },
    { tecnologia: "Leitura Facial/Labial", defDoResponsavel: false },
    { tecnologia: "Bengala Branca ou Verde Vermelha", defDoResponsavel: false },
    { tecnologia: "Cão Guia", defDoResponsavel: false },
    { tecnologia: "Prancha de Comunicação Alternativa", defDoResponsavel: false },
    { tecnologia: "Outro", defDoResponsavel: false }
];

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
    
    // Add fields that appear when a person in the family has disabilities
    if (formValues.temPessoaDeficienciaFam === "sim") {
        conditionalFields.push(
            {
                name: "qtdPessoasComDefFam",
                label: "Quantidade de pessoas com deficiência na família",
                type: "text" as const,
                required: false,
                // Use mask for number input with min value instead of inputType
                mask: "9999",
                placeholder: "Quantidade (mínimo 1)",
                insertAfterField: "temPessoaDeficienciaFam"
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
                insertAfterField: "qtdPessoasComDefFam"
            },
            // Note: For complex checkboxes, we may need a custom renderer component
            {
                name: "tiposDeficiencia",
                label: "Qual/quais os tipos de deficiência?",
                type: "checkbox" as const,
                required: false,
                options: deficienciasList.map(def => ({
                    label: def.deficiencia,
                    value: JSON.stringify(def)
                })),
                insertAfterField: "responsavelTemDeficiencia"
            },
            {
                name: "utilizaTecnologiaAssistida",
                label: "Utiliza tecnologia assistiva?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ],
                insertAfterField: "tiposDeficiencia"
            }
        );
    }
    
    // Add field that appears when the responsible person has disabilities
    if (formValues.responsavelTemDeficiencia === "sim") {
        conditionalFields.push({
            name: "responsavelPossuiLaudo",
            label: "A pessoa responsável possui laudo médico",
            type: "radio" as const,
            required: false,
            options: [
                { label: "Sim", value: "sim" },
                { label: "Não", value: "nao" }
            ],
            insertAfterField: "responsavelTemDeficiencia"
        });
    }
    
    // Add field for other disability type
    if (formValues.tiposDeficiencia?.some(item => JSON.parse(item).deficiencia === "Outra")) {
        conditionalFields.push({
            name: "deficienciaEspecifica",
            label: "Especificar outro tipo de deficiência",
            type: "text" as const,
            required: false,
            insertAfterField: "tiposDeficiencia"
        });
    }
    
    // Add fields for assistive technologies
    if (formValues.utilizaTecnologiaAssistida === "sim") {
        conditionalFields.push({
            name: "tecnologiasAssistivas",
            label: "Qual tecnologia assistiva utiliza?",
            type: "checkbox" as const,
            required: false,
            options: tecnologiasList.map(tec => ({
                label: tec.tecnologia,
                value: JSON.stringify(tec)
            })),
            insertAfterField: "utilizaTecnologiaAssistida"
        });
    }
    
    // Add field for other assistive technology
    if (formValues.tecnologiasAssistivas?.some(item => JSON.parse(item).tecnologia === "Outro")) {
        conditionalFields.push({
            name: "tecnologiaEspecifica",
            label: "Especificar outro tipo de tecnologia assistiva",
            type: "text" as const,
            required: false,
            insertAfterField: "tecnologiasAssistivas"
        });
    }
    
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values from PessoaDef form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Começar com os campos base da seção
    const baseFields = [...pessoaDefDefinition.sections[0].fields];
    
    // Para cada campo condicional, determinar onde inserir
    conditionalFields.forEach(conditionalField => {
        if (conditionalField.insertAfterField) {
            // Se tiver insertAfterField, encontrar este campo na lista
            const targetIndex = baseFields.findIndex(field => field.name === conditionalField.insertAfterField);
            
            if (targetIndex !== -1) {
                // Inserir após o campo de referência
                baseFields.splice(targetIndex + 1, 0, conditionalField);
            } else {
                // Se o campo referenciado não for encontrado, adicionar ao final
                baseFields.push(conditionalField);
            }
        } else {
            // Se não tiver insertAfterField, adicionar ao final (comportamento padrão)
            baseFields.push(conditionalField);
        }
    });

    // Create and return a merged form structure
    return [
        {
            ...pessoaDefDefinition.sections[0],
            fields: baseFields
        }
    ];
} 