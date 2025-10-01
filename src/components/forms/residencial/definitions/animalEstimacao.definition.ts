import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";
// Função para transformar texto em chave (slug)
function slugify(nome: string) {
    return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

// Schema Zod
export const animalEstimacaoSchema = z.object({
    animalEstimacao: z.array(z.string()).optional(),
    possuiAnimalEstimacao: z.string().optional(),
    tipoAnimal: z.record(z.string()).optional(),
    especifiqueTipoAnimal: z.record(z.string()).optional(),
    nomeAnimal: z.record(z.string()).optional(),
    sexoAnimal: z.record(z.string()).optional(),
    porteAnimal: z.record(z.string()).optional(),
    animalCastrado: z.record(z.string()).optional(),

    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});

export type FormValues = z.infer<typeof animalEstimacaoSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    animalEstimacao: [],
    possuiAnimalEstimacao: "",
    tipoAnimal: {},
    especifiqueTipoAnimal: {},
    nomeAnimal: {},
    sexoAnimal: {},
    porteAnimal: {},
    animalCastrado: {},
    idLocal: "",
    selagem_id: "",
};

// Campos base fixos
const baseFields: FormField[] = [
    {
        name: "possuiAnimalEstimacao",
        label: "Possui Animal de Estimação?",
        type: "radio" as const,
        required: false,
        options: [
            { label: "Sim", value: "sim" },
            { label: "Não", value: "nao" },
        ]
    },
];


// Campos condicionais dinâmicos
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const fields: FormField[] = [];
    const integrantes = formValues.animalEstimacao ?? [];
    if (formValues.possuiAnimalEstimacao === "sim") {
        fields.push({
            name: "animalEstimacao",
            label: "Animal de Estimação",
            type: "multicombobox",
            required: false,
            placeholder: "Adicione um ou mais animais de estimação",
            options: Array.from({ length: 10 }).map((_, index) => ({
                label: `Animal ${index + 1}`,
                value: `Animal ${index + 1}`,
            })),
        });
    }

    integrantes.forEach((integrante) => {
        const key = slugify(integrante);

        fields.push(
            {
                name: `nomeAnimal.${key}`,
                label: `Nome do ${integrante}`,
                type: "text",
                required: true,
                placeholder: "Digite o nome do animal"
            },
            {
                name: `tipoAnimal.${key}`,
                label: `Tipo ${integrante}`,
                type: "select",
                required: false,
                placeholder: "Selecione o tipo de animal",
                options: [
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
                    { label: "Outros", value: "outros" } // campo condicional
                ]
            },
            // ✅ Inserir aqui, logo depois do tipoAnimal
            ...(formValues.tipoAnimal?.[key] === "outros"
                ? [{
                    name: `especifiqueTipoAnimal.${key}`,
                    label: `Especifique o tipo do ${integrante}`,
                    type: "text" as const, // ✅ Correção aqui
                    required: true,
                    placeholder: "Digite o tipo de animal"
                }]
                : []),

            {
                name: `sexoAnimal.${key}`,
                label: `Sexo do ${integrante}`,
                type: "radio",
                required: true,
                options: [
                    { label: "Macho", value: "macho" },
                    { label: "Fêmea", value: "femea" },
                ]
            },
            {
                name: `porteAnimal.${key}`,
                label: `Porte do ${integrante}`,
                type: "radio",
                required: true,
                options: [
                    { label: "Pequeno", value: "pequeno" },
                    { label: "Medio", value: "medio" },
                    { label: "Grande", value: "grande" },
                ]
            },
            {
                name: `animalCastrado.${key}`,
                label: `${integrante} castrado?`,
                type: "radio",
                required: true,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ]
            },
        );
       
    });

    return fields;
}

/**
 * Gera a lista completa de campos, mesclando base com condicionais
 * @param formValues valores atuais do formulário
 */

export function getMergedFormSections(formValues: Partial<FormValues>): FormConfig["sections"] {
    try {
        const conditionalFields = getConditionalFields(formValues);
        const mergedFields = [...baseFields];

        // ✅ Se possuiAnimalEstimacao !== "sim", não adiciona mais nada
        if (formValues.possuiAnimalEstimacao !== "sim") {
            return [
                {
                    id: "AnimaisEstimacao_",
                    title: "Animal de Estimação",
                    fields: mergedFields,
                },
            ];
        }

        // ✅ Adiciona campo 'animalEstimacao' e os campos por integrante
        const fieldAnimaisEstimacao = conditionalFields.find(f => f.name === "animalEstimacao");
        if (fieldAnimaisEstimacao) {
            mergedFields.push(fieldAnimaisEstimacao);
        }

        const animais = formValues.animalEstimacao ?? [];
        animais.forEach((animal) => {
            const key = slugify(animal);

            const grupo1 = conditionalFields.filter(f =>
                [`nomeAnimal.${key}`,
                `tipoAnimal.${key}`,
                `especifiqueTipoAnimal.${key}`,
                `sexoAnimal.${key}`,
                `porteAnimal.${key}`,
                `animalCastrado.${key}`
                ].includes(f.name)
            );

            if (grupo1.length) {
                mergedFields.push(...grupo1);
            }
        });

        return [
            {
                id: "animaisEstimacao_",
                title: "Animal de Estimação",
                fields: mergedFields,
            },
        ];
    } catch (error) {
        console.error("Erro ao gerar seções:", error);
        return [
            {
                id: "animaisEstimacao_",
                title: "Animal de Estimação",
                fields: [...baseFields],
            },
        ];
    }
}







