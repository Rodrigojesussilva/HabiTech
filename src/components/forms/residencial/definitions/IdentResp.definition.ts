import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";
import { subprefeituras, distritosPorSubprefeitura } from "../subprefeiturasDistritos";

function slugify(pais: string) {
    return pais.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}
// Form validation schema
export const situUsoUniSchema = z.object({
    responsavel: z.string().optional(),
    nomeCompletoResp: z.string().optional(),
    nomeSocial: z.string().optional(),
    dataNascimentoResp: z.string().optional(),
    idadeResp: z.string().optional(),
    documentosSelecionados: z.array(z.string()).optional(),
    numero_rg: z.string().optional(),
    numero_cpf: z.string().optional(),
    numero_rnm: z.string().optional(),
    numero_cnh: z.string().optional(),
    whatzap: z.string().optional(),
    temPessoaDeficiencia: z.string().optional(),
    pessoaInterditada: z.string().optional(),
    sabeLerEscrever: z.string().optional(),
    nomeCuradorTutora: z.string().optional(),
    tipoInterdicao: z.string().optional(),
    filiacao_: z.string().optional(),
    nomeFiliacao: z.record(z.string(), z.number()).default({}),
    naoAplica: z.record(z.string(), z.number()).default({}),
    frequetaEscola: z.string().optional(),
    modalidadeEnsino: z.string().optional(),
    nomeInstituicaoEnsino: z.string().optional(),
    cep: z.string().optional(),
    naoAplicaCep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    complemento: z.string().optional(),
    uf: z.string().optional(),
    cidade: z.string().optional(),
    subPrefeitura: z.string().optional(),
    distrito: z.string().optional(),
    localizacaoInstituicaoEnsino: z.string().optional(),
    pontoPartida: z.string().optional(),
    diasSemana: z.string().optional(),
    quaisConducoes: z.string().optional(),
    quantHoras: z.string().optional(),
    tempoTotal: z.string().optional(),
    tempoAndando: z.string().optional(),
    atividadeRemunerada: z.string().optional(),
    modalidadeTrabalho: z.string().optional(),
    localizacaoTrabalho: z.string().optional(),
    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});

export type FormValues = z.infer<typeof situUsoUniSchema>;

export const defaultValues: Partial<FormValues> = {
    responsavel: "",
    nomeCompletoResp: "",
    nomeSocial: "",
    dataNascimentoResp: "",
    idadeResp: "",
    documentosSelecionados: [],
    numero_rg: "",
    numero_cpf: "",
    numero_rnm: "",
    numero_cnh: "",
    whatzap: "",
    temPessoaDeficiencia: "",
    pessoaInterditada: "",
    sabeLerEscrever: "",
    nomeCuradorTutora: "",
    tipoInterdicao: "",
    filiacao_: "",
    nomeFiliacao: {},
    naoAplica: {},
    frequetaEscola: "",
    modalidadeEnsino: "",
    nomeInstituicaoEnsino: "",
    cep: "",
    naoAplicaCep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    uf: "",
    cidade: "",
    subPrefeitura: "",
    distrito: "",
    localizacaoInstituicaoEnsino: "",
    pontoPartida: "",
    diasSemana: "",
    quaisConducoes: "",
    quantHoras: "",
    tempoTotal: "",
    tempoAndando: "",
    atividadeRemunerada: "",
    modalidadeTrabalho: "",
    localizacaoTrabalho: "",
    idLocal: "not",
};
const selectedSub = "Butantã"; // <-- apenas valor fixo
const subPrefeituraOptions = subprefeituras.map((nome) => ({
    label: nome,
    value: nome,
}));
const distritoOptions = (sub: string) => {
    const distritos = distritosPorSubprefeitura[sub] || [];
    return distritos.map((d) => ({ label: d, value: d }));
};
export const identRespDefinition: FormConfig = {
    title: "Identificação do Responsável pela Unidade",
    sections: [
        {
            id: "situacaoUsoUnidade",
            title: "Identificação do Responsável pela Unidade",
            fields: [
                {
                    name: "responsavel",
                    label: "A pessoa é responsável pela unidade?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "nomeCompletoResp",
                    label: "Nome Completo",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "nomeSocial",
                    label: "Nome Social (se houver)",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "dataNascimentoResp",
                    label: "Data de Nascimento",
                    type: "date" as const,
                    required: false,
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA"
                },
                {
                    name: "idadeResp",
                    label: "Idade",
                    type: "display" as const,
                    required: false,
                    displayValue: (data: Partial<FormValues>) => data?.idadeResp || ""
                },
                {
                    name: "documentosSelecionados",
                    label: "Documentos (RG, CPF, RNM, CNH)",
                    type: "multicombobox",
                    required: false,
                    placeholder: "RG, CPF, RNM, CNH",
                    options: [
                        { label: "RG", value: "RG" },
                        { label: "CPF", value: "CPF" },
                        { label: "RNM", value: "RNM" },
                        { label: "CNH", value: "CNH" },

                    ],
                },
                {
                    name: "whatzap",
                    label: "Tem WhatsApp?",
                    type: "checkbox",
                    required: false,
                    placeholder: "((00) 00000-0000)",

                },
                {
                    name: "temPessoaDeficiencia",
                    label: "Deficiência?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                        { label: "Não sei informar", value: "Não sei informar" },
                        { label: "Não repondeu", value: "Não repondeu" },
                    ]

                },
                {
                    name: "frequetaEscola",
                    label: "Frequenta educação escolar? ",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "atividadeRemunerada",
                    label: "Exerce atividade remunerada? ",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },


            ]
        }
    ]
};

