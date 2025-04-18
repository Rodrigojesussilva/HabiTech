import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const docsSchema = z.object({
    paisOrigem: z.string().optional(),
    documentacao: z.string().optional(),
    numeroProtocolo: z.string().optional(),
    numeroRnm: z.string().optional(),
    statusRnm: z.string().optional(),
    numeroCrnm: z.string().optional(),
    statusCrnm: z.string().optional(),
    numeroPassaporte: z.string().optional(),
    uf: z.string().optional(),
    cidade: z.string().optional(),
    fonteRg: z.string().optional(),
    rg: z.string().optional(),
    orgaoExpedidor: z.string().optional(),
    estadoEmissaoRg: z.string().optional(),
    dataExpedicaoRg: z.string().optional(),
    cpf: z.string().optional(),
    fonteCpf: z.string().optional(),
    arrolamento_id: z.string().optional(),
    idLocal: z.string().optional(),
    tempoExpedicao: z.object({
        anos: z.number(),
        meses: z.number()
    }).optional(),
    dataExpedicaoCpf: z.string().optional(),
    tempoExpedicaoCpf: z.object({
        anos: z.number(),
        meses: z.number()
    }).optional(),
});

export type FormValues = z.infer<typeof docsSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    paisOrigem: "Brazil",
    documentacao: "",
    numeroProtocolo: "",
    numeroRnm: "",
    statusRnm: "",
    numeroCrnm: "",
    statusCrnm: "",
    numeroPassaporte: "",
    uf: "",
    cidade: "",
    fonteRg: "",
    rg: "",
    orgaoExpedidor: "",
    estadoEmissaoRg: "",
    dataExpedicaoRg: "",
    cpf: "",
    fonteCpf: "",
    idLocal: "not",
    tempoExpedicao: { anos: 0, meses: 0 },
    dataExpedicaoCpf: "",
    tempoExpedicaoCpf: { anos: 0, meses: 0 },
};

// Base form structure (without conditional fields)
export const docsDefinition: FormConfig = {
    title: "Documentação",
    sections: [
        {
            id: "documentacaoPessoalResponsavel",
            title: "Documentação da Pessoa Responsável",
            fields: [
                {
                    name: "paisOrigem",
                    label: "País de Origem",
                    type: "select" as const,
                    required: true,
                    options: [{label: "Brasil", value: "Brazil"}], // This will be populated dynamically from the helper function
                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for Docs form
 * This centralizes all conditional field logic specific to Docs in one place
 * @param formValues Current form values from Docs form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];
    
    // Conditionally add fields based on "paisOrigem" value
    if (formValues.paisOrigem === "Brazil") {
		console.log("Brazil");
        // Fields for Brazilian documents
        conditionalFields.push(
            {
                name: "uf",
                label: "Estado (UF)",
                type: "select",
                required: true,
                options: [] // Will be populated from helper function
            },
            {
                name: "cidade",
                label: "Cidade",
                type: "select",
                required: true,
                options: [] // Will be populated dynamically based on selected UF
            },
            {
                name: "fonteRg",
                label: "Fonte para RG",
                type: "select",
                required: true,
                options: [
                    { label: "CNH", value: "CNH" },
                    { label: "RG", value: "RG" }
                ]
            },
            {
                name: "rg",
                label: "Número do RG",
                type: "text",
                required: true
            },
            {
                name: "orgaoExpedidor",
                label: "Órgão Expedidor",
                type: "text",
                required: true
            },
            {
                name: "estadoEmissaoRg",
                label: "Estado de Emissão do RG",
                type: "select",
                required: true,
                options: [] // Will be populated from helper function
            },
            {
                name: "dataExpedicaoRg",
                label: "Data de Expedição do RG",
                type: "text",
                required: true,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA"
            },
            {
                name: "cpf",
                label: "CPF",
                type: "text",
                required: true,
                mask: "999.999.999-99"
            },
            {
                name: "fonteCpf",
                label: "Fonte para CPF",
                type: "select",
                required: true,
                options: [
                    { label: "CIN", value: "CIN" },
                    { label: "CPF", value: "CPF" }
                ]
            }
        );
    } else if (formValues.paisOrigem && formValues.paisOrigem !== "Brazil") {
        // Fields for immigrants
        conditionalFields.push({
            name: "documentacao",
            label: "Documentação",
            type: "select",
            required: true,
            options: [
                { label: "Protocolo", value: "Protocolo" },
                { label: "RNM", value: "RNM" },
                { label: "CRNM", value: "CRNM" },
                { label: "Passaporte", value: "Passaporte" }
            ]
        });

        // Additional fields based on documentacao selection
        if (formValues.documentacao === "Protocolo") {
            conditionalFields.push({
                name: "numeroProtocolo",
                label: "Número do Protocolo",
                type: "text",
                required: true
            });
        } else if (formValues.documentacao === "RNM") {
            conditionalFields.push(
                {
                    name: "numeroRnm",
                    label: "Número do RNM",
                    type: "text",
                    required: true
                },
                {
                    name: "statusRnm",
                    label: "Status do RNM",
                    type: "select",
                    required: true,
                    options: [
                        { label: "Válido", value: "Válido" },
                        { label: "Inválido", value: "Inválido" },
                        { label: "Pendente", value: "Pendente" }
                    ]
                }
            );
        } else if (formValues.documentacao === "CRNM") {
            conditionalFields.push(
                {
                    name: "numeroCrnm",
                    label: "Número do CRNM",
                    type: "text",
                    required: true
                },
                {
                    name: "statusCrnm",
                    label: "Status do CRNM",
                    type: "select",
                    required: true,
                    options: [
                        { label: "Válido", value: "Válido" },
                        { label: "Inválido", value: "Inválido" },
                        { label: "Pendente", value: "Pendente" }
                    ]
                }
            );
        } else if (formValues.documentacao === "Passaporte") {
            conditionalFields.push({
                name: "numeroPassaporte",
                label: "Número do Passaporte",
                type: "text",
                required: true
            });
        }
    }
    
    return conditionalFields;
}

/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from Docs form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);
	console.log("Conditional Fields", conditionalFields);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...docsDefinition.sections[0],
            fields: [
                ...docsDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 