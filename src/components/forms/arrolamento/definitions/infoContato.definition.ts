import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const infoContatoSchema = z.object({
    // Instead of an array, we'll define individual telefone fields that can be enabled/disabled
    telefone1: z.string().optional(),
    tipoTelefone1: z.string().optional(),
    telefone2: z.string().optional(),
    tipoTelefone2: z.string().optional(),
    telefone3: z.string().optional(),
    tipoTelefone3: z.string().optional(),
    telefone4: z.string().optional(),
    tipoTelefone4: z.string().optional(),

    telefone1WhatsApp: z.boolean().optional(),
    telefone2WhatsApp: z.boolean().optional(),
    telefone3WhatsApp: z.boolean().optional(),
    telefone4WhatsApp: z.boolean().optional(),

    ativarTelefone2: z.boolean().optional(),
    ativarTelefone3: z.boolean().optional(),
    ativarTelefone4: z.boolean().optional(),

    telefoneRecado: z.string().optional(),
    nomeRecado: z.string().optional(),
    parente: z.string().optional(),
    escrevParentesco: z.string().optional(),



    nomeRecado2: z.string().optional(),
    parente2: z.string().optional(),
    escrevParentesco2: z.string().optional(),



    nomeRecado3: z.string().optional(),
    parente3: z.string().optional(),
    escrevParentesco3: z.string().optional(),

    nomeRecado4: z.string().optional(),
    parente4: z.string().optional(),
    escrevParentesco4: z.string().optional(),

    email: z.string().optional(),
    naoSabeEmail: z.boolean().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),

});

export type FormValues = z.infer<typeof infoContatoSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    telefone1: "",
    tipoTelefone1: "",
    telefone2: "",
    tipoTelefone2: "",
    telefone3: "",
    tipoTelefone3: "",
    telefone4: "",
    tipoTelefone4: "",

    ativarTelefone2: false,
    ativarTelefone3: false,
    ativarTelefone4: false,

    telefone1WhatsApp: false,
    telefone2WhatsApp: false,
    telefone3WhatsApp: false,
    telefone4WhatsApp: false,

    nomeRecado: "",
    parente: "",
    escrevParentesco: "",


    nomeRecado2: "",
    parente2: "",
    escrevParentesco2: "",


    nomeRecado3: "",
    parente3: "",
    escrevParentesco3: "",

    nomeRecado4: "",
    parente4: "",
    escrevParentesco4: "",

    email: "",
    naoSabeEmail: false,
    idLocal: "not",
};

// Base form structure (without conditional fields)
export const infoContatoDefinition: FormConfig = {
    title: "Informações para Contato",
    sections: [
        {
            id: "informacoesContato",
            title: "Informações para Contato",
            fields: [
                {
                    name: "telefone1",
                    label: "Telefone 1",
                    type: "text" as const,
                    required: false,
                    mask: "(99) 99999-9999",
                    placeholder: "Digite o 1º telefone"
                },
                {
                    name: "tipoTelefone1",
                    label: "Tipo de telefone 1",
                    type: "select" as const,
                    required: true,

                    options: [

                        { label: "Selecione uma opção", value: "select" },
                        { label: "Celular", value: "celular" },
                        { label: "Residencial", value: "residencial" },
                        { label: "Comercial", value: "comercial" },
                        { label: "Recado", value: "recado" },

                    ]
                },

                // Option to add second telefone
                {
                    name: "ativarTelefone2",
                    label: "Adicionar segundo telefone",
                    type: "checkbox" as const,
                    required: false
                },

                {
                    name: "email",
                    label: "Email",
                    type: "email",
                    required: false,
                    placeholder: "Digite o email"

                },
                {
                    name: "naoSabeEmail",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    disableField: "email",
                    dependent: true,

                }
            ]
        }
    ]
};

