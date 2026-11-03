import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const animalEstimacaoSchema = z.object({
    // Campos principais do animal
    possuiAnimalEstimacao: z.string().optional(),
    
    // Campos para animal 1 (sempre visível se tiver animal)
    nomeAnimal1: z.string().optional(),
    tipoAnimal1: z.string().optional(),
    especifiqueTipoAnimal1: z.string().optional(),
    sexoAnimal1: z.string().optional(),
    porteAnimal1: z.string().optional(),
    animalCastrado1: z.string().optional(),
    
    // Campos para animais adicionais
    ativarAnimal2: z.boolean().optional(),
    nomeAnimal2: z.string().optional(),
    tipoAnimal2: z.string().optional(),
    especifiqueTipoAnimal2: z.string().optional(),
    sexoAnimal2: z.string().optional(),
    porteAnimal2: z.string().optional(),
    animalCastrado2: z.string().optional(),
    
    ativarAnimal3: z.boolean().optional(),
    nomeAnimal3: z.string().optional(),
    tipoAnimal3: z.string().optional(),
    especifiqueTipoAnimal3: z.string().optional(),
    sexoAnimal3: z.string().optional(),
    porteAnimal3: z.string().optional(),
    animalCastrado3: z.string().optional(),

    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});

export type FormValues = z.infer<typeof animalEstimacaoSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    possuiAnimalEstimacao: "",
    nomeAnimal1: "",
    tipoAnimal1: "select",
    especifiqueTipoAnimal1: "",
    sexoAnimal1: "",
    porteAnimal1: "",
    animalCastrado1: "",
    
    ativarAnimal2: false,
    nomeAnimal2: "",
    tipoAnimal2: "select",
    especifiqueTipoAnimal2: "",
    sexoAnimal2: "",
    porteAnimal2: "",
    animalCastrado2: "",
    
    ativarAnimal3: false,
    nomeAnimal3: "",
    tipoAnimal3: "select",
    especifiqueTipoAnimal3: "",
    sexoAnimal3: "",
    porteAnimal3: "",
    animalCastrado3: "",

    idLocal: "not",
};

