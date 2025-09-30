import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Util
function slugify(nome: string) {
    return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

// Lista de benefícios disponíveis
const BENEFICIOS_OPTIONS = [
    "Bolsa Familia",
    "Auxilio Emergencial",
    "BPC_Pessoa idosa",
    "BPC_Pessoa com deficiencia",
    "Auxilio inclusao",
    "Renda cidada",
    "Renda minima",
    "Acao jovem",

];

export const ORIGEM_RENDA_OPTIONS = [
    "Aposentadoria (idade, invalidez ou por tempo de contribuição)",
    "Pensão por morte",
    "Pensão alimentícia",
    "Auxílio doença",
    "Auxílio reclusão",
    "Auxílio acidente",
    "Salário família",
    "Salário maternidade",
    "Aluguel",
    "Outros",
] as const;


// ------------------- ✅ ZOD SCHEMA -------------------

export const rendaResponsaveisSchema = z.object({
    integrantesFamilia: z.array(z.string()).optional(),
    recebeBeneficio: z.record(z.string()).optional(),
    origemRenda: z.record(z.string()).optional(),

    valorRendaAposentadoria: z.record(z.string()).optional(),
    valorRendaPensaoPorMorte: z.record(z.string()).optional(),
    valorRendaPensaoAlimenticia: z.record(z.string()).optional(),
    valorRendaAuxilioDoenca: z.record(z.string()).optional(),
    valorRendaAuxilioReclusao: z.record(z.string()).optional(),
    valorRendaAuxilioAcidente: z.record(z.string()).optional(),
    valorRendaSalarioFamilia: z.record(z.string()).optional(),
    valorRendaSalarioMaternidade: z.record(z.string()).optional(),
    valorRendaAluguel: z.record(z.string()).optional(),
    valorRendaOutros: z.record(z.string()).optional(),

    naoInformadoRendaAposentadoria: z.record(z.string()).optional(),
    naoInformadoRendaPensaoPorMorte: z.record(z.string()).optional(),
    naoInformadoRendaPensaoAlimenticia: z.record(z.string()).optional(),
    naoInformadoRendaAuxilioDoenca: z.record(z.string()).optional(),
    naoInformadoRendaAuxilioReclusao: z.record(z.string()).optional(),
    naoInformadoRendaAuxilioAcidente: z.record(z.string()).optional(),
    naoInformadoRendaSalarioFamilia: z.record(z.string()).optional(),
    naoInformadoRendaSalarioMaternidade: z.record(z.string()).optional(),
    naoInformadoRendaAluguel: z.record(z.string()).optional(),
    naoInformadoRendaOutros: z.record(z.string()).optional(),

    especificarOutros: z.record(z.string()).optional(),

    beneficiosRecebidos: z.record(z.array(z.string())).optional(),
    valorRendaBolsaF: z.record(z.string()).optional(),
    naoAplicaValorRendaBolsaF: z.record(z.string()).optional(),
    valorRendaAuxilioE: z.record(z.string()).optional(),
    naoAplicaValorRendaAuxilioE: z.record(z.string()).optional(),
    valorRendaBPC_PessoaI: z.record(z.string()).optional(),
    naoAplicaValorBPC_PessoaI: z.record(z.string()).optional(),
    valorRendaBPC_PessoaD: z.record(z.string()).optional(),
    naoAplicaValorBPC_PessoaD: z.record(z.string()).optional(),
    valorRendaAuxilioInclusao: z.record(z.string()).optional(),
    naoAplicaValorAuxilioInclusao: z.record(z.string()).optional(),
    valorRendaCidada: z.record(z.string()).optional(),
    naoAplicaValorRendaCidada: z.record(z.string()).optional(),
    valorRendaMinima: z.record(z.string()).optional(),
    naoAplicaValorRendaMinima: z.record(z.string()).optional(),
    valorRendaAcaoJovem: z.record(z.string()).optional(),
    naoAplicaValorAcaoJovem: z.record(z.string()).optional(),

    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});


export type FormValues = z.infer<typeof rendaResponsaveisSchema>;

// ------------------- ✅ DEFAULT VALUES -------------------

export const defaultValues: Partial<FormValues> = {
    integrantesFamilia: [],
    recebeBeneficio: {},
    origemRenda: {},

    valorRendaAposentadoria: {},
    valorRendaPensaoPorMorte: {},
    valorRendaPensaoAlimenticia: {},
    valorRendaAuxilioDoenca: {},
    valorRendaAuxilioReclusao: {},
    valorRendaAuxilioAcidente: {},
    valorRendaSalarioFamilia: {},
    valorRendaSalarioMaternidade: {},
    valorRendaAluguel: {},
    valorRendaOutros: {},

    naoInformadoRendaAposentadoria: {},
    naoInformadoRendaPensaoPorMorte: {},
    naoInformadoRendaPensaoAlimenticia: {},
    naoInformadoRendaAuxilioDoenca: {},
    naoInformadoRendaAuxilioReclusao: {},
    naoInformadoRendaAuxilioAcidente: {},
    naoInformadoRendaSalarioFamilia: {},
    naoInformadoRendaSalarioMaternidade: {},
    naoInformadoRendaAluguel: {},
    naoInformadoRendaOutros: {},

    especificarOutros: {},

    beneficiosRecebidos: {},
    valorRendaBolsaF: {},
    naoAplicaValorRendaBolsaF: {},
    valorRendaAuxilioE: {},
    naoAplicaValorRendaAuxilioE: {},
    valorRendaBPC_PessoaI: {},
    naoAplicaValorBPC_PessoaI: {},
    valorRendaBPC_PessoaD: {},
    naoAplicaValorBPC_PessoaD: {},
    valorRendaAuxilioInclusao: {},
    naoAplicaValorAuxilioInclusao: {},
    valorRendaCidada: {},
    naoAplicaValorRendaCidada: {},
    valorRendaMinima: {},
    naoAplicaValorRendaMinima: {},
    valorRendaAcaoJovem: {},
    naoAplicaValorAcaoJovem: {},

    idLocal: "",
    selagem_id: "",
};


// ------------------- ✅ CAMPOS BASE -------------------

const baseFields: FormField[] = [
    {
        name: "integrantesFamilia",
        label: "Integrantes da família",
        type: "multicombobox",
        required: false,
        placeholder: "Adicione um ou mais integrantes da família",
        options: Array.from({ length: 10 }).map((_, index) => ({
            label: `Integrante ${index + 1}`,
            value: `Integrante ${index + 1}`,
        })),
    },
];

// ------------------- ✅ CAMPOS CONDICIONAIS -------------------

export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const fields: FormField[] = [];
    const integrantes = formValues.integrantesFamilia ?? [];

    integrantes.forEach((integrante) => {
        const key = slugify(integrante);

        // Campo: recebeBeneficio (sempre aparece)
        fields.push({
            name: `recebeBeneficio.${key}`,
            label: `O ${integrante} recebe benefício?`,
            type: "radio" as const,
            required: false,
            options: [
                { label: "Sim", value: "sim" },
                { label: "Não", value: "nao" },
            ]
        });

        // ✅ Verifica se respondeu "sim" para mostrar o multicombo
        const recebeBeneficio = formValues.recebeBeneficio?.[key] === "sim";
        const recebeRenda = formValues.recebeBeneficio?.[key] === "sim";

        if (recebeBeneficio) {
            // Campo: beneficiosRecebidos
            fields.push({
                name: `beneficiosRecebidos.${key}`,
                label: `Benefícios recebidos por ${integrante}`,
                type: "multicombobox",
                required: false,
                placeholder: "Escolha os benefícios",
                options: BENEFICIOS_OPTIONS.map((b) => ({
                    label: b.replace(/_/g, " "),
                    value: b,
                })),
            });

            // Verifica se há benefícios selecionados
            const rawBeneficios = formValues.beneficiosRecebidos?.[key];
            const beneficiosRecebidos = Array.isArray(rawBeneficios)
                ? rawBeneficios
                : [];

            // Campos adicionais baseados nos benefícios
            if (beneficiosRecebidos.includes("Bolsa Familia")) {
                fields.push(
                    {
                        name: `valorRendaBolsaF.${key}`,
                        label: `Valor da renda do Bolsa Família do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorRendaBolsaF.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("Auxilio Emergencial")) {
                fields.push(
                    {
                        name: `valorRendaAuxilioE.${key}`,
                        label: `Valor do Auxilio Emergencial do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorRendaAuxilioE.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("BPC_Pessoa idosa")) {
                fields.push(
                    {
                        name: `valorRendaBPC_PessoaI.${key}`,
                        label: `Valor do BPC_Pessoa idosa do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorBPC_PessoaI.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("BPC_Pessoa com deficiencia")) {
                fields.push(
                    {
                        name: `valorRendaBPC_PessoaD.${key}`,
                        label: `Valor do BPC_Pessoa com deficiencia do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorBPC_PessoaD.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("Auxilio inclusao")) {
                fields.push(
                    {
                        name: `valorRendaAuxilioInclusao.${key}`,
                        label: `Valor Auxilio inclusão do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorAuxilioInclusao.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("Renda cidada")) {
                fields.push(
                    {
                        name: `valorRendaCidada.${key}`,
                        label: `Valor da Renda cidadã do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorRendaCidada.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("Renda minima")) {
                fields.push(
                    {
                        name: `valorRendaMinima.${key}`,
                        label: `Valor do Renda minima do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorRendaMinima.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }

            if (beneficiosRecebidos.includes("Acao jovem")) {
                fields.push(
                    {
                        name: `valorRendaAcaoJovem.${key}`,
                        label: `Valor do Acao jovem do ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoAplicaValorAcaoJovem.${key}`,
                        label: `Não se aplica`,
                        type: "checkbox" as const,
                        required: false,
                        disableField: "cep",
                        dependent: true
                    },
                );
            }
        }

        if (recebeRenda) {
            // Campo multiselect para selecionar origens de renda
            fields.push({
                name: `origemRenda.${key}`,
                label: `Indique a origem da renda de ${integrante}`,
                type: "multicombobox",
                required: false,
                placeholder: "Selecione as origens de renda",
                options: ORIGEM_RENDA_OPTIONS.map((item) => ({
                    label: item,
                    value: item,
                })),
            });

            // Pega as rendas selecionadas
            const rawOrigens = formValues?.origemRenda?.[key];
            const origensSelecionadas: string[] = Array.isArray(rawOrigens) ? rawOrigens : [];

            // Para cada origem selecionada, adiciona os campos correspondentes
            if (origensSelecionadas.includes("Aposentadoria (idade, invalidez ou por tempo de contribuição)")) {
                fields.push(
                    {
                        name: `valorRendaAposentadoria.${key}`,
                        label: `Valor da Aposentadoria de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaAposentadoria.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }
            

            if (origensSelecionadas.includes("Pensão por morte")) {
                fields.push(
                    {
                        name: `valorRendaPensaoPorMorte.${key}`,
                        label: `Valor da Pensão por morte de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaPensaoPorMorte.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Pensão alimentícia")) {
                fields.push(
                    {
                        name: `.${key}`,
                        label: `Valor da Pensão alimentícia de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaPensaoAlimenticia.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Auxílio doença")) {
                fields.push(
                    {
                        name: `valorRendaAuxilioDoenca.${key}`,
                        label: `Valor do Auxílio doença de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaAuxilioDoenca.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Auxílio reclusão")) {
                fields.push(
                    {
                        name: `valorRendaAuxilioReclusao.${key}`,
                        label: `Valor do Auxílio reclusão de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoValorRendaAuxilioReclusao.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Auxílio acidente")) {
                fields.push(
                    {
                        name: `valorRendaAuxilioAcidente.${key}`,
                        label: `Valor do Auxílio acidente de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaAuxilioAcidente.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Salário família")) {
                fields.push(
                    {
                        name: `valorRendaSalarioFamilia.${key}`,
                        label: `Valor do Salário família de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaSalarioFamilia.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Salário maternidade")) {
                fields.push(
                    {
                        name: `valorRendaSalarioMaternidade.${key}`,
                        label: `Valor do Salário maternidade de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaSalarioMaternidade.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Aluguel")) {
                fields.push(
                    {
                        name: `valorRendaAluguel.${key}`,
                        label: `Valor do Aluguel de ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Digite o valor da renda"
                    },
                    {
                        name: `naoInformadoRendaAluguel.${key}`,
                        label: "Não informado",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            if (origensSelecionadas.includes("Outros")) {
                fields.push(
                    
                    {
                        name: `especificarOutros.${key}`,
                        label: `Especifique as fontes de renda (Outros) para ${integrante}`,
                        type: "text",
                        required: true,
                        placeholder: "Descreva a fonte de renda"
                    }
                );
            }
        }

    });

    return fields;
}


// ------------------- ✅ MERGE FINAL -------------------

export function getMergedFormSections(formValues: Partial<FormValues>): FormConfig["sections"] {
    try {
        const conditionalFields = getConditionalFields(formValues);
        const mergedFields = [...baseFields];
        const integrantes = formValues.integrantesFamilia ?? [];

        let lastInsertIndex = mergedFields.findIndex(f => f.name === "integrantesFamilia");

        integrantes.forEach((integrante) => {
            const key = slugify(integrante);

            // Grupo 1: recebeBeneficio, beneficiosRecebidos, dataNascimento
            const grupo1 = conditionalFields.filter(f =>
                [
                    `recebeBeneficio.${key}`,
                    `beneficiosRecebidos.${key}`,
                    `dataNascimentoIntegrante.${key}`,
                    `valorRendaBolsaF.${key}`,
                    `naoAplicaValorRendaBolsaF.${key}`,
                    `valorRendaAuxilioE.${key}`,
                    `naoAplicaValorRendaAuxilioE.${key}`,
                    `valorRendaBPC_PessoaI.${key}`,
                    `naoAplicaValorBPC_PessoaI.${key}`,
                    `valorRendaBPC_PessoaD.${key}`,
                    `naoAplicaValorBPC_PessoaD.${key}`,

                ].includes(f.name)
            );

            if (grupo1.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo1);
                lastInsertIndex += grupo1.length;
            }
            const grupo2 = conditionalFields.filter(f =>
                 [
        `recebeRenda.${key}`,
        `origemRenda.${key}`,

        `valorRendaAposentadoria.${key}`,
        `valorRendaPensaoPorMorte.${key}`,
        `valorRendaPensaoAlimenticia.${key}`,
        `valorRendaAuxilioDoenca.${key}`,
        `valorRendaAuxilioReclusao.${key}`,
        `valorRendaAuxilioAcidente.${key}`,
        `valorRendaSalarioFamilia.${key}`,
        `valorRendaSalarioMaternidade.${key}`,
        `valorRendaAluguel.${key}`,
        `valorRendaOutros.${key}`,

        `naoInformadoRendaAposentadoria.${key}`,
        `naoInformadoRendaPensaoPorMorte.${key}`,
        `naoInformadoRendaPensaoAlimenticia.${key}`,
        `naoInformadoRendaAuxilioDoenca.${key}`,
        `naoInformadoRendaAuxilioReclusao.${key}`,
        `naoInformadoRendaAuxilioAcidente.${key}`,
        `naoInformadoRendaSalarioFamilia.${key}`,
        `naoInformadoRendaSalarioMaternidade.${key}`,
        `naoInformadoRendaAluguel.${key}`,
        `naoInformadoRendaOutros.${key}`,

        `especificarOutros.${key}`,
    ].includes(f.name)
            );
            if (grupo2.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo2);
                lastInsertIndex += grupo2.length;
            }


        });

        return [
            {
                id: "integrantesFamilia_",
                title: "Renda das pessoas responsáveis (maiores de 14 anos)",
                fields: mergedFields,
            },
        ];
    } catch (error) {
        console.error("Erro ao gerar seções:", error);
        return [
            {
                id: "integrantesFamilia_",
                title: "Renda das pessoas responsáveis (maiores de 14 anos)",
                fields: [...baseFields],
            },
        ];
    }
}