// Utilitário para inserir campos após um campo específico
function insertAfter(fields: FormField[], targetName: string, toInsert: FormField[]) {
    const index = fields.findIndex(f => f.name === targetName);
    if (index === -1) return [...fields, ...toInsert];
    return [
        ...fields.slice(0, index + 1),
        ...toInsert,
        ...fields.slice(index + 1)
    ];
}

// Retorna campos condicionais baseados nos valores do formulário
export function getConditionalFields(formValues: Partial<FormValues>) {
    const usoUnidadeConditionals: FormField[] = [];
    const identRespConditionals: FormField[] = [];
    const documentosConditionals: FormField[] = [];
    const deficienciaConditionals: FormField[] = [];
    const educacaoConditionals: FormField[] = [];
    const atividadeRemuneradaConditionals: FormField[] = [];

    const documentosSelecionados = formValues.documentosSelecionados || [];

    if (documentosSelecionados.includes("RG")) {
        documentosConditionals.push({
            name: "numero_rg",
            label: "Número do RG",
            type: "text",
            required: true,
            placeholder: "Digite o número do RG"
        });
    }

    if (documentosSelecionados.includes("CPF")) {
        documentosConditionals.push({
            name: "numero_cpf",
            label: "Número do CPF",
            type: "text",
            required: true,
            placeholder: "Digite o número do CPF"
        });
    }

    if (documentosSelecionados.includes("RNM")) {
        documentosConditionals.push({
            name: "numero_rnm",
            label: "Número do RNM",
            type: "text",
            required: true,
            placeholder: "Digite o número do RNM"
        });
    }

    if (documentosSelecionados.includes("CNH")) {
        documentosConditionals.push({
            name: "numero_cnh",
            label: "Número da CNH",
            type: "text",
            required: true,
            placeholder: "Digite o número da CNH"
        });
    }
    if (formValues.temPessoaDeficiencia === "sim") {
        // 1) Inserir campo: A pessoa é interditada por consequência da deficiência?
        deficienciaConditionals.push({
            name: "pessoaInterditada",
            label: "A pessoa é interditada por consequência da deficiência?",
            type: "radio",
            required: true,
            options: [
                { label: "Sim", value: "sim" },
                { label: "Não", value: "nao" },
            ]
        });



        // 3) Se for interditada, inserir campos adicionais
        if (formValues.pessoaInterditada === "sim") {
            deficienciaConditionals.push(
                {
                    name: "nomeCuradorTutora",
                    label: "Nome da pessoa curadora/tutora",
                    type: "text",
                    required: true,
                    placeholder: "Digite o nome do curador ou tutor"
                },
                {
                    name: "tipoInterdicao",
                    label: "Tipo de interdição",
                    type: "radio",
                    required: true,
                    options: [
                        { label: "Parcial", value: "parcial" },
                        { label: "Total", value: "total" },
                    ]
                }
            );
        }
        // 2) Inserir campo: Sabe ler e escrever?
        deficienciaConditionals.push({
            name: "sabeLerEscrever",
            label: "Sabe ler e escrever?",
            type: "radio",
            required: true,
            options: [
                { label: "Sim", value: "sim" },
                { label: "Não", value: "nao" },
            ]
        });
        // Campo multicombo
        deficienciaConditionals.push({
            name: "filiacao_",
            label: "Filiação",
            type: "multicombobox",
            required: false,
            placeholder: "Filiação",
            options: [
                { label: "Nome filiação 1", value: "Nome filiação 1" },
                { label: "Nome filiação 2", value: "Nome filiação 2" },
                { label: "Nome filiação 3", value: "Nome filiação 3" },
                { label: "Nome filiação 4", value: "Nome filiação 4" },
                { label: "Nome filiação 5", value: "Nome filiação 5" },
                { label: "Nome filiação 6", value: "Nome filiação 6" },
                { label: "Nome filiação 7", value: "Nome filiação 7" },
                { label: "Nome filiação 8", value: "Nome filiação 8" },
                { label: "Nome filiação 9", value: "Nome filiação 9" },
                { label: "Nome filiação 10", value: "Nome filiação 10" },


            ],
        });
        // Gera um campo para cada país selecionado
        const filiacao = formValues.filiacao_ ?? [];
        for (const f of filiacao) {
            const key = slugify(f);
            deficienciaConditionals.push({
                name: `nomeFiliacao.${key}`,
                label: `${f}`,
                type: "text",
                required: false,
            },
                {
                    name: `naoAplica.${key}`,
                    label: `Não se aplica ${f}`,
                    type: "checkbox",
                    required: false,
                });
        }

    }
    if (formValues.frequetaEscola === "sim") {
        educacaoConditionals.push(
            {
                name: "modalidadeEnsino",
                label: "Modalidade de ensino",
                type: "radio" as const,
                required: false,
                options: [

                    { label: "Presencial", value: "Presencial" },
                    { label: "EAD", value: "EAD" },
                    { label: "Hibrido", value: "Hibrido" },
                    { label: "Outros", value: "Outros" },

                ]

            },
            {
                name: "nomeInstituicaoEnsino",
                label: "Nome da instituição de ensino",
                type: "text",
                required: true,
                placeholder: "Digite o nome do curador ou tutor"
            },

        );
    }
    if ((formValues.modalidadeEnsino === "Presencial" || formValues.modalidadeEnsino === "Hibrido" || formValues.modalidadeEnsino === "Outros") && formValues.frequetaEscola === "sim") {
        educacaoConditionals.push(

            {
                name: "endereco",
                label: "Endereco",
                type: "label" as const,
                required: false,

            },
            {
                name: "cep",
                label: "Cep",
                type: "text" as const,
                required: false,
                mask: "9999-999",
                placeholder: "0000-000",
                dependent: true
            },
            {
                name: "naoAplicaCep",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
                disableField: "cep",
                dependent: true
            },
            {
                name: "logradouro",
                label: "Logradouro",
                type: "text" as const,
                required: false,
                dependent: true
            },
            {
                name: "numero",
                label: "Número",
                type: "numberSpinner" as const,
                required: false,
                step: 1,
                dependent: true

            },
            {
                name: "bairro",
                label: "Bairro",
                type: "text" as const,
                required: false,
                dependent: true
            },
            {
                name: "complemento",
                label: "Complemento",
                type: "text" as const,
                required: false,
                dependent: true
            },
            {
                name: "uf",
                label: "UF",
                type: "combobox" as const,
                required: true,
                dependent: true,
                options: [

                ]
            },
            {
                name: "cidade",
                label: "Cidade",
                type: "combobox" as const,
                required: true,
                dependent: true,
                options: [

                ]
            },
            {
                name: "subPrefeitura",
                label: "Subprefeitura",
                type: "combobox" as const,
                required: false,
                options: subPrefeituraOptions,
                dependent: true,
                conditions: [
                    { field: "uf", operator: "equals", value: "SP" },
                    { field: "cidade", operator: "equals", value: "São Paulo" },
                ],
            },
            {
                name: "distrito",
                label: "Distrito",
                type: "combobox" as const,
                required: false,
                options: distritoOptions(selectedSub),
                dependent: true,
                conditions: [
                    { field: "uf", operator: "equals", value: "SP" },
                    { field: "cidade", operator: "equals", value: "São Paulo" },
                ],
            },
            {
                name: "localizacaoInstituicaoEnsino",
                label: "Localização da Instituição de Ensino",
                type: "radio" as const,
                required: false,
                dependent: true,
                options: [

                    { label: "Na área", value: "Na area" },
                    { label: "Em outro lugar", value: " Em outro lugar" },

                ]

            }
        );
    }
    else if (formValues.modalidadeEnsino === "EAD" && formValues.frequetaEscola === "sim") {
        educacaoConditionals.push(

            {
                name: "endereco",
                label: "Endereco",
                type: "label" as const,
                required: false,

            },
            {
                name: "localizacaoInstituicaoEnsino",
                label: "Localização da Instituição de Ensino",
                type: "radio" as const,
                required: false,
                dependent: true,
                options: [

                    { label: "Na área", value: "Na area" },
                    { label: "Em outro lugar", value: " Em outro lugar" },

                ]

            }
        );
    }
    if (formValues.frequetaEscola === "sim") {
        educacaoConditionals.push(
            {
                name: "pontoPartida",
                label: "Ponto de partida é a unidade? ",
                type: "radio" as const,
                required: false,
                options: [

                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },


                ]

            },


        );
    }
    if (formValues.frequetaEscola === "sim" && formValues.pontoPartida === "sim") {
        educacaoConditionals.push(
            {
                name: "diasSemana",
                label: "Quais dias da semana frequenta?",
                type: "multicombobox" as const,
                required: false,
                options: [

                    { label: "Domingo", value: "Domingo" },
                    { label: "Segunda", value: "Segunda" },
                    { label: "Terça", value: "Terça" },
                    { label: "Quarta", value: "Quarta" },
                    { label: "Quinta", value: "Quinta" },
                    { label: "Sexta", value: "Sexta" },
                    { label: "Sábado", value: "Sábado" },

                ]

            },
            {
                name: "quaisConducoes",
                label: "Quais conduções você utiliza para chegar até a instituição de ensino?",
                type: "multicombobox" as const,
                required: false,
                options: [

                    { label: "Ônibus", value: "Onibus" },
                    { label: "Metrô", value: "Metro" },
                    { label: "Trem", value: "Trem" },
                    { label: "Ônibus Escolar", value: "Onibus Escolar" },
                    { label: "Carro particular", value: "Carro particular" },
                    { label: "Outros", value: "Outros" }

                ]

            },
            {
                name: "quantHoras",
                label: "Horário de saída da unidade",
                type: "time" as const,
                required: false,

            },
            {
                name: "tempoTotal",
                label: "Tempo total do percurso",
                type: "text" as const,
                required: false,

            },
            {
                name: "tempoAndando",
                label: "Tempo andando da condução até a instituição de ensino",
                type: "time" as const,
                required: false,

            },


        );
    }
    if (formValues.atividadeRemunerada === "sim") {
        atividadeRemuneradaConditionals.push(
            {
                name: "modalidadeTrabalho",
                label: "Modalidade de trabalho",
                type: "radio" as const,
                required: false,
                options: [

                    { label: "Presencial", value: "Presencial" },
                    { label: "Home office", value: "Home office" },
                    { label: "Hibrido", value: "Hibrido" },
                    { label: "Outros", value: "Outros" },

                ]

            },
             {
                name: "localizacaoTrabalho",
                label: "Localização da atividade remunerada principal ",
                type: "radio" as const,
                required: false,                
                options: [

                    { label: "Na área", value: "Na area" },
                    { label: "Em outro lugar", value: " Em outro lugar" },

                ]

            }
           

        );
    }

    return { usoUnidadeConditionals, identRespConditionals, documentosConditionals, deficienciaConditionals, educacaoConditionals, atividadeRemuneradaConditionals };
}

// Retorna todas as seções do formulário com campos condicionais na posição correta
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {
        const baseFields = [...identRespDefinition.sections[0].fields];
        const { usoUnidadeConditionals, identRespConditionals, documentosConditionals, deficienciaConditionals, educacaoConditionals, atividadeRemuneradaConditionals } = getConditionalFields(formValues);

        let fields = [...baseFields];
        fields = insertAfter(fields, "situacaoUsoUnidade", identRespConditionals);
        fields = insertAfter(fields, "usoUnidade", usoUnidadeConditionals);
        fields = insertAfter(fields, "documentosSelecionados", documentosConditionals);
        fields = insertAfter(fields, "temPessoaDeficiencia", deficienciaConditionals);
        fields = insertAfter(fields, "frequetaEscola", educacaoConditionals);
        fields = insertAfter(fields, "atividadeRemunerada", atividadeRemuneradaConditionals);

        return [
            {
                ...identRespDefinition.sections[0],
                fields,
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        return [identRespDefinition.sections[0]];
    }
}
