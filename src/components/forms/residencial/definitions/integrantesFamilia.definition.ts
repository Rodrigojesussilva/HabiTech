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
    outraRelacaoResponsavel: z.record(z.string()).optional(),
    doc: z.record(z.string()).optional(),
    cpfI: z.record(z.boolean()).optional(),
    rgI: z.record(z.boolean()).optional(),
    numeroRGI: z.record(z.string()).optional(),
    numeroCPFI: z.record(z.string()).optional(),
    numeroCNHI: z.record(z.string()).optional(),
    numeroRNMI: z.record(z.string()).optional(),
    cnhI: z.record(z.boolean()).optional(),
    rnmI: z.record(z.boolean()).optional(),
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
    frequentaEscola: z.record(z.string()).optional(),
    modalidadeEnsino: z.record(z.string()).optional(),
    nomeInstituicaoEnsino: z.record(z.string()).optional(),
    pontoPartida: z.record(z.string()).optional(),
    diasSemana: z.record(z.string()).optional(),
    domingo: z.record(z.string()).optional(),
    segunda: z.record(z.string()).optional(),
    terca: z.record(z.string()).optional(),
    quarta: z.record(z.string()).optional(),
    quinta: z.record(z.string()).optional(),
    sexta: z.record(z.string()).optional(),
    sabado: z.record(z.string()).optional(),
    quaisConducoes: z.record(z.string()).optional(),
    onibus: z.record(z.boolean()).optional(),
    metro: z.record(z.boolean()).optional(),
    trem: z.record(z.boolean()).optional(),
    onibusEscolar: z.record(z.boolean()).optional(),
    outros: z.record(z.boolean()).optional(),

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
    onibusTrabalho: z.record(z.boolean()).optional(),
    metroTrabalho: z.record(z.boolean()).optional(),
    tremTrabalho: z.record(z.boolean()).optional(),
    onibusEscolarTrabalho: z.record(z.boolean()).optional(),
    outrosTrabalho: z.record(z.boolean()).optional(),
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
    outraRelacaoResponsavel: {},
    doc: {},
    cpfI: {},
    rgI: {},
    numeroRGI: {},
    numeroCPFI: {},
    numeroCNHI: {},
    numeroRNMI: {},
    cnhI: {},
    rnmI: {},
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
    frequentaEscola: {},
    modalidadeEnsino: {},
    nomeInstituicaoEnsino: {},
    pontoPartida: {},
    diasSemana: {},
    domingo: {},
    segunda: {},
    terca: {},
    quarta: {},
    quinta: {},
    sexta: {},
    sabado: {},
    quaisConducoes: {},
    onibus: {},
    metro: {},
    trem: {},
    onibusEscolar: {},
    outros: {},
    quaisConducoesTrabalho: {},
    onibusTrabalho: {},
    metroTrabalho: {},
    tremTrabalho: {},
    onibusEscolarTrabalho: {},
    outrosTrabalho: {},
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
        dependent: true,
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

