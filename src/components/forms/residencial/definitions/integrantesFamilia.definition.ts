import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";
import { subprefeituras, distritosPorSubprefeitura } from "../subprefeiturasDistritos";
// Função para transformar texto em chave (slug)
function slugify(nome: string) {
    return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

// Schema Zod
export const integrantesFamiliaSchema = z.object({
    integrantesFamilia: z.array(z.string()).optional(),
    nomeIntegrante: z.record(z.string()).optional(),
    nomeSocialIntegrante: z.record(z.string()).optional(),
    dataNascimentoIntegrante: z.record(z.string()).optional(),
    idadeIntegrante: z.record(z.string()).optional(),
    relacaoResponsavel: z.record(z.string()).optional(),
    descrevParentesco: z.record(z.string()).optional(),
    responsavelUnidade: z.record(z.string()).optional(),
    documentosSelecionados: z.record(z.array(z.string())).optional(), // novo
    numero_rg: z.record(z.string()).optional(),
    numero_cpf: z.record(z.string()).optional(),
    numero_rnm: z.record(z.string()).optional(),
    numero_cnh: z.record(z.string()).optional(),
    filiacao1_nome: z.record(z.string()).optional(),
    filiacao1_naoSeAplica: z.record(z.boolean()).optional(),
    filiacao2_nome: z.record(z.string()).optional(),
    filiacao2_naoSeAplica: z.record(z.boolean()).optional(),
    pessoaDeficiencia: z.record(z.string()).optional(),
    pessoaInterditada: z.record(z.string()).optional(),
    nomeCuradorTutora: z.record(z.string()).optional(),
    tipoInterdicao: z.record(z.string()).optional(),
    estadoCivil: z.record(z.string()).optional(),
    regimeCasamento: z.record(z.string()).optional(),
    escolaridade: z.record(z.string()).optional(),
    frequetaEscola: z.record(z.string()).optional(),
    modalidadeEnsino: z.record(z.string()).optional(),
    nomeInstituicaoEnsino: z.record(z.string()).optional(),
    pontoPartida: z.record(z.string()).optional(),
    diasSemana: z.record(z.string()).optional(),
    quaisConducoes: z.record(z.string()).optional(),
    quantHoras: z.record(z.string()).optional(),
    tempoTotal: z.record(z.string()).optional(),
    tempoAndando: z.record(z.string()).optional(),
    cepI: z.record(z.string()).optional(),
    naoAplicaI: z.record(z.boolean()).optional(),
    logradouroI: z.record(z.string()).optional(),
    numeroI: z.record(z.string()).optional(), // Ou z.number(), se estiver validando como número
    bairroI: z.record(z.string()).optional(),
    complementoI: z.record(z.string()).optional(),
    ufI: z.record(z.string()).optional(),
    cidadeI: z.record(z.string()).optional(),
    subPrefeituraI: z.record(z.string()).optional(),
    distritoI: z.record(z.string()).optional(),
    localizacaoInstituicaoEnsino: z.record(z.string()).optional(),
    atividadeRemunerada: z.record(z.string()).optional(),
    modalidadeTrabalho: z.record(z.string()).optional(),
    localizacaoTrabalho: z.record(z.string()).optional(),
    nomeAtividadeRemunerada: z.record(z.string()).optional(),
    cepTrabalho: z.record(z.string()).optional(),
    naoAplicaTrabalho: z.record(z.string()).optional(),
    logradouroTrabalho: z.record(z.string()).optional(),
    numeroTrabalho: z.record(z.string()).optional(),
    bairroTrabalho: z.record(z.string()).optional(),
    complementoTrabalho: z.record(z.string()).optional(),
    ufTrabalho: z.record(z.string()).optional(),
    cidadeTrabalho: z.record(z.string()).optional(),
    subPrefeituraTrabalho: z.record(z.string()).optional(),
    distritoTrabalho: z.record(z.string()).optional(),
    diasSemanaTrabalho: z.record(z.string()).optional(),
    quaisConducoesTrabalho: z.record(z.string()).optional(),
    quantHorasTrabalho: z.record(z.string()).optional(),
    tempoAndandoConducao: z.record(z.string()).optional(),
    tempoConducaoDestino: z.record(z.string()).optional(),
    tempoTotalTrabalho: z.record(z.string()).optional(),
    documentacaoCompletamentar: z.record(z.string()).optional(),
    anexoComprovanteRenda: z.record(z.any()).optional(),
    anexoCarteiraTrabalho: z.record(z.any()).optional(),
    anexoArea: z.record(z.any()).optional(),
    contatos: z.record(z.any()).optional(),
    telefoneCelularIntegrante: z.record(z.string()).optional(),    
    emailIntegrante: z.record(z.string()).optional(),
    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});

export type FormValues = z.infer<typeof integrantesFamiliaSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    integrantesFamilia: [],
    nomeIntegrante: {},
    nomeSocialIntegrante: {},
    dataNascimentoIntegrante: {},
    idadeIntegrante: {},
    relacaoResponsavel: {},
    descrevParentesco: {},
    responsavelUnidade: {},
    documentosSelecionados: {}, // novo
    numero_rg: {},
    numero_cpf: {},
    numero_rnm: {},
    numero_cnh: {},
    filiacao1_nome: {},
    filiacao1_naoSeAplica: {},
    filiacao2_nome: {},
    filiacao2_naoSeAplica: {},
    pessoaDeficiencia: {},
    pessoaInterditada: {},
    nomeCuradorTutora: {},
    tipoInterdicao: {},
    estadoCivil: {},
    regimeCasamento: {},
    escolaridade: {},
    frequetaEscola: {},
    modalidadeEnsino: {},
    nomeInstituicaoEnsino: {},
    pontoPartida: {},
    diasSemana: {},
    quaisConducoes: {},
    quantHoras: {},
    tempoTotal: {},
    tempoAndando: {},
    cepI: {},
    naoAplicaI: {},
    logradouroI: {},
    numeroI: {},
    bairroI: {},
    complementoI: {},
    ufI: {},
    cidadeI: {},
    subPrefeituraI: {},
    distritoI: {},
    cepTrabalho: {},
    naoAplicaTrabalho: {},
    logradouroTrabalho: {},
    numeroTrabalho: {},
    bairroTrabalho: {},
    complementoTrabalho: {},
    ufTrabalho: {},
    cidadeTrabalho: {},
    subPrefeituraTrabalho: {},
    distritoTrabalho: {},
    diasSemanaTrabalho: {},
    quaisConducoesTrabalho: {},
    quantHorasTrabalho: {},
    tempoAndandoConducao: {},
    tempoConducaoDestino: {},
    tempoTotalTrabalho: {},
    localizacaoInstituicaoEnsino: {},
    atividadeRemunerada: {},
    modalidadeTrabalho: {},
    localizacaoTrabalho: {},
    nomeAtividadeRemunerada: {},
    documentacaoCompletamentar: {},
    anexoComprovanteRenda: {},
    anexoCarteiraTrabalho: {},
    anexoArea: {},
    contatos: {},
    telefoneCelularIntegrante: {},    
    emailIntegrante: {},
    idLocal: "",
    selagem_id: "",
};

