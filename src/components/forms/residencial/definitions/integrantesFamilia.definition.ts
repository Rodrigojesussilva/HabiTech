import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";
import { subprefeituras, distritosPorSubprefeitura } from "../subprefeiturasDistritos";
import { cp } from "fs";

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
    estadoCivil: z.record(z.string()).optional(),
    escolaridade: z.record(z.string()).optional(),
    frequentaEscola: z.record(z.string()).optional(),
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
    estadoCivil: {},
    escolaridade: {},
    frequentaEscola: {},
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
                    `responsavelUnidade.${key}`,
                    `documentosSelecionados.${key}`,
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
                    `estadoCivil.${key}`,
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
                    `quaisConducoes.${key}`,
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
                    `quaisConducoesTrabalho.${key}`,
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