export function calcularIdade(dataNascimento: string): string {
    if (!dataNascimento || typeof dataNascimento !== "string") return "";

    const parts = dataNascimento.split("-");
    if (parts.length !== 3) return "";

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const birthDate = new Date(year, month, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age.toString();
}

// Campos condicionais dinâmicos
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const fields: FormField[] = [];
    const integrantes = formValues.integrantesFamilia ?? [];

    integrantes.forEach((integrante) => {
        const key = slugify(integrante);
        const dataNascimento = formValues.dataNascimentoIntegrante?.[key] ?? "";
        const idade = calcularIdade(dataNascimento);
        fields.push(
            {
                name: `nomeIntegrante.${key}`,
                label: `Nome `,
                type: "text",
                required: false,
                placeholder: "Nome completo",
            },
            {
                name: `nomeSocialIntegrante.${key}`,
                label: `Nome social `,
                type: "text",
                required: false,
                placeholder: "Nome social (se houver)",
            },
            {
                name: `dataNascimentoIntegrante.${key}`,
                label: `Data nascimento`,
                type: "date",
                required: false,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA",
            },
            {
                name: `idadeIntegrante.${key}`,
                label: `Idade `,
                type: "display",
                required: false,
                displayValue: () => idade,
            },
            {
                name: `relacaoResponsavel.${key}`,
                label: `Qual o parentesco com o responsável `,
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
            ...(formValues.relacaoResponsavel?.[key] === "outro"
                ? [{
                    name: `outraRelacaoResponsavel.${key}`,
                    label: `Descreva a relação de parentesco`,
                    type: "text" as const, // ✅ Correção aqui
                    required: true,
                    placeholder: "Descreva a relação de parentesco "
                }]
                : []),
            {
                name: `responsavelUnidade.${key}`,
                label: `É responsável pela unidade?`,
                type: "radio",
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ],
            },
            {
                name: `doc.${key}`,
                label: `Selecione os documentos`,
                type: "label",
                required: false,

            },
            {
                name: `rgI.${key}`,
                label: `RG `,
                type: "checkbox",
                required: false,

            },
            ...(formValues.rgI?.[key] === true
                ? [{
                    name: `numeroRGI.${key}`,
                    label: `Digiter o número do RG `,
                    type: "text" as const, // ✅ Correção aqui
                    required: true,
                    placeholder: "Digiter o número do RG "
                }]
                : []),
            {
                name: `cpfI.${key}`,
                label: `CPF `,
                type: "checkbox",
                required: false,

            },
            ...(formValues.cpfI?.[key] === true
                ? [{
                    name: `numeroCPFI.${key}`,
                    label: `Digiter o número do CPF `,
                    type: "text" as const, // ✅ Correção aqui
                    required: true,
                    placeholder: "Digiter o número do CPF "
                }]
                : []),
            {
                name: `cnhI.${key}`,
                label: `CNH `,
                type: "checkbox",
                required: false,

            },
            ...(formValues.cnhI?.[key] === true
                ? [{
                    name: `numeroCNHI.${key}`,
                    label: `Digiter o número da CNH `,
                    type: "text" as const, // ✅ Correção aqui
                    required: true,
                    placeholder: "Digiter o número da CNH "
                }]
                : []),
            {
                name: `rnmI.${key}`,
                label: `RNM `,
                type: "checkbox",
                required: false,

            },
            ...(formValues.rnmI?.[key] === true
                ? [{
                    name: `numeroRNMI.${key}`,
                    label: `Digiter o número do RNM `,
                    type: "text" as const, // ✅ Correção aqui
                    required: true,
                    placeholder: "Digiter o número do RNM "
                }]
                : []),
            {
                name: `filiacao1_nome.${key}`,
                label: `Nome da filiação 1`,
                type: "text",
                required: false,
                placeholder: "Nome completo da filiação 1",
            },
            {
                name: `filiacao1_naoSeAplica.${key}`,
                label: `não se aplica`,
                type: "checkbox",
                required: false,
            },
            {
                name: `filiacao2_nome.${key}`,
                label: `Nome da filiação 2`,
                type: "text",
                required: false,
                placeholder: "Nome completo da filiação 2",
            },
            {
                name: `filiacao2_naoSeAplica.${key}`,
                label: ` não se aplica`,
                type: "checkbox",
                required: false,
            },
            {
                name: `pessoaDeficiencia.${key}`,
                label: `Possui deficiência:`,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                    { label: "Não sei informar", value: "Não sei informar" },
                    { label: "Não repondeu", value: "Não repondeu" },
                ]
            },
            ...(formValues.pessoaDeficiencia?.[key] === "sim"
                ? [{
                    name: `pessoaInterditada.${key}`,
                    label: `A pessoa é interditada por consequência da deficiência?`,
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]

                }]
                : []),

            ...(formValues.pessoaInterditada?.[key] === "sim"
                ? [
                    {
                        name: `nomeCuradorTutora.${key}`,
                        label: "Nome do curador(a)/tutor(a)",
                        type: "text" as const,
                        required: true,
                    },
                    {
                        name: `tipoInterdicao.${key}`,
                        label: "Tipo de interdição",
                        type: "radio" as const,
                        required: true,
                        options: [
                            { label: "Parcial", value: "parcial" },
                            { label: "Total", value: "total" },
                        ],
                    }
                ]
                : []),


            {
                name: `estadoCivil.${key}`,
                label: `Estado civíl `,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Solteiro(a)", value: "Solteiro(a)" },
                    { label: "Casado(a)", value: "Casado(a)" },
                    { label: "Viuvo(a)", value: "Viuvo(a)" },
                    { label: "Divorciado(a)", value: "Divorciado(a)" },
                ]
            },
            ...(formValues.estadoCivil?.[key] === "Casado(a)"
                ? [
                    {
                        name: `regimeCasamento.${key}`,
                        label: `Regime de casamento}`,
                        type: "select" as const,
                        required: true,
                        options: [
                            { label: "Comunhão Parcial de Bens (regime legal padrão)", value: "Comunhão Parcial" },
                            { label: "Comunhão Universal de Bens", value: "Comunhão Universal" },
                            { label: "Separação Total de Bens", value: "Separação Total" },
                            { label: "Participação Final nos Aquestos", value: "Participação Final Aquestos" },
                            { label: "Separação Obrigatória de Bens (ou Legal)", value: "Separação Obrigatória" },
                        ],
                    },
                ]
                : []),

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
                name: `frequentaEscola.${key}`,
                label: `Frequenta educação escolar?  `,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            },
            ...(
                formValues.frequentaEscola?.[key] === "sim"
                    ? [
                        {
                            name: `modalidadeEnsino.${key}`,
                            label: `Modalidade de ensino`,
                            type: "radio" as const,
                            required: false,
                            options: [
                                { label: "Presencial", value: "Presencial" },
                                { label: "EAD", value: "EAD" },
                                { label: "Hibrido", value: "Hibrido" },
                                { label: "Outros", value: "Outros" },
                            ],
                        },
                        {
                            name: `nomeInstituicaoEnsino.${key}`,
                            label: `Nome da instituição de ensino`,
                            type: "text" as const,
                            required: false,
                        },

                        ...(formValues.modalidadeEnsino?.[key] === "Presencial" ||
                            formValues.modalidadeEnsino?.[key] === "Hibrido" ||
                            formValues.modalidadeEnsino?.[key] === "Outros"
                            ? [
                                {
                                    name: `cepI.${key}`,
                                    label: `CEP da instituição de ensino`,
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
                                    dependent: true,
                                },
                                {
                                    name: `logradouroI.${key}`,
                                    label: `Logradouro da instituição de ensino`,
                                    type: "text" as const,
                                    required: false,
                                },
                                {
                                    name: `numeroI.${key}`,
                                    label: `Número da instituição de ensino`,
                                    type: "numberSpinner" as const,
                                    required: false,
                                    step: 1,
                                },
                                {
                                    name: `bairroI.${key}`,
                                    label: `Bairro da instituição de ensino`,
                                    type: "text" as const,
                                    required: false,
                                },
                                {
                                    name: `complementoI.${key}`,
                                    label: `Complemento do endereço da instituição`,
                                    type: "text" as const,
                                    required: false,
                                },
                                {
                                    name: `ufI.${key}`,
                                    label: `UF da instituição de ensino `,
                                    type: "select" as const,
                                    required: true,
                                    options: [
                                        
                                    ],
                                },
                                {
                                    name: `cidadeI.${key}`,
                                    label: `Cidade da instituição de ensino`,
                                    type: "select" as const,
                                    required: true,
                                    options: [],
                                },
                                {
                                    name: `subPrefeituraI.${key}`,
                                    label: `Subprefeitura da instituição de ensino`,
                                    type: "select" as const,
                                    required: false,
                                    options: subPrefeituraOptions,
                                },
                                {
                                    name: `distritoI.${key}`,
                                    label: `Distrito da instituição de ensino`,
                                    type: "select" as const,
                                    required: false,
                                    options: distritoOptions(selectedSub),
                                },
                                {
                                    name: `localizacaoInstituicaoEnsino.${key}`,
                                    label: `Localização da Instituição de Ensino`,
                                    type: "radio" as const,
                                    required: false,
                                    options: [
                                        { label: "Na área", value: "Na area" },
                                        { label: "Em outro lugar", value: "Em outro lugar" },
                                    ],
                                },
                            ]
                            : [
                                {
                                    name: `localizacaoInstituicaoEnsino.${key}`,
                                    label: `Localização da Instituição de Ensino`,
                                    type: "radio" as const,
                                    required: false,
                                    options: [
                                        { label: "Na área", value: "Na area" },
                                        { label: "Em outro lugar", value: "Em outro lugar" },
                                    ],
                                },
                            ]),
                        {
                            name: `pontoPartida.${key}`,
                            label: `Ponto de partida é a unidade?`,
                            type: "radio" as const,
                            required: false,
                            options: [
                                { label: "Sim", value: "sim" },
                                { label: "Não", value: "nao" },
                            ],
                        },
                    ]
                    : []
            ),


            ...(formValues.pontoPartida?.[key] === "sim" && formValues.frequentaEscola?.[key] === "sim"
                ? [

                    {
                        name: `diasSemana.${key}`,
                        label: `Quais dias da semana frequenta a escola?`,
                        type: "label" as const,
                        required: false,

                    },
                    {
                        name: `domingo.${key}`,
                        label: `Domingo`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `segunda.${key}`,
                        label: `Segunda-feira`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `terca.${key}`,
                        label: `Terceira-feira`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `quarta.${key}`,
                        label: `Quarta-feira`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `quinta.${key}`,
                        label: `Quinta-feira`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `sexta.${key}`,
                        label: `Sexta-feira`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `sabado${key}`,
                        label: `Sabado`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `quaisConducoes.${key}`,
                        label: `Quais conduções utiliza para chegar até o trabalho?`,
                        type: "label" as const,
                        required: false,

                    },
                    {
                        name: `onibus.${key}`,
                        label: `Ônibus`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `metro.${key}`,
                        label: `Metrô`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `trem.${key}`,
                        label: `Trem`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `onibusEscolar.${key}`,
                        label: `Ônibus Escolar`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `outros.${key}`,
                        label: `Ônibus Escolar`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `quantHoras.${key}`,
                        label: `Horário de saída da unidade`,
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: `tempoTotal.${key}`,
                        label: `Tempo total do percurso até a instituição de ensino`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `tempoAndando.${key}`,
                        label: `Tempo andando da condução até a instituição de ensino`,
                        type: "time" as const,
                        required: false,
                    },
                ]
                : []),

            {
                name: `atividadeRemunerada.${key}`,
                label: `Exerce atividade remunerada? `,
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            },

            ...(formValues.atividadeRemunerada?.[key] === "sim"
                ? [
                    {
                        name: `modalidadeTrabalho.${key}`,
                        label: `Modalidade de trabalho`,
                        type: "radio" as const,
                        required: false,
                        options: [
                            { label: "Presencial", value: "Presencial" },
                            { label: "EAD", value: "EAD" },
                            { label: "Hibrido", value: "Hibrido" },
                            { label: "Outros", value: "Outros" },
                        ],
                    },
                    {
                        name: `localizacaoTrabalho.${key}`,
                        label: `Localização da atividade remunerada principal`,
                        type: "radio" as const,
                        required: false,
                        options: [
                            { label: "Na área", value: "Na area" },
                            { label: "Em outro lugar", value: "Em outro lugar" },
                        ],
                    },
                    {
                        name: `nomeAtividadeRemunerada.${key}`,
                        label: `Nome da atividade remunerada`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `cepTrabalho.${key}`,
                        label: `CEP do local de trabalho`,
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
                        dependent: true,
                    },
                    {
                        name: `logradouroTrabalho.${key}`,
                        label: `Logradouro do local de trabalho`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `numeroTrabalho.${key}`,
                        label: `Número do local de trabalho`,
                        type: "numberSpinner" as const,
                        required: false,
                        step: 1,
                    },
                    {
                        name: `bairroTrabalho.${key}`,
                        label: `Bairro do local de trabalho`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `complementoTrabalho.${key}`,
                        label: `Complemento do endereço de trabalho`,
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: `ufTrabalho.${key}`,
                        label: `UF do local de trabalho`,
                        type: "select" as const,
                        required: true,
                        options: [], // Preencher dinamicamente se necessário
                    },
                    {
                        name: `cidadeTrabalho.${key}`,
                        label: `Cidade do local de trabalho do`,
                        type: "select" as const,
                        required: true,
                        options: [], // Preencher dinamicamente se necessário
                    },
                    {
                        name: `subPrefeituraTrabalho.${key}`,
                        label: `Subprefeitura do local de trabalho`,
                        type: "select" as const,
                        required: false,
                        options: subPrefeituraOptions,
                    },
                    {
                        name: `distritoTrabalho.${key}`,
                        label: `Distrito do local de trabalho`,
                        type: "select" as const,
                        required: false,
                        options: distritoOptions(selectedSub),
                    },
                    {
                        name: `diasSemanaTrabalho.${key}`,
                        label: `Quais dias da semana trabalha?`,
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
                        name: `quaisConducoesTrabalho.${key}`,
                        label: `Quais conduções utiliza para chegar até o trabalho?`,
                        type: "label" as const,
                        required: false,

                    },
                    {
                        name: `onibusTrabalho.${key}`,
                        label: `Ônibus`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `metroTrabalho.${key}`,
                        label: `Metrô`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `tremTrabalho.${key}`,
                        label: `Trem`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `onibusEscolarTrabalho.${key}`,
                        label: `Ônibus Escolar`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `outrosTrabalho.${key}`,
                        label: `Ônibus Escolar`,
                        type: "checkbox" as const,
                        required: false,

                    },
                    {
                        name: `quantHorasTrabalho.${key}`,
                        label: `Horário de saída da unidade de trabalho`,
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: `tempoAndandoConducao.${key}`,
                        label: `Tempo que anda até a condução`,
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: `tempoConducaoDestino.${key}`,
                        label: `Tempo de caminhada da condução até o destino de trabalho`,
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: `tempoTotalTrabalho.${key}`,
                        label: `Tempo total do percurso até o trabalho`,
                        type: "text" as const,
                        required: false,
                    },
                ]
                : []),


            {
                name: `documentacaoCompletamentar.${key}`,
                label: `Documentacao complementar: `,
                type: "label" as const,
                required: true,

            },
            {
                name: `anexoComprovanteRenda.${key}`,
                label: `Anexo - Comprovante de renda`,
                type: "file" as const,
                required: false,
            },
            {
                name: `anexoCarteiraTrabalho.${key}`,
                label: `Anexo - Carteira de trabalho`,
                type: "file" as const,
                required: false,
            },
            {
                name: `anexoArea.${key}`,
                label: `Anexo - Área`,
                type: "file" as const,
                required: false,
            },
            {
                name: `contatos.${key}`,
                label: `Contatos`,
                type: "label" as const,
                required: true,
            },
            {
                name: `telefoneCelularIntegrante.${key}`,
                label: `Telefone celular`,
                type: "text" as const,
                required: true,
            },
            {
                name: `emailIntegrante.${key}`,
                label: `E-mail`,
                type: "email" as const,
                required: true,
                min: 1,
                max: 100,
                step: 1,
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
        const integrantes = formValues.integrantesFamilia ?? [];

        let lastInsertIndex = mergedFields.findIndex(f => f.name === "integrantesFamilia");
        if (lastInsertIndex === -1) lastInsertIndex = mergedFields.length;

        integrantes.forEach((integrante) => {
            const key = slugify(integrante);

            // Aqui pode montar grupos de campos específicos para cada integrante
            // Exemplo:
            const grupo1 = conditionalFields.filter(f =>
                [
                    `nomeIntegrante.${key}`,
                    `nomeSocialIntegrante.${key}`,
                    `dataNascimentoIntegrante.${key}`,
                    `idadeIntegrante.${key}`,
                    `relacaoResponsavel.${key}`,
                    `outraRelacaoResponsavel.${key}`,
                    `responsavelUnidade.${key}`,
                    `doc.${key}`,
                    `rgI.${key}`,
                    `numeroRGI.${key}`,
                    `cpfI.${key}`,
                    `numeroCPFI.${key}`,
                    `rnmI.${key}`,
                    `numeroRNMI.${key}`,
                    `cnhI.${key}`,
                    `numeroCNHI.${key}`,
                    `filiacao1_nome.${key}`,
                    `filiacao1_naoSeAplica.${key}`,
                    `filiacao2_nome.${key}`,
                    `filiacao2_naoSeAplica.${key}`,
                    `pessoaDeficiencia.${key}`,
                    `pessoaInterditada.${key}`,
                    `nomeCuradorTutora.${key}`,
                    `tipoInterdicao.${key}`,
                    `estadoCivil.${key}`,
                    `regimeCasamento.${key}`,
                    `escolaridade.${key}`,
                    `frequentaEscola.${key}`,
                    `modalidadeEnsino.${key}`,
                    `nomeInstituicaoEnsino.${key}`,
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
                    `localizacaoInstituicaoEnsino.${key}`,
                    `pontoPartida.${key}`,
                    `diasSemana.${key}`,
                    `domingo.${key}`,
                    `segunda.${key}`,
                    `terca.${key}`,
                    `quarta.${key}`,
                    `quinta.${key}`,
                    `sexta.${key}`,
                    `sabado.${key}`,
                    `quaisConducoes.${key}`,
                    `onibus.${key}`,
                    `metro.${key}`,
                    `trem.${key}`,
                    `onibusEscolar.${key}`,
                    `outros.${key}`,
                    `quaisConducoesTrabalho.${key}`,
                    `onibusTrabalho.${key}`,
                    `metroTrabalho.${key}`,
                    `tremTrabalho.${key}`,
                    `onibusEscolarTrabalho.${key}`,
                    `outrosTrabalho.${key}`,
                    `quantHoras.${key}`,
                    `tempoTotal.${key}`,
                    `tempoAndando.${key}`,
                    `atividadeRemunerada.${key}`,
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
                    `quantHorasTrabalho.${key}`,
                    `tempoAndandoConducao.${key}`,
                    `tempoConducaoDestino.${key}`,
                    `tempoTotalTrabalho.${key}`,
                    `documentacaoCompletamentar.${key}`,
                    `anexoComprovanteRenda.${key}`,
                    `anexoCarteiraTrabalho.${key}`,
                    `anexoArea.${key}`,
                    `contatos.${key}`,
                    `telefoneCelularIntegrante.${key}`,
                    `emailIntegrante.${key}`,

                ].includes(f.name)
            );

            // Insere os campos condicionais logo após o campo "integrantesFamilia"
            mergedFields.splice(lastInsertIndex + 1, 0, ...grupo1);

            lastInsertIndex += grupo1.length;
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