// Campos base fixos
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

const selectedSub = "Butantã"; // <-- apenas valor fixo
const subPrefeituraOptions = subprefeituras.map((nome) => ({
    label: nome,
    value: nome,
}));
const distritoOptions = (sub: string) => {
    const distritos = distritosPorSubprefeitura[sub] || [];
    return distritos.map((d) => ({ label: d, value: d }));
};
// Campos condicionais dinâmicos
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const fields: FormField[] = [];
    const integrantes = formValues.integrantesFamilia ?? [];

    integrantes.forEach((integrante) => {
        const key = slugify(integrante);

        fields.push(
            {
                name: `nomeIntegrante.${key}`,
                label: `Nome do ${integrante}`,
                type: "text",
                required: false,
                placeholder: "Nome completo",
            },
            {
                name: `nomeSocialIntegrante.${key}`,
                label: `Nome social do ${integrante}`,
                type: "text",
                required: false,
                placeholder: "Nome social (se houver)",
            },
            {
                name: `dataNascimentoIntegrante.${key}`,
                label: `Data nascimento do ${integrante}`,
                type: "date",
                required: false,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA",
            },
            {
                name: `idadeIntegrante.${key}`,
                label: `Idade do ${integrante}`,
                type: "display",
                required: false,
                displayValue: (data: Partial<FormValues>) => data?.idadeIntegrante?.[key] ?? "",
            },
            {
                name: `relacaoResponsavel.${key}`,
                label: `Qual o parentesco do ${integrante} com o responsável `,
                type: "select",
                required: false,
                options: [
                    { label: "Cônjuge/Companheiro(a)", value: "conjuge_campanheiro" },
                    { label: "Filho", value: "filho" },
                    { label: "Filha", value: "filha" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Irmã", value: "irma" },
                    { label: "Pai", value: "pai" },
                    { label: "Mãe", value: "mae" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Neto", value: "neto" },
                    { label: "Neta", value: "neta" },
                    { label: "Bisneto", value: "bisneto" },
                    { label: "Bisneta", value: "bisneta" },
                    { label: "Genro", value: "genro" },
                    { label: "Nora", value: "nora" },
                    { label: "Padrasto", value: "padrasto" },
                    { label: "Madrasta", value: "madrasta" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sem Relação de Parentesco", value: "sem_parentesco" },
                    { label: "Não Sabe Informar", value: "nsi" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ],
            },
            {
                name: `responsavelUnidade.${key}`,
                label: `${integrante} também é responsável pela unidade?`,
                type: "radio",
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ],
            },
            {
                name: `documentosSelecionados.${key}`,
                label: `Documentos (RG, CPF, RNM, CNH) do ${integrante}`,
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
            // *** CAMPOS DE FILIAÇÃO ADICIONADOS AQUI ***
            {
                name: `filiacao1_nome.${key}`,
                label: `Nome da filiação 1 do ${integrante}`,
                type: "text",
                required: false,
                placeholder: "Nome completo da filiação 1",
            },
            {
                name: `filiacao1_naoSeAplica.${key}`,
                label: `Filiação 1 não se aplica`,
                type: "checkbox",
                required: false,
            },
            {
                name: `filiacao2_nome.${key}`,
                label: `Nome da filiação 2 do ${integrante}`,
                type: "text",
                required: false,
                placeholder: "Nome completo da filiação 2",
            },
            {
                name: `filiacao2_naoSeAplica.${key}`,
                label: `Filiação 2 não se aplica do ${integrante}`,
                type: "checkbox",
                required: false,
            },
            {
                name: `pessoaDeficiencia.${key}`,
                label: `O ${integrante} possui deficiência:`,
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
                name: `estadoCivil.${key}`,
                label: `Estado civíl do ${integrante} `,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Solteiro(a)", value: "Solteiro(a)" },
                    { label: "Casado(a)", value: "Casado(a)" },
                    { label: "Viuvo(a)", value: "Viuvo(a)" },
                    { label: "Divorciado(a)", value: "Divorciado(a)" },
                ]
            },

            {
                name: `escolaridade.${key}`,
                label: `Escolaridade do ${integrante} `,
                type: "select",
                required: true,
                placeholder: "Selecione a escolaridade",
                options: [
                    { label: "Não alfabetizado", value: "nao_alfabetizado" },
                    { label: "Ensino Fundamental Incompleto", value: "fundamental_incompleto" },
                    { label: "Ensino Fundamental Completo", value: "fundamental_completo" },
                    { label: "Ensino Médio Incompleto", value: "medio_incompleto" },
                    { label: "Ensino Médio Completo", value: "medio_completo" },
                    { label: "Ensino Superior Incompleto", value: "superior_incompleto" },
                    { label: "Ensino Superior Completo", value: "superior_completo" },
                    { label: "Pós-graduação", value: "pos_graduacao" },
                    { label: "Mestrado", value: "mestrado" },
                    { label: "Doutorado", value: "doutorado" }
                ]
            },
            {
                name: `frequetaEscola.${key}`,
                label: `O ${integrante}, frequenta educação escolar?  `,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            },
            {
                name: `atividadeRemunerada.${key}`,
                label: `O ${integrante}, exerce atividade remunerada? `,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            },
            {
                name: `documentacaoCompletamentar.${key}`,
                label: `Documentacao complementar do ${integrante}: `,
                type: "label" as const,
                required: true,

            },
            {
                name: `anexoComprovanteRenda.${key}`,
                label: `Anexo - Comprovante de renda do ${integrante}`,
                type: "file" as const,
                required: false,
            },
            {
                name: `anexoCarteiraTrabalho.${key}`,
                label: `Anexo - Carteira de trabalho do ${integrante}`,
                type: "file" as const,
                required: false,
            },
            {
                name: `anexoArea.${key}`,
                label: `Anexo - Área do ${integrante}`,
                type: "file" as const,
                required: false,
            },
            {
                name: `contatos.${key}`,
                label: `Contatos do ${integrante}: `,
                type: "label" as const,
                required: true,
            },
            {
                name: `telefoneCelularIntegrante.${key}`,
                label: `Telefone celular do ${integrante}`,
                type: "text" as const,
                required: true,
            },
            {
                name: `emailIntegrante.${key}`,
                label: `E-mail do ${integrante}`,
                type: "email" as const,
                required: true,
                min: 1,
                max: 100,
                step: 1,
            },
        );

        const documentosSelecionados = formValues.documentosSelecionados?.[key] || [];

        if (documentosSelecionados.includes("RG")) {
            fields.push({
                name: `numero_rg.${key}`,
                label: `RG do ${integrante}`,
                type: "text",
                required: true,
                placeholder: "Digite o número do RG"
            });
        }

        if (documentosSelecionados.includes("CPF")) {
            fields.push({
                name: `numero_cpf.${key}`,
                label: `CPF do ${integrante}`,
                type: "text",
                required: true,
                placeholder: "Digite o número do CPF"
            });
        }

        if (documentosSelecionados.includes("RNM")) {
            fields.push({
                name: `numero_rnm.${key}`,
                label: `RNM do ${integrante}`,
                type: "text",
                required: true,
                placeholder: "Digite o número do RNM"
            });
        }

        if (documentosSelecionados.includes("CNH")) {
            fields.push({
                name: `numero_cnh.${key}`,
                label: `CNH do ${integrante}`,
                type: "text",
                required: true,
                placeholder: "Digite o número da CNH"
            });
        }
        // Agora só adiciona descrevParentesco se a condição for satisfeita
        if (formValues.relacaoResponsavel?.[key] === "outro") {
            fields.push({
                name: `descrevParentesco.${key}`,
                label: `Descreva a relação de parentesco com ${integrante}`,
                type: "text",
                required: false,
                placeholder: "Descreva o parentesco",
            });
        }
        if (formValues.pessoaDeficiencia?.[key] === "sim") {
            // Campo que pergunta se a pessoa é interditada
            fields.push({
                name: `pessoaInterditada.${key}`,
                label: `A pessoa é interditada por consequência da deficiência? ${integrante}`,
                type: "radio",
                required: true,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ]
            });

            // Verifica se a pessoa é interditada
            if (formValues.pessoaInterditada?.[key] === "sim") {
                fields.push(
                    {
                        name: `nomeCuradorTutora.${key}`,
                        label: "Nome da pessoa curadora/tutora",
                        type: "text",
                        required: true,
                        placeholder: "Digite o nome do curador ou tutor"
                    },
                    {
                        name: `tipoInterdicao.${key}`,
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
        }
        if (formValues.estadoCivil?.[key] === "Casado(a)") {
            // Campo que pergunta se a pessoa é interditada
            fields.push({
                name: `regimeCasamento.${key}`,
                label: `Regime de casamento ${integrante}`,
                type: "select",
                required: true,
                options: [
                    { label: "Comunhão Parcial de Bens (regime legal padrão)", value: "Comunhão Parcial" },
                    { label: "Comunhão Universal de Bens", value: "Comunhão Universal" },
                    { label: "Separação Total de Bens", value: "Separação Total" },
                    { label: "Participação Final nos Aquestos", value: "Participação Final Aquestos" },
                    { label: "Separação Obrigatória de Bens (ou Legal)", value: "Separação Obrigatória" },
                ]
            });


        }
        if (formValues.atividadeRemunerada?.[key] === "sim") {
            // Campo que pergunta se a pessoa é interditada
            fields.push(
                {
                    name: `modalidadeTrabalho.${key}`,
                    label: `Modalidade de trabalho do ${integrante}`,
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
                    name: `localizacaoTrabalho.${key}`,
                    label: `Localização da atividade remunerada principal do ${integrante}`,
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Na área", value: "Na area" },
                        { label: "Em outro lugar", value: "Em outro lugar" },
                    ]
                },
                {
                    name: `nomeAtividadeRemunerada.${key}`,
                    label: `Nome da atividade remunerada do ${integrante}`,
                    type: "text" as const,
                    required: false,
                },
                {
                    name: `cepTrabalho.${key}`,
                    label: `CEP do local de trabalho do ${integrante}`,
                    type: "text" as const,
                    required: false,
                    mask: "9999-999",
                    placeholder: "0000-000",
                },
                {
                    name: `naoAplicaTrabalho.${key}`,
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    disableField: `cep.${key}`,
                    dependent: true
                },
                {
                    name: `logradouroTrabalho.${key}`,
                    label: `Logradouro do local de trabalho do ${integrante}`,
                    type: "text" as const,
                    required: false,
                },
                {
                    name: `numeroTrabalho.${key}`,
                    label: `Número do local de trabalho do ${integrante}`,
                    type: "numberSpinner" as const,
                    required: false,
                    step: 1,
                },
                {
                    name: `bairroTrabalho.${key}`,
                    label: `Bairro do local de trabalho do ${integrante}`,
                    type: "text" as const,
                    required: false,
                },
                {
                    name: `complementoTrabalho.${key}`,
                    label: `Complemento do endereço de trabalho do ${integrante}`,
                    type: "text" as const,
                    required: false,
                },
                {
                    name: `ufTrabalho.${key}`,
                    label: `UF do local de trabalho do ${integrante}`,
                    type: "combobox" as const,
                    required: true,
                    options: []
                },
                {
                    name: `cidadeTrabalho.${key}`,
                    label: `Cidade do local de trabalho do ${integrante}`,
                    type: "combobox" as const,
                    required: true,
                    options: []
                },
                {
                    name: `subPrefeituraTrabalho.${key}`,
                    label: `Subprefeitura do local de trabalho do ${integrante}`,
                    type: "combobox" as const,
                    required: false,
                    options: subPrefeituraOptions,
                },
                {
                    name: `distritoTrabalho.${key}`,
                    label: `Distrito do local de trabalho do ${integrante}`,
                    type: "combobox" as const,
                    required: false,
                    options: distritoOptions(selectedSub),
                },
                {
                    name: `diasSemanaTrabalho.${key}`,
                    label: `Quais dias da semana o ${integrante} trabalha?`,
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
                    name: `quaisConducoesTrabalho.${key}`,
                    label: `Quais conduções o ${integrante} utiliza para chegar até o trabalho?`,
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
                    name: `quantHorasTrabalho.${key}`,
                    label: `Horário de saída da unidade de trabalho do ${integrante}`,
                    type: "time" as const,
                    required: false,
                },
                {
                    name: `tempoAndandoConducao.${key}`,
                    label: `Tempo que o ${integrante} anda até a condução`,
                    type: "time" as const,
                    required: false,
                },
                {
                    name: `tempoConducaoDestino.${key}`,
                    label: `Tempo de caminhada da condução até o destino de trabalho do ${integrante}`,
                    type: "time" as const,
                    required: false,
                },
                {
                    name: `tempoTotalTrabalho.${key}`,
                    label: `Tempo total do percurso até o trabalho do ${integrante}`,
                    type: "text" as const,
                    required: false,
                }

            );


        }
        if (formValues.frequetaEscola?.[key] === "sim") {
            // Campos sempre mostrados se a pessoa frequenta escola
            fields.push(
                {
                    name: `modalidadeEnsino.${key}`,
                    label: `Modalidade de ensino do ${integrante}`,
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
                    name: `nomeInstituicaoEnsino.${key}`,
                    label: `Nome da instituição de ensino do ${integrante}`,
                    type: "text",
                    required: true,
                    placeholder: "Digite o nome da instituição de ensino"
                },
                {
                    name: `pontoPartida.${key}`,
                    label: `Ponto de partida é a unidade?  ${integrante}`,
                    type: "radio" as const,
                    required: false,
                    options: [

                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },


                    ]

                },
            );

            if (formValues.pontoPartida?.[key] === "sim") {
                fields.push(
                    {
                        name: `diasSemana.${key}`,
                        label: `Quais dias da semana o ${integrante} frequenta?`,
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
                        ],
                    },
                    {
                        name: `quaisConducoes.${key}`,
                        label: `Quais conduções o ${integrante} utiliza para chegar até a instituição de ensino?`,
                        type: "multicombobox" as const,
                        required: false,
                        options: [
                            { label: "Ônibus", value: "Onibus" },
                            { label: "Metrô", value: "Metro" },
                            { label: "Trem", value: "Trem" },
                            { label: "Ônibus Escolar", value: "Onibus Escolar" },
                            { label: "Carro particular", value: "Carro particular" },
                            { label: "Outros", value: "Outros" },
                        ],
                    },
                    {
                        name: `quantHoras.${key}`,
                        label: `Horário de saída da unidade do ${integrante}`,
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: `tempoTotal.${key}`,
                        label: `Tempo total do percurso até a instituição de ensino do ${integrante}`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `tempoAndando.${key}`,
                        label: `Tempo andando da condução até a instituição de ensino do ${integrante}`,
                        type: "time" as const,
                        required: false,
                    }

                );
            }
            // Agora, se for modalidade presencial, exibe os campos de endereço
            if (formValues.modalidadeEnsino?.[key] === "Presencial" || formValues.modalidadeEnsino?.[key] === "Hibrido" || formValues.modalidadeEnsino?.[key] === "Outros") {
                fields.push(
                    {
                        name: `cepI.${key}`,
                        label: `CEP da instituição de ensino do ${integrante}`,
                        type: "text" as const,
                        required: false,
                        mask: "9999-999",
                        placeholder: "0000-000",
                    },
                    {
                        name: `naoAplicaI.${key}`,
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        disableField: `cep.${key}`,
                        dependent: true
                    },
                    {
                        name: `logradouroI.${key}`,
                        label: `Logradouro da instituição de ensino do ${integrante}`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `numeroI.${key}`,
                        label: `Número da instituição de ensino do ${integrante}`,
                        type: "numberSpinner" as const,
                        required: false,
                        step: 1,
                    },
                    {
                        name: `bairroI.${key}`,
                        label: `Bairro da instituição de ensino do ${integrante}`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `complementoI.${key}`,
                        label: `Complemento do endereço da instituição do ${integrante}`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `ufI.${key}`,
                        label: `UF da instituição de ensino do ${integrante}`,
                        type: "combobox" as const,
                        required: true,
                        options: []
                    },
                    {
                        name: `cidadeI.${key}`,
                        label: `Cidade da instituição de ensino do ${integrante}`,
                        type: "combobox" as const,
                        required: true,
                        options: []
                    },
                    {
                        name: `subPrefeituraI.${key}`,
                        label: `Subprefeitura da instituição de ensino do ${integrante}`,
                        type: "combobox" as const,
                        required: false,
                        options: subPrefeituraOptions,

                    },
                    {
                        name: `distritoI.${key}`,
                        label: `Distrito da instituição de ensino do ${integrante}`,
                        type: "combobox" as const,
                        required: false,
                        options: distritoOptions(selectedSub),

                    },
                    {
                        name: `localizacaoInstituicaoEnsino.${key}`,
                        label: `Localização da Instituição de Ensino do ${integrante}`,
                        type: "radio",
                        required: false,
                        options: [
                            { label: "Na área", value: "Na area" },
                            { label: "Em outro lugar", value: " Em outro lugar" },
                        ],
                    }

                );
            } else {
                fields.push(

                    {
                        name: `localizacaoInstituicaoEnsino.${key}`,
                        label: `Localização da Instituição de Ensino do ${integrante}`,
                        type: "radio",
                        required: false,
                        options: [
                            { label: "Na área", value: "Na area" },
                            { label: "Em outro lugar", value: " Em outro lugar" },
                        ],
                    }

                );
            }


        }


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
        const integrantes = formValues.integrantesFamilia ?? [];

        let lastInsertIndex = mergedFields.findIndex(f => f.name === "integrantesFamilia");

        integrantes.forEach((integrante) => {
            const key = slugify(integrante);

            // Grupo 1: nome, nome social, data nascimento
            const grupo1 = conditionalFields.filter(f =>
                [`nomeIntegrante.${key}`, `nomeSocialIntegrante.${key}`, `dataNascimentoIntegrante.${key}`].includes(f.name)
            );
            if (grupo1.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo1);
                lastInsertIndex += grupo1.length;
            }

            // Grupo 2: idade
            const grupo2 = conditionalFields.filter(f =>
                [`idadeIntegrante.${key}`].includes(f.name)
            );
            if (grupo2.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo2);
                lastInsertIndex += grupo2.length;
            }

            // Grupo 3: relação com responsável
            const grupo3 = conditionalFields.filter(f =>
                [`relacaoResponsavel.${key}`].includes(f.name)
            );
            if (grupo3.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo3);
                lastInsertIndex += grupo3.length;
            }

            // Grupo 4: descreve parentesco (só se relacaoResponsavel === "outro")
            const grupo4 = conditionalFields.filter(f =>
                [`descrevParentesco.${key}`].includes(f.name)
            );
            if (grupo4.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo4);
                lastInsertIndex += grupo4.length;
            }

            // Grupo 5: responsável pela unidade
            const grupo5 = conditionalFields.filter(f =>
                [`responsavelUnidade.${key}`].includes(f.name)
            );
            if (grupo5.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo5);
                lastInsertIndex += grupo5.length;
            }

            // Grupo 6: documentosSelecionados
            const grupo6 = conditionalFields.filter(f =>
                [`documentosSelecionados.${key}`].includes(f.name)
            );
            if (grupo6.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo6);
                lastInsertIndex += grupo6.length;
            }

            // Grupo 7: números dos documentos
            const grupo7 = conditionalFields.filter(f =>
                [
                    `numero_rg.${key}`,
                    `numero_cpf.${key}`,
                    `numero_rnm.${key}`,
                    `numero_cnh.${key}`
                ].includes(f.name)
            );
            if (grupo7.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo7);
                lastInsertIndex += grupo7.length;
            }

            // ✅ Grupo 8: campos de filiação
            const grupo8 = conditionalFields.filter(f =>
                [
                    `filiacao1_nome.${key}`,
                    `filiacao1_naoSeAplica.${key}`,
                    `filiacao2_nome.${key}`,
                    `filiacao2_naoSeAplica.${key}`
                ].includes(f.name)
            );
            if (grupo8.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo8);
                lastInsertIndex += grupo8.length;
            }
            const grupo9 = conditionalFields.filter(f =>
                [`pessoaDeficiencia.${key}`].includes(f.name)
            );
            if (grupo9.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo9);
                lastInsertIndex += grupo9.length;
            }
            const grupo10 = conditionalFields.filter(f =>
                [`pessoaInterditada.${key}`,
                `nomeCuradorTutora.${key}`,
                `tipoInterdicao.${key}`,

                ].includes(f.name)
            );
            if (grupo10.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo10);
                lastInsertIndex += grupo10.length;
            }
            const grupo11 = conditionalFields.filter(f =>
                [`estadoCivil.${key}`].includes(f.name)
            );
            if (grupo11.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo11);
                lastInsertIndex += grupo11.length;
            }
            const grupo12 = conditionalFields.filter(f =>
                [`regimeCasamento.${key}`].includes(f.name)
            );
            if (grupo12.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo12);
                lastInsertIndex += grupo12.length;
            }
            const grupo13 = conditionalFields.filter(f =>
                [`escolaridade.${key}`].includes(f.name)
            );
            if (grupo13.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo13);
                lastInsertIndex += grupo13.length;
            }
            const grupo14 = conditionalFields.filter(f =>
                [`frequetaEscola.${key}`].includes(f.name)
            );
            if (grupo14.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo14);
                lastInsertIndex += grupo14.length;
            }
            const grupo15 = conditionalFields.filter(f =>
                [
                    `modalidadeEnsino.${key}`,
                    `nomeInstituicaoEnsino.${key}`
                ].includes(f.name)
            );
            if (grupo15.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo15);
                lastInsertIndex += grupo15.length;
            }
            const grupo16 = conditionalFields.filter(f =>
                [
                    `cepI.${key}`,
                    `naoAplicaI.${key}`,
                    `logradouroI.${key}`,
                    `numeroI.${key}`,
                    `bairroI.${key}`,
                    `complementoI.${key}`,
                    `ufI.${key}`,
                    `cidadeI.${key}`,
                    `subPrefeituraI.${key}`,
                    `distritoI.${key}`,
                    `localizacaoInstituicaoEnsino.${key}`

                ].includes(f.name)
            );
            if (grupo16.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo16);
                lastInsertIndex += grupo16.length;
            }
            const grupo17 = conditionalFields.filter(f =>
                [`pontoPartida.${key}`].includes(f.name)
            );
            if (grupo17.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo17);
                lastInsertIndex += grupo17.length;
            }

            const grupo18 = conditionalFields.filter(f =>
                [
                    `diasSemana.${key}`,
                    `quaisConducoes.${key}`,
                    `quantHoras.${key}`,
                    `tempoTotal.${key}`,
                    `tempoAndando.${key}`,

                ].includes(f.name)
            );

            if (grupo18.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo18);
                lastInsertIndex += grupo18.length;
            }
            const grupo19 = conditionalFields.filter(f =>
                [`atividadeRemunerada.${key}`].includes(f.name)
            );

            if (grupo19.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo19);
                lastInsertIndex += grupo19.length;
            }
            const grupo20 = conditionalFields.filter(f =>
                [
                    `modalidadeTrabalho.${key}`,
                    `localizacaoTrabalho.${key}`,
                    `nomeAtividadeRemunerada.${key}`,
                    `cepTrabalho.${key}`,
                    `naoAplicaTrabalho.${key}`,
                    `logradouroTrabalho.${key}`,
                    `numeroTrabalho.${key}`,
                    `bairroTrabalho.${key}`,
                    `complementoTrabalho.${key}`,
                    `ufTrabalho.${key}`,
                    `cidadeTrabalho.${key}`,
                    `subPrefeituraTrabalho.${key}`,
                    `distritoTrabalho.${key}`,
                    `diasSemanaTrabalho.${key}`,
                    `quaisConducoesTrabalho.${key}`,
                    `quantHorasTrabalho.${key}`,
                    `tempoAndandoConducao.${key}`,
                    `tempoConducaoDestino.${key}`,
                    `tempoTotalTrabalho.${key}`,
                ].includes(f.name)
            );
            if (grupo20.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo20);
                lastInsertIndex += grupo20.length;
            }
            const grupo21 = conditionalFields.filter(f =>
                [
                    `documentacaoCompletamentar.${key}`,
                    `anexoComprovanteRenda.${key}`,
                    `anexoCarteiraTrabalho.${key}`,
                    `anexoArea.${key}`,
                ].includes(f.name)
            );


            if (grupo21.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo21);
                lastInsertIndex += grupo21.length;
            }
            const grupo22 = conditionalFields.filter(f =>
                [
                    `contatos.${key}`,
                    `telefoneCelularIntegrante.${key}`,                    
                    `emailIntegrante.${key}`,
                ].includes(f.name)
            );



            if (grupo22.length) {
                mergedFields.splice(lastInsertIndex + 1, 0, ...grupo22);
                lastInsertIndex += grupo22.length;
            }
        });

        return [
            {
                id: "integrantesFamilia_",
                title: "Integrantes da Família",
                fields: mergedFields,
            },
        ];
    } catch (error) {
        console.error("Erro ao gerar seções:", error);
        return [
            {
                id: "integrantesFamilia_",
                title: "Integrantes da Família",
                fields: [...baseFields],
            },
        ];
    }
}