// Base form structure (without conditional fields) - APENAS O CAMPO PRINCIPAL
export const animalEstimacaoDefinition: FormConfig = {
    title: "Animal de Estimação",
    sections: [
        {
            id: "animaisEstimacao",
            title: "Animal de Estimação",
            fields: [
                {
                    name: "possuiAnimalEstimacao",
                    label: "Possui Animal de Estimação?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            ]
        }
    ]
};

// Opções para os selects - CORRIGIDO
const tipoAnimalOptions = [
    { label: "Selecione uma opção", value: "select" },
    { label: "Cachorro", value: "cachorro" },
    { label: "Gato", value: "gato" },
    { label: "Pássaro", value: "passaro" },
    { label: "Peixe", value: "peixe" },
    { label: "Tartaruga", value: "tartaruga" },
    { label: "Coelho", value: "coelho" },
    { label: "Porquinho da índia", value: "porquinho_da_india" },
    { label: "Hamster", value: "hamster" },
    { label: "Camundongo", value: "camundongo" },
    { label: "Cobra", value: "cobra" },
    { label: "Rã", value: "ra" },
    { label: "Galinha", value: "galinha" },
    { label: "Cabra", value: "cabra" },
    { label: "Bode", value: "bode" },
    { label: "Porco", value: "porco" },
    { label: "Boi", value: "boi" },
    { label: "Vaca", value: "vaca" },
    { label: "Cavalo", value: "cavalo" },
    { label: "Outros", value: "outros" }
];

const sexoAnimalOptions = [
    { label: "Macho", value: "macho" },
    { label: "Fêmea", value: "femea" },
];

const porteAnimalOptions = [
    { label: "Pequeno", value: "pequeno" },
    { label: "Médio", value: "medio" },
    { label: "Grande", value: "grande" },
];

const castradoOptions = [
    { label: "Sim", value: "sim" },
    { label: "Não", value: "nao" },
];

/**
 * Get additional conditional fields based on form values for AnimalEstimacao form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];

    // Se possui animal, mostra campos do primeiro animal + checkbox para segundo
    if (formValues.possuiAnimalEstimacao === "sim") {
        conditionalFields.push(
            {
                name: "nomeAnimal1",
                label: "Nome do Animal",
                type: "text" as const,
                required: true,
                placeholder: "Digite o nome do animal"
            },
            {
                name: "tipoAnimal1",
                label: "Tipo do Animal",
                type: "select" as const,
                required: true,
                options: tipoAnimalOptions
            },
            {
                name: "sexoAnimal1",
                label: "Sexo do Animal",
                type: "radio" as const,
                required: true,
                options: sexoAnimalOptions
            },
            {
                name: "porteAnimal1",
                label: "Porte do Animal",
                type: "radio" as const,
                required: true,
                options: porteAnimalOptions
            },
            {
                name: "animalCastrado1",
                label: "Animal é castrado?",
                type: "radio" as const,
                required: true,
                options: castradoOptions
            },
            // ✅ AGORA O CHECKBOX É CONDICIONAL - aparece depois do primeiro animal
            {
                name: "ativarAnimal2",
                label: "Adicionar segundo animal",
                type: "checkbox" as const,
                required: false
            }
        );

        // Se tipoAnimal1 for "outros", mostra campo para especificar
        if (formValues.tipoAnimal1 === "outros") {
            conditionalFields.push({
                name: "especifiqueTipoAnimal1",
                label: "Especifique o tipo do animal",
                type: "text" as const,
                required: true,
                placeholder: "Digite o tipo de animal"
            });
        }
    }

    // Se animal 2 estiver ativado, mostra campos relacionados
    if (formValues.ativarAnimal2 === true) {
        conditionalFields.push(
            {
                name: "nomeAnimal2",
                label: "Nome do Segundo Animal",
                type: "text" as const,
                required: true,
                placeholder: "Digite o nome do segundo animal"
            },
            {
                name: "tipoAnimal2",
                label: "Tipo do Segundo Animal",
                type: "select" as const,
                required: true,
                options: tipoAnimalOptions
            },
            {
                name: "sexoAnimal2",
                label: "Sexo do Segundo Animal",
                type: "radio" as const,
                required: true,
                options: sexoAnimalOptions
            },
            {
                name: "porteAnimal2",
                label: "Porte do Segundo Animal",
                type: "radio" as const,
                required: true,
                options: porteAnimalOptions
            },
            {
                name: "animalCastrado2",
                label: "Segundo animal é castrado?",
                type: "radio" as const,
                required: true,
                options: castradoOptions
            },
            // ✅ Checkbox para terceiro animal
            {
                name: "ativarAnimal3",
                label: "Adicionar terceiro animal",
                type: "checkbox" as const,
                required: false
            }
        );

        // Se tipoAnimal2 for "outros", mostra campo para especificar
        if (formValues.tipoAnimal2 === "outros") {
            conditionalFields.push({
                name: "especifiqueTipoAnimal2",
                label: "Especifique o tipo do segundo animal",
                type: "text" as const,
                required: true,
                placeholder: "Digite o tipo de animal"
            });
        }
    }

    // Se animal 3 estiver ativado, mostra campos relacionados
    if (formValues.ativarAnimal3 === true) {
        conditionalFields.push(
            {
                name: "nomeAnimal3",
                label: "Nome do Terceiro Animal",
                type: "text" as const,
                required: true,
                placeholder: "Digite o nome do terceiro animal"
            },
            {
                name: "tipoAnimal3",
                label: "Tipo do Terceiro Animal",
                type: "select" as const,
                required: true,
                options: tipoAnimalOptions
            },
            {
                name: "sexoAnimal3",
                label: "Sexo do Terceiro Animal",
                type: "radio" as const,
                required: true,
                options: sexoAnimalOptions
            },
            {
                name: "porteAnimal3",
                label: "Porte do Terceiro Animal",
                type: "radio" as const,
                required: true,
                options: porteAnimalOptions
            },
            {
                name: "animalCastrado3",
                label: "Terceiro animal é castrado?",
                type: "radio" as const,
                required: true,
                options: castradoOptions
            }
        );

        // Se tipoAnimal3 for "outros", mostra campo para especificar
        if (formValues.tipoAnimal3 === "outros") {
            conditionalFields.push({
                name: "especifiqueTipoAnimal3",
                label: "Especifique o tipo do terceiro animal",
                type: "text" as const,
                required: true,
                placeholder: "Digite o tipo de animal"
            });
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
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {
        const conditionalFields = getConditionalFields(formValues);
        const baseFields = [...animalEstimacaoDefinition.sections[0].fields];

        // Inserir campos condicionais nas posições corretas
        afterInsert(baseFields, conditionalFields, "possuiAnimalEstimacao", [
            "nomeAnimal1", "tipoAnimal1", "especifiqueTipoAnimal1", 
            "sexoAnimal1", "porteAnimal1", "animalCastrado1", "ativarAnimal2"
        ]);

        afterInsert(baseFields, conditionalFields, "tipoAnimal1", [
            "especifiqueTipoAnimal1"
        ]);

        afterInsert(baseFields, conditionalFields, "ativarAnimal2", [
            "nomeAnimal2", "tipoAnimal2", "especifiqueTipoAnimal2",
            "sexoAnimal2", "porteAnimal2", "animalCastrado2", "ativarAnimal3"
        ]);

        afterInsert(baseFields, conditionalFields, "tipoAnimal2", [
            "especifiqueTipoAnimal2"
        ]);

        afterInsert(baseFields, conditionalFields, "ativarAnimal3", [
            "nomeAnimal3", "tipoAnimal3", "especifiqueTipoAnimal3",
            "sexoAnimal3", "porteAnimal3", "animalCastrado3"
        ]);

        afterInsert(baseFields, conditionalFields, "tipoAnimal3", [
            "especifiqueTipoAnimal3"
        ]);

        return [
            {
                ...animalEstimacaoDefinition.sections[0],
                fields: baseFields
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        return [animalEstimacaoDefinition.sections[0]];
    }
}