/**
 * Get additional conditional fields based on form values for InfoContato form
 * This centralizes all conditional field logic specific to InfoContato in one place
 * @param formValues Current form values from InfoContato form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];

    // Se tipoTelefone1 for "celular", exibe checkbox de WhatsApp
    if (formValues.tipoTelefone1 === "celular") {
        conditionalFields.push({
            name: "telefone1WhatsApp",
            label: "Este celular tem WhatsApp?",
            type: "checkbox",
            required: false
        });
    }
    // Se tipoTelefone1 for "recado", exibe campos adicionais para recado
    if (formValues.tipoTelefone1 === "recado") {
        conditionalFields.push(
            {
                name: "nomeRecado",
                label: "Nome da Pessoa para Recado",
                type: "text",
                required: false,
                placeholder: "Digite o nome da pessoa para recado"
            },
            {
                name: "parente",
                label: "Relação de Parentesco",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Cônjuge/Companheiro", value: "conjuge_companheiro" },
                    { label: "Filha", value: "filha" },
                    { label: "Filho", value: "filho" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Irmã", value: "irma" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Mãe", value: "mae" },
                    { label: "Pai", value: "pai" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Neta", value: "neta" },
                    { label: "Neto", value: "neto" },
                    { label: "Nora", value: "nora" },
                    { label: "Genro", value: "genro" },
                    { label: "Madastra", value: "madastra" },
                    { label: "Padastro", value: "padastro" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sem Relação de Parentesco", value: "sem_relação" },
                    { label: "Não sabe informar", value: "nao_sabe" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            }
        );
    }
    // Se tipoTelefone2 for "celular", exibe checkbox de WhatsApp
    if (formValues.tipoTelefone2 === "celular") {
        conditionalFields.push({
            name: "telefone2WhatsApp",
            label: "Este celular tem WhatsApp?",
            type: "checkbox",
            required: false
        });
    }
    // Se tipoTelefone2 for "recado", exibe campos adicionais para recado
    if (formValues.tipoTelefone2 === "recado") {
        conditionalFields.push(
            {
                name: "nomeRecado2",
                label: "Nome da Pessoa para Recado",
                type: "text",
                required: false,
                placeholder: "Digite o nome da pessoa para recado"
            },
            {
                name: "parente2",
                label: "Relação de Parentesco",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Cônjuge/Companheiro", value: "conjuge_companheiro" },
                    { label: "Filha", value: "filha" },
                    { label: "Filho", value: "filho" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Irmã", value: "irma" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Mãe", value: "mae" },
                    { label: "Pai", value: "pai" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Neta", value: "neta" },
                    { label: "Neto", value: "neto" },
                    { label: "Nora", value: "nora" },
                    { label: "Genro", value: "genro" },
                    { label: "Madastra", value: "madastra" },
                    { label: "Padastro", value: "padastro" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sem Relação de Parentesco", value: "sem_relação" },
                    { label: "Não sabe informar", value: "nao_sabe" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            }
        );
    }
    // Se tipoTelefone3 for "celular", exibe checkbox de WhatsApp
    if (formValues.tipoTelefone3 === "celular") {
        conditionalFields.push({
            name: "telefone3WhatsApp",
            label: "Este celular tem WhatsApp?",
            type: "checkbox",
            required: false
        });
    }
    // Se tipoTelefone3 for "recado", exibe campos adicionais para recado
    if (formValues.tipoTelefone3 === "recado") {
        conditionalFields.push(

            {
                name: "nomeRecado3",
                label: "Nome da Pessoa para Recado",
                type: "text",
                required: false,
                placeholder: "Digite o nome da pessoa para recado"
            },
            {
                name: "parente3",
                label: "Relação de Parentesco",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Cônjuge/Companheiro", value: "conjuge_companheiro" },
                    { label: "Filha", value: "filha" },
                    { label: "Filho", value: "filho" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Irmã", value: "irma" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Mãe", value: "mae" },
                    { label: "Pai", value: "pai" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Neta", value: "neta" },
                    { label: "Neto", value: "neto" },
                    { label: "Nora", value: "nora" },
                    { label: "Genro", value: "genro" },
                    { label: "Madastra", value: "madastra" },
                    { label: "Padastro", value: "padastro" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sem Relação de Parentesco", value: "sem_relação" },
                    { label: "Não sabe informar", value: "nao_sabe" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            }
        );
    }
    // Se tipoTelefone4 for "celular", exibe checkbox de WhatsApp
    if (formValues.tipoTelefone4 === "celular") {
        conditionalFields.push({
            name: "telefone4WhatsApp",
            label: "Este celular tem WhatsApp?",
            type: "checkbox",
            required: false
        });
    }
    // Se tipoTelefone4 for "recado", exibe campos adicionais para recado
    if (formValues.tipoTelefone4 === "recado") {
        conditionalFields.push(

            {
                name: "nomeRecado4",
                label: "Nome da Pessoa para Recado",
                type: "text",
                required: false,
                placeholder: "Digite o nome da pessoa para recado"
            },
            {
                name: "parente4",
                label: "Relação de Parentesco",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Cônjuge/Companheiro", value: "conjuge_companheiro" },
                    { label: "Filha", value: "filha" },
                    { label: "Filho", value: "filho" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Irmã", value: "irma" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Mãe", value: "mae" },
                    { label: "Pai", value: "pai" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Neta", value: "neta" },
                    { label: "Neto", value: "neto" },
                    { label: "Nora", value: "nora" },
                    { label: "Genro", value: "genro" },
                    { label: "Madastra", value: "madastra" },
                    { label: "Padastro", value: "padastro" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sem Relação de Parentesco", value: "sem_relação" },
                    { label: "Não sabe informar", value: "nao_sabe" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            }
        );
    }
    // Se telefone 2 estiver ativado, mostra campos relacionados
    if (formValues.ativarTelefone2 === true) {
        conditionalFields.push(
            {
                name: "telefone2",
                label: "Telefone 2",
                type: "text",
                required: false,
                mask: "(99) 99999-9999",
                placeholder: "Digite o 2º telefone"
            },
            {
                name: "tipoTelefone2",
                label: "Tipo de telefone 2",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Celular", value: "celular" },
                    { label: "Residencial", value: "residencial" },
                    { label: "Comercial", value: "comercial" },
                    { label: "Recado", value: "recado" }
                ]
            },
            {
                name: "ativarTelefone3",
                label: "Adicionar terceiro telefone",
                type: "checkbox",
                required: false
            }
        );
    }
    // Se telefone 3 estiver ativado, mostra campos relacionados
    if (formValues.ativarTelefone3 === true) {
        conditionalFields.push(
            {
                name: "telefone3",
                label: "Telefone 3",
                type: "text",
                required: false,
                mask: "(99) 99999-9999",
                placeholder: "Digite o 3º telefone"
            },
            {
                name: "tipoTelefone3",
                label: "Tipo de telefone 3",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Celular", value: "celular" },
                    { label: "Residencial", value: "residencial" },
                    { label: "Comercial", value: "comercial" },
                    { label: "Recado", value: "recado" }
                ]
            },
            {
                name: "ativarTelefone4",
                label: "Adicionar quarto telefone",
                type: "checkbox",
                required: false
            }
        );
    }
    // Se telefone 4 estiver ativado, mostra campos relacionados
    if (formValues.ativarTelefone4 === true) {
        conditionalFields.push(
            {
                name: "telefone4",
                label: "Telefone 4",
                type: "text",
                required: false,
                mask: "(99) 99999-9999",
                placeholder: "Digite o 4º telefone"
            },
            {
                name: "tipoTelefone4",
                label: "Tipo de telefone 4",
                type: "select" as const,
                required: true,
                options: [
                    { label: "Selecione uma opção", value: "select" },
                    { label: "Celular", value: "celular" },
                    { label: "Residencial", value: "residencial" },
                    { label: "Comercial", value: "comercial" },
                    { label: "Recado", value: "recado" }
                ]
            },

        );
    }
    // Se parente for "outro", exibe campo para escrever o parentesco
    if (formValues.parente === "outro") {
        conditionalFields.push({
            name: "escrevParentesco",
            label: "Descreva o parentesco",
            type: "text",
            required: false
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
 * @param formValues Current form values from InfoContato form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    const conditionalFields = getConditionalFields(formValues);
    const baseFields = [...infoContatoDefinition.sections[0].fields];

    afterInsert(baseFields, conditionalFields, "ativarTelefone2", [
        "telefone2", "tipoTelefone2", "ativarTelefone3"
    ]);
    afterInsert(baseFields, conditionalFields, "ativarTelefone3", [
        "telefone3", "tipoTelefone3", "telefoneRecado3", "ativarTelefone4"
    ]);
    afterInsert(baseFields, conditionalFields, "ativarTelefone4", [
        "telefone4", "tipoTelefone4", "telefoneRecado4"
    ]);
    afterInsert(baseFields, conditionalFields, "tipoTelefone1", [
        "telefone1WhatsApp", "telefoneRecado", "nomeRecado", "parente"
    ]);
    afterInsert(baseFields, conditionalFields, "tipoTelefone2", [
        "telefone2WhatsApp", "telefoneRecado2", "nomeRecado2", "parente2"
    ]);
    afterInsert(baseFields, conditionalFields, "tipoTelefone3", [
        "telefone3WhatsApp", "telefoneRecado3", "nomeRecado3", "parente3"
    ]);
    afterInsert(baseFields, conditionalFields, "tipoTelefone4", [
        "telefone4WhatsApp", "telefoneRecado4", "nomeRecado4", "parente4"
    ]);

    return [
        {
            ...infoContatoDefinition.sections[0],
            fields: baseFields
        }
    ];
}














