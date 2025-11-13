import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";
import { subprefeituras, distritosPorSubprefeitura } from "../subprefeiturasDistritos";



// ✅ BLOCO DE RENDA DO RESPONSÁVEL (idade ≥ 14) - CALCULADO A PARTIR DA DATA
function calcularIdade(dataNascimento: string): { idade: number; mostrarRenda: boolean } {
    if (!dataNascimento) return { idade: 0, mostrarRenda: false };

    // Converter a data do formato YYYY-MM-DD para calcular idade
    const [ano, mes, dia] = dataNascimento.split('-').map(Number);
    const dataNasc = new Date(ano, mes - 1, dia); // mês é 0-indexed
    const hoje = new Date();

    let idade = hoje.getFullYear() - dataNasc.getFullYear();

    // Ajustar se ainda não fez aniversário este ano
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    if (mesAtual < (mes - 1) || (mesAtual === (mes - 1) && diaAtual < dia)) {
        idade--;
    }

    return { idade, mostrarRenda: idade >= 14 };
}


// Form validation schema
export const situUsoUniSchema = z.object({

    responsavelR: z.string().optional(),
    nomeCompletoRespR: z.string().optional(),
    nomeSocialR: z.string().optional(),
    naoSeAplicaNomeSocial: z.string().optional(),
    dataNascimentoRespR: z.string().optional(),
    idadeRespR: z.string().optional(),

    rg: z.string().optional(),
    cpf: z.string().optional(),
    rnm: z.string().optional(),
    cnh: z.string().optional(),

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

    filiacao1: z.string().optional(),
    filiacao2: z.string().optional(),
    filiacao3: z.string().optional(),
    filiacao4: z.string().optional(),
    filiacao5: z.string().optional(),
    filiacao6: z.string().optional(),
    filiacao7: z.string().optional(),
    filiacao8: z.string().optional(),
    filiacao9: z.string().optional(),
    filiacao10: z.string().optional(),

    nomeFiliacao1: z.string().optional(),
    nomeFiliacao2: z.string().optional(),
    nomeFiliacao3: z.string().optional(),
    nomeFiliacao4: z.string().optional(),
    nomeFiliacao5: z.string().optional(),
    nomeFiliacao6: z.string().optional(),
    nomeFiliacao7: z.string().optional(),
    nomeFiliacao8: z.string().optional(),
    nomeFiliacao9: z.string().optional(),
    nomeFiliacao10: z.string().optional(),

    naoAplicaFiliacao1: z.string().optional(),
    naoAplicaFiliacao2: z.string().optional(),
    naoAplicaFiliacao3: z.string().optional(),
    naoAplicaFiliacao4: z.string().optional(),
    naoAplicaFiliacao5: z.string().optional(),
    naoAplicaFiliacao6: z.string().optional(),
    naoAplicaFiliacao7: z.string().optional(),
    naoAplicaFiliacao8: z.string().optional(),
    naoAplicaFiliacao9: z.string().optional(),
    naoAplicaFiliacao10: z.string().optional(),



    frequetaEscola: z.string().optional(),
    modalidadeEnsino: z.string().optional(),
    nomeInstituicaoEnsino: z.string().optional(),
    cep_r: z.string().optional(),
    naoAplicaCep_r: z.string().optional(),
    logradouro_r: z.string().optional(),
    numero_r: z.string().optional(),
    bairro_r: z.string().optional(),
    complemento_r: z.string().optional(),
    uf_r: z.string().optional(),
    cidade_r: z.string().optional(),
    subPrefeitura_r: z.string().optional(),
    distrito_r: z.string().optional(),
    cep_t: z.string().optional(),
    naoAplicaCep_t: z.string().optional(),
    logradouro_t: z.string().optional(),
    numero_t: z.string().optional(),
    bairro_t: z.string().optional(),
    complemento_t: z.string().optional(),
    uf_t: z.string().optional(),

    cidade_t: z.string().optional(),
    subPrefeitura_t: z.string().optional(),
    distrito_t: z.string().optional(),
    localizacaoInstituicaoEnsino: z.string().optional(),
    pontoPartida: z.string().optional(),

    diasSemana: z.string().optional(),
    Domingo: z.string().optional(),
    Segunda: z.string().optional(),
    Terca: z.string().optional(),
    Quarta: z.string().optional(),
    Quinta: z.string().optional(),
    Sexta: z.string().optional(),
    Sabado: z.string().optional(),

    quaisConducoes: z.string().optional(),
    onibus: z.string().optional(),
    metro: z.string().optional(),
    trem: z.string().optional(),
    onibusEscolar: z.string().optional(),
    carroParticular: z.string().optional(),
    conducaoOutros: z.string().optional(),


    quantHoras: z.string().optional(),
    tempoTotal: z.string().optional(),
    tempoAndando: z.string().optional(),
    atividadeRemunerada: z.string().optional(),
    modalidadeTrabalho: z.string().optional(),
    localizacaoTrabalho: z.string().optional(),

    diasSemanaTrabalho: z.string().optional(),
    trabalhoDomingo: z.string().optional(),
    trabalhoSegunda: z.string().optional(),
    trabalhoTerca: z.string().optional(),
    trabalhoQuarta: z.string().optional(),
    trabalhoQuinta: z.string().optional(),
    trabalhoSexta: z.string().optional(),
    trabalhoSabado: z.string().optional(),

    quaisConducoesTrabalho: z.string().optional(),
    trabalhoOnibus: z.string().optional(),
    trabalhoMetro: z.string().optional(),
    trabalhoTrem: z.string().optional(),
    trabalhoOnibusEscolar: z.string().optional(),
    trabalhoCarroParticular: z.string().optional(),
    trabalhoConducaoOutros: z.string().optional(),

    quantHorasTrabalho: z.string().optional(),
    tempoTotalTrabalho: z.string().optional(),
    tempoAndandoConducao: z.string().optional(),
    tempoConducaoDestino: z.string().optional(),
    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),

    // ✅ CAMPOS PARA RENDA DO RESPONSÁVEL
    rendaResponsavel: z.string().optional(),
    recebeBeneficioResponsavel: z.string().optional(),
    bolsaFamilia: z.string().optional(),
    auxlioEmergencial: z.string().optional(),
    bpcPessoaIdosa: z.string().optional(),
    bpcPessoaDeficiencia: z.string().optional(),
    auxilioInclusao: z.string().optional(),
    rendaCidada: z.string().optional(),
    rendaMinima: z.string().optional(),
    acaoJovem: z.string().optional(),
    outroBeneficio: z.string().optional(),


    valorRendaBolsaFResponsavel: z.string().optional(),
    valorRendaAuxilioEResponsavel: z.string().optional(),
    valorRendaBPC_PessoaIResponsavel: z.string().optional(),
    valorRendaBPC_PessoaDResponsavel: z.string().optional(),
    valorRendaAuxilioInclusaoResponsavel: z.string().optional(),
    valorRendaCidadaResponsavel: z.string().optional(),
    valorRendaMinimaResponsavel: z.string().optional(),
    valorRendaAcaoJovemResponsavel: z.string().optional(),
    especifiqueFonteRenda: z.string().optional(),



    naoAplicaValorRendaBolsaFResponsavel: z.boolean().optional(),
    naoAplicaValorRendaAuxilioEResponsavel: z.boolean().optional(),
    naoAplicaValorRendaBPC_PessoaIResponsavel: z.boolean().optional(),
    naoAplicaValorRendaBPC_PessoaDResponsavel: z.boolean().optional(),
    naoAplicaValorRendaAuxilioInclusaoResponsavel: z.boolean().optional(),
    naoAplicaValorRendaCidadaResponsavel: z.boolean().optional(),
    naoAplicaValorRendaMinimaResponsavel: z.boolean().optional(),
    naoAplicaValorRendaAcaoJovemResponsavel: z.boolean().optional(),
    naoAplicaValorRendaOutroBeneficioResponsavel: z.boolean().optional(),

    origemRendaResponsavel: z.array(z.string()).optional(),
    aposentadoriaResponsavel: z.array(z.string()).optional(),
    pensaoPorMorteResponsavel: z.array(z.string()).optional(),
    pensaoAlimenticiaResponsavel: z.array(z.string()).optional(),
    auxilioDoencaResponsavel: z.array(z.string()).optional(),
    auxilioReclusaoResponsavel: z.array(z.string()).optional(),
    auxilioAcidenteResponsavel: z.array(z.string()).optional(),
    salarioFamiliaResponsavel: z.array(z.string()).optional(),
    salarioMaternidadeResponsavel: z.array(z.string()).optional(),
    aluguelResponsavel: z.array(z.string()).optional(),
    outraOrigemRendaResponsavel: z.array(z.string()).optional(),



    valorRendaAposentadoriaResponsavel: z.string().optional(),
    valorRendaPensaoPorMorteResponsavel: z.string().optional(),
    valorRendaPensaoAlimenticiaResponsavel: z.string().optional(),
    valorRendaAuxilioDoencaResponsavel: z.string().optional(),
    valorRendaAuxilioReclusaoResponsavel: z.string().optional(),
    valorRendaAuxilioAcidenteResponsavel: z.string().optional(),
    valorRendaSalarioFamiliaResponsavel: z.string().optional(),
    valorRendaSalarioMaternidadeResponsavel: z.string().optional(),
    valorRendaAluguelResponsavel: z.string().optional(),
    especifiqueOutraOrigemRenda: z.string().optional(),

    naoInformadoValorRendaAposentadoriaResponsavel: z.boolean().optional(),
    naoInformadoValorRendaPensaoPorMorteResponsavel: z.boolean().optional(),
    naoInformadoValorRendaPensaoAlimenticiaResponsavel: z.boolean().optional(),
    naoInformadoValorRendaAuxilioDoencaResponsavel: z.boolean().optional(),
    naoInformadoValorRendaAuxilioReclusaoResponsavel: z.boolean().optional(),
    naoInformadoValorRendaAuxilioAcidenteResponsavel: z.boolean().optional(),
    naoInformadoValorRendaSalarioFamiliaResponsavel: z.boolean().optional(),
    naoInformadoValorRendaSalarioMaternidadeResponsavel: z.boolean().optional(),
    naoInformadoValorRendaAluguelResponsavel: z.boolean().optional(),
    especificarOutrosResponsavel: z.string().optional(),
});

export type FormValues = z.infer<typeof situUsoUniSchema>;

export const defaultValues: Partial<FormValues> = {
    responsavelR: "",
    nomeCompletoRespR: "",
    nomeSocialR: "",
    naoSeAplicaNomeSocial: "",
    dataNascimentoRespR: "",
    idadeRespR: "",

    rg: "",
    cpf: "",
    rnm: "",
    cnh: "",


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
    filiacao1: "",
    filiacao2: "",
    filiacao3: "",
    filiacao4: "",
    filiacao5: "",
    filiacao6: "",
    filiacao7: "",
    filiacao8: "",
    filiacao9: "",
    filiacao10: "",

    nomeFiliacao1: "",
    nomeFiliacao2: "",
    nomeFiliacao3: "",
    nomeFiliacao4: "",
    nomeFiliacao5: "",
    nomeFiliacao6: "",
    nomeFiliacao7: "",
    nomeFiliacao8: "",
    nomeFiliacao9: "",
    nomeFiliacao10: "",

    naoAplicaFiliacao1: "",
    naoAplicaFiliacao2: "",
    naoAplicaFiliacao3: "",
    naoAplicaFiliacao4: "",
    naoAplicaFiliacao5: "",
    naoAplicaFiliacao6: "",
    naoAplicaFiliacao7: "",
    naoAplicaFiliacao8: "",
    naoAplicaFiliacao9: "",
    naoAplicaFiliacao10: "",

    frequetaEscola: "",
    modalidadeEnsino: "",
    nomeInstituicaoEnsino: "",
    cep_r: "",
    naoAplicaCep_r: "",
    logradouro_r: "",
    numero_r: "",
    bairro_r: "",
    complemento_r: "",
    uf_r: "",
    cidade_r: "",
    subPrefeitura_r: "",
    distrito_r: "",
    localizacaoInstituicaoEnsino: "",
    pontoPartida: "",

    diasSemana: "",
    Domingo: "",
    Segunda: "",
    Terca: "",
    Quarta: "",
    Quinta: "",
    Sexta: "",
    Sabado: "",

    diasSemanaTrabalho: "",
    trabalhoDomingo: "",
    trabalhoSegunda: "",
    trabalhoTerca: "",
    trabalhoQuarta: "",
    trabalhoQuinta: "",
    trabalhoSexta: "",
    trabalhoSabado: "",

    quaisConducoes: "",
    quantHoras: "",
    tempoTotal: "",
    tempoAndando: "",
    atividadeRemunerada: "",
    modalidadeTrabalho: "",
    localizacaoTrabalho: "",
    cep_t: "",
    naoAplicaCep_t: "",
    logradouro_t: "",
    numero_t: "",
    bairro_t: "",
    complemento_t: "",
    uf_t: "",
    cidade_t: "",
    subPrefeitura_t: "",
    distrito_t: "",
    idLocal: "not",
};

const selectedSub = "Butantã";
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
                    name: "responsavelR",
                    label: "A pessoa é responsável pela unidade?",
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
    const rendaResponsavelConditionals: FormField[] = [];

    // ✅ BLOCO DE RENDA DO RESPONSÁVEL (idade ≥ 14) - CALCULADO A PARTIR DA DATA
    const dataNascimentoResponsavel = formValues.dataNascimentoRespR || "";
    const { idade: idadeCalculadaResponsavel, mostrarRenda: mostrarRendaResponsavel } = calcularIdade(dataNascimentoResponsavel);

    console.log('🔍 Data nascimento responsável:', dataNascimentoResponsavel);
    console.log('🔍 Idade calculada responsável:', idadeCalculadaResponsavel);
    console.log('🔍 Mostrar renda responsável (idade ≥ 14):', mostrarRendaResponsavel);

    if (mostrarRendaResponsavel) {
        rendaResponsavelConditionals.push(
            {
                name: "rendaResponsavel",
                label: `Renda do Responsável (idade: ${idadeCalculadaResponsavel} anos)`,
                type: "label" as const,
                required: false,
            },
            {
                name: "recebeBeneficioResponsavel",
                label: "Recebe benefício?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ]
            }
        );

        // SEÇÃO DE BENEFÍCIOS (mantida igual)
        if (formValues.recebeBeneficioResponsavel === "sim") {
            rendaResponsavelConditionals.push(
                {
                    name: "beneficiosRecebidosResponsavel",
                    label: "Benefícios recebidos",
                    type: "label",
                    required: true,
                },
                {
                    name: "bolsaFamilia",
                    label: "Bolsa Família",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se bolsaFamilia for true, adiciona os campos de valor
            if (formValues.bolsaFamilia) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaBolsaFResponsavel",
                        label: "Valor do Bolsa Família",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaBolsaFResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "auxlioEmergencial",
                    label: "Auxilio Emergencial",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se auxlioEmergencial for true, adiciona os campos de valor
            if (formValues.auxlioEmergencial) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaAuxilioEResponsavel",
                        label: "Valor do Auxílio Emergencial",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaAuxilioEResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "bpcPessoaIdosa",
                    label: "BPC (Pessoa idosa)",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se bpcPessoaIdosa for true, adiciona os campos de valor
            if (formValues.bpcPessoaIdosa) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaBPC_PessoaIResponsavel",
                        label: "Valor do BPC (Pessoa idosa)",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaBPC_PessoaIResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "bpcPessoaDeficiencia",
                    label: "BPC (Pessoa com deficiência)",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se bpcPessoaDeficiencia for true, adiciona os campos de valor
            if (formValues.bpcPessoaDeficiencia) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaBPC_PessoaDResponsavel",
                        label: "Valor do BPC (Pessoa com deficiência)",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaBPC_PessoaDResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "auxilioInclusao",
                    label: "Auxílio inclusão",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se auxilioInclusao for true, adiciona os campos de valor
            if (formValues.auxilioInclusao) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaAuxilioInclusaoResponsavel",
                        label: "Valor do Auxílio Inclusão",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaAuxilioInclusaoResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "rendaCidada",
                    label: "Renda cidadã",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se rendaCidada for true, adiciona os campos de valor
            if (formValues.rendaCidada) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaCidadaResponsavel",
                        label: "Valor da Renda Cidadã",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaCidadaResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "rendaMinima",
                    label: "Renda minima",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se rendaMinima for true, adiciona os campos de valor
            if (formValues.rendaMinima) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaMinimaResponsavel",
                        label: "Valor da Renda Mínima",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaMinimaResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "acaoJovem",
                    label: "Acão Jovem",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se acaoJovem for true, adiciona os campos de valor
            if (formValues.acaoJovem) {
                rendaResponsavelConditionals.push(
                    {
                        name: "valorRendaAcaoJovemResponsavel",
                        label: "Valor do Ação Jovem",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaAcaoJovemResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }

            rendaResponsavelConditionals.push(
                {
                    name: "outroBeneficio",
                    label: "Outro benefício",
                    type: "checkbox" as const,
                    required: false,
                }
            );

            // Se outroBeneficio for true, adiciona os campos de valor
            if (formValues.outroBeneficio) {
                rendaResponsavelConditionals.push(
                    {
                        name: "especifiqueFonteRenda",
                        label: "Especifique fonte de renda",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "naoAplicaValorRendaOutroBeneficioResponsavel",
                        label: "Não se aplica",
                        type: "checkbox" as const,
                        required: false,
                        dependent: true
                    }
                );
            }
        }

        // SEÇÃO DE ORIGEM DA RENDA (NO MESMO PADRÃO DOS BENEFÍCIOS)
        rendaResponsavelConditionals.push(
            {
                name: "origemRenda",
                label: "Origem da Renda",
                type: "label",
                required: false,
            },
            {
                name: "aposentadoriaResponsavel",
                label: "Aposentadoria (idade, invalidez ou por tempo de contribuição)",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se aposentadoriaResponsavel for true, adiciona os campos de valor
        if (formValues.aposentadoriaResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaAposentadoriaResponsavel",
                    label: "Valor da Aposentadoria",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaAposentadoriaResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "pensaoPorMorteResponsavel",
                label: "Pensão por morte",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se pensaoPorMorteResponsavel for true, adiciona os campos de valor
        if (formValues.pensaoPorMorteResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaPensaoPorMorteResponsavel",
                    label: "Valor da Pensão por morte",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaPensaoPorMorteResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "pensaoAlimenticiaResponsavel",
                label: "Pensão alimentícia",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se pensaoAlimenticiaResponsavel for true, adiciona os campos de valor
        if (formValues.pensaoAlimenticiaResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaPensaoAlimenticiaResponsavel",
                    label: "Valor da Pensão alimentícia",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaPensaoAlimenticiaResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "auxilioDoencaResponsavel",
                label: "Auxílio doença",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se auxilioDoencaResponsavel for true, adiciona os campos de valor
        if (formValues.auxilioDoencaResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaAuxilioDoencaResponsavel",
                    label: "Valor do Auxílio doença",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaAuxilioDoencaResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "auxilioReclusaoResponsavel",
                label: "Auxílio reclusão",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se auxilioReclusaoResponsavel for true, adiciona os campos de valor
        if (formValues.auxilioReclusaoResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaAuxilioReclusaoResponsavel",
                    label: "Valor do Auxílio reclusão",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaAuxilioReclusaoResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "auxilioAcidenteResponsavel",
                label: "Auxílio acidente",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se auxilioAcidenteResponsavel for true, adiciona os campos de valor
        if (formValues.auxilioAcidenteResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaAuxilioAcidenteResponsavel",
                    label: "Valor do Auxílio acidente",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaAuxilioAcidenteResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "salarioFamiliaResponsavel",
                label: "Salário família",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se salarioFamiliaResponsavel for true, adiciona os campos de valor
        if (formValues.salarioFamiliaResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaSalarioFamiliaResponsavel",
                    label: "Valor do Salário família",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaSalarioFamiliaResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "salarioMaternidadeResponsavel",
                label: "Salário maternidade",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se salarioMaternidadeResponsavel for true, adiciona os campos de valor
        if (formValues.salarioMaternidadeResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaSalarioMaternidadeResponsavel",
                    label: "Valor do Salário maternidade",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaSalarioMaternidadeResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "aluguelResponsavel",
                label: "Aluguel",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se aluguelResponsavel for true, adiciona os campos de valor
        if (formValues.aluguelResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "valorRendaAluguelResponsavel",
                    label: "Valor do Aluguel",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorRendaAluguelResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        rendaResponsavelConditionals.push(
            {
                name: "outraOrigemRendaResponsavel",
                label: "Outra origem de renda",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se outraOrigemRendaResponsavel for true, adiciona os campos de valor
        if (formValues.outraOrigemRendaResponsavel) {
            rendaResponsavelConditionals.push(
                {
                    name: "especifiqueOutraOrigemRenda",
                    label: "Especifique outra origem de renda",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaValorOutraOrigemRendaResponsavel",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }
    }

    // CAMPOS EXISTENTES

    if (formValues.responsavelR === "sim") {
        usoUnidadeConditionals.push(
            {
                name: "nomeCompletoRespR",
                label: "Nome Completo",
                type: "text" as const,
                required: false
            },
            {
                name: "nomeSocialR",
                label: "Nome Social (se houver)",
                type: "text" as const,
                required: false
            },
            {
                name: "naoSeAplicaNomeSocial",
                label: "Não se aplica",
                type: "checkbox",
                required: false,
                disableField: "nomeSocialR",
                dependent: true,
            },
            {
                name: "dataNascimentoRespR",
                label: "Data de Nascimento",
                type: "date" as const,
                required: false,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA"
            },
            {
                name: "idadeRespR",
                label: "Idade",
                type: "display" as const,
                required: false,
                displayValue: (data: Partial<FormValues>) => data?.idadeRespR || ""
            }
        );

        // SEÇÃO DE DOCUMENTOS (NO PADRÃO DOS BENEFÍCIOS)
        usoUnidadeConditionals.push(
            {
                name: "documentosLabel",
                label: "Documentos (RG, CPF, RNM, CNH)",
                type: "label",
                required: false,
            },
            {
                name: "rg", // MUDADO: nome diferente para o checkbox
                label: "RG",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se tem_rg for true, adiciona os campos de valor
        if (formValues.rg) { // MUDADO: verificar o checkbox correto
            usoUnidadeConditionals.push(
                {
                    name: "numero_rg", // MUDADO: campo de texto mantém o nome original
                    label: "Número do RG",
                    type: "text" as const,
                    required: false,
                    placeholder: "Digite o número do RG"
                }

            );
        }

        usoUnidadeConditionals.push(
            {
                name: "cpf", // MUDADO: nome diferente para o checkbox
                label: "CPF",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se tem_cpf for true, adiciona os campos de valor
        if (formValues.cpf) { // MUDADO: verificar o checkbox correto
            usoUnidadeConditionals.push(
                {
                    name: "numero_cpf", // MUDADO: campo de texto mantém o nome original
                    label: "Número do CPF",
                    type: "text" as const,
                    required: false,
                    placeholder: "Digite o número do CPF"
                },
            );
        }

        usoUnidadeConditionals.push(
            {
                name: "rnm", // MUDADO: nome diferente para o checkbox
                label: "RNM",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se tem_rnm for true, adiciona os campos de valor
        if (formValues.rnm) { // MUDADO: verificar o checkbox correto
            usoUnidadeConditionals.push(
                {
                    name: "numero_rnm", // MUDADO: campo de texto mantém o nome original
                    label: "Número do RNM",
                    type: "text" as const,
                    required: false,
                    placeholder: "Digite o número do RNM"
                },
            );
        }

        usoUnidadeConditionals.push(
            {
                name: "cnh", // MUDADO: nome diferente para o checkbox
                label: "CNH",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se tem_cnh for true, adiciona os campos de valor
        if (formValues.cnh) { // MUDADO: verificar o checkbox correto
            usoUnidadeConditionals.push(
                {
                    name: "numero_cnh", // MUDADO: campo de texto mantém o nome original
                    label: "Número da CNH",
                    type: "text" as const,
                    required: false,
                    placeholder: "Digite o número da CNH"
                }
            );
        }

        // CONTINUAÇÃO DOS CAMPOS EXISTENTES
        usoUnidadeConditionals.push(
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
        );
    }

    if (formValues.temPessoaDeficiencia === "sim") {
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

        // SEÇÃO DE FILIAÇÃO (NO MESMO PADRÃO DOS BENEFÍCIOS)
        deficienciaConditionals.push(
            {
                name: "filiacaoLabel",
                label: "Filiação",
                type: "label",
                required: false,
            },
            {
                name: "filiacao1",
                label: "Nome filiação 1",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao1 for true, adiciona os campos de valor
        if (formValues.filiacao1) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao1",
                    label: "Nome filiação 1",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao1",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao2",
                label: "Nome filiação 2",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao2 for true, adiciona os campos de valor
        if (formValues.filiacao2) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao2",
                    label: "Nome filiação 2",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao2",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao3",
                label: "Nome filiação 3",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao3 for true, adiciona os campos de valor
        if (formValues.filiacao3) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao3",
                    label: "Nome filiação 3",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao3",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao4",
                label: "Nome filiação 4",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao4 for true, adiciona os campos de valor
        if (formValues.filiacao4) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao4",
                    label: "Nome filiação 4",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao4",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao5",
                label: "Nome filiação 5",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao5 for true, adiciona os campos de valor
        if (formValues.filiacao5) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao5",
                    label: "Nome filiação 5",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao5",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao6",
                label: "Nome filiação 6",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao6 for true, adiciona os campos de valor
        if (formValues.filiacao6) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao6",
                    label: "Nome filiação 6",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao6",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao7",
                label: "Nome filiação 7",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao7 for true, adiciona os campos de valor
        if (formValues.filiacao7) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao7",
                    label: "Nome filiação 7",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao7",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao8",
                label: "Nome filiação 8",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao8 for true, adiciona os campos de valor
        if (formValues.filiacao8) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao8",
                    label: "Nome filiação 8",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao8",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao9",
                label: "Nome filiação 9",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao9 for true, adiciona os campos de valor
        if (formValues.filiacao9) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao9",
                    label: "Nome filiação 9",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao9",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
        }

        deficienciaConditionals.push(
            {
                name: "filiacao10",
                label: "Nome filiação 10",
                type: "checkbox" as const,
                required: false,
            }
        );

        // Se filiacao10 for true, adiciona os campos de valor
        if (formValues.filiacao10) {
            deficienciaConditionals.push(
                {
                    name: "nomeFiliacao10",
                    label: "Nome filiação 10",
                    type: "text" as const,
                    required: false,
                },
                {
                    name: "naoAplicaFiliacao10",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                }
            );
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
                placeholder: "Digite o Nome da instituição de ensino"
            },
        );
    }

    if (
        (formValues.modalidadeEnsino === "Presencial" ||
            formValues.modalidadeEnsino === "Hibrido" ||
            formValues.modalidadeEnsino === "Outros") &&
        formValues.frequetaEscola === "sim"
    ) {
        educacaoConditionals.push(
            {
                name: "cep_r",
                label: "Cep",
                type: "text",
                mask: "9999-999",
                placeholder: "0000-000",
                required: false,
            },
            {
                name: "naoAplicaCep_r",
                label: "Não aplica Cep",
                type: "checkbox",
                disableField: "cep_r",
                required: false,
            },
            {
                name: "logradouro_r",
                label: "Logradouro",
                type: "text",
                required: false,
            },
            {
                name: "numero_r",
                label: "Número",
                type: "numberSpinner",
                step: 1,
                required: false,
            },
            {
                name: "bairro_r",
                label: "Bairro",
                type: "text",
                required: false,
            },
            {
                name: "complemento_r",
                label: "Complemento",
                type: "text",
                required: false,
            },
            {
                name: "uf_r",
                label: "Uf",
                type: "combobox",
                options: [],
                required: true,
            },
            {
                name: "cidade_r",
                label: "Cidade",
                type: "combobox",
                options: [],
                required: true,
            },
            {
                name: "subPrefeitura_r",
                label: "Subprefeitura",
                type: "combobox",
                options: subPrefeituraOptions,
                required: false,
                conditions: [
                    { field: "uf_r", operator: "equals", value: "SP" },
                    { field: "cidade_r", operator: "equals", value: "São Paulo" },
                ],
            },
            {
                name: "distrito_r",
                label: "Distrito",
                type: "combobox",
                options: distritoOptions(selectedSub),
                required: false,
                conditions: [
                    { field: "uf_r", operator: "equals", value: "SP" },
                    { field: "cidade_r", operator: "equals", value: "São Paulo" },
                ],
            },
            {
                name: "localizacaoInstituicaoEnsino",
                label: "Localização da Instituição de Ensino",
                type: "radio",
                required: false,
                options: [
                    { label: "Na área", value: "Na area" },
                    { label: "Em outro lugar", value: " Em outro lugar" },
                ],
            }
        );
    } else if (formValues.modalidadeEnsino === "EAD" && formValues.frequetaEscola === "sim") {
        educacaoConditionals.push(
            {
                name: "localizacaoInstituicaoEnsino",
                label: "Localização da Instituição de Ensino",
                type: "radio" as const,
                required: false,
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
                type: "label",
                required: false,
            },
            {
                name: "Domingo",
                label: "Domingo",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "Segunda",
                label: "Segunda",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "Terca",
                label: "Terça",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "Quarta",
                label: "Quarta",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "Quinta",
                label: "Quinta",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "Sexta",
                label: "Sexta",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "Sabado",
                label: "Sábado",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "quaisConducoes",
                label: "Quais conduções você utiliza para chegar até a instituição de ensino?",
                type: "label",
                required: false,
            },
            {
                name: "onibus",
                label: "Ônibus",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "metro",
                label: "Metrô",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trem",
                label: "Trem",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "onibusEscolar",
                label: "Ônibus Escolar",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "carroParticular",
                label: "Carro particular",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "conducaoOutros",
                label: "Outros",
                type: "checkbox" as const,
                required: false
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
                ],
            },
            {
                name: "localizacaoTrabalho",
                label: "Localização da atividade remunerada principal ",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Na área", value: "Na area" },
                    { label: "Em outro lugar", value: "Em outro lugar" },
                ],
            },
            {
                name: "nomeAtividadeRemunerada",
                label: "Nome da atividade remunerada",
                type: "text" as const,
                required: false,
            },
            {
                name: "cep_t",
                label: "Cep",
                type: "text",
                mask: "9999-999",
                placeholder: "0000-000",
                required: false,
            },
            {
                name: "naoAplicaCep_t",
                label: "Não aplica Cep",
                type: "checkbox",
                disableField: "cep_t",
                required: false,
            },
            {
                name: "logradouro_t",
                label: "Logradouro",
                type: "text",
                required: false,
            },
            {
                name: "numero_t",
                label: "Número",
                type: "numberSpinner",
                step: 1,
                required: false,
            },
            {
                name: "bairro_t",
                label: "Bairro",
                type: "text",
                required: false,
            },
            {
                name: "complemento_t",
                label: "Complemento",
                type: "text",
                required: false,
            },
            {
                name: "uf_t",
                label: "Uf",
                type: "combobox",
                options: [],
                required: true,
            },
            {
                name: "cidade_t",
                label: "Cidade",
                type: "combobox",
                options: [],
                required: true,
            },
            {
                name: "subPrefeitura_t",
                label: "Subprefeitura",
                type: "combobox",
                options: subPrefeituraOptions,
                required: false,
                conditions: [
                    { field: "uf_t", operator: "equals", value: "SP" },
                    { field: "cidade_t", operator: "equals", value: "São Paulo" },
                ],
            },
            {
                name: "distrito_t",
                label: "Distrito",
                type: "combobox",
                options: distritoOptions(selectedSub),
                required: false,
                conditions: [
                    { field: "uf_t", operator: "equals", value: "SP" },
                    { field: "cidade_t", operator: "equals", value: "São Paulo" },
                ],
            },
            {
                name: "diasSemanaTrabalho",
                label: "Quais dias da semana trabalha?",
                type: "label",
                required: false,
            },
            {
                name: "trabalhoDomingo",
                label: "Domingo",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoSegunda",
                label: "Segunda",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoTerca",
                label: "Terça",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoQuarta",
                label: "Quarta",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoQuinta",
                label: "Quinta",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoSexta",
                label: "Sexta",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoSabado",
                label: "Sábado",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "quaisConducoesTrabalho",
                label: "Quais conduções você utiliza para chegar até o trabalho?",
                type: "label",
                required: false,
            },
            {
                name: "trabalhoOnibus",
                label: "Ônibus",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoMetro",
                label: "Metrô",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoTrem",
                label: "Trem",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoOnibusEscolar",
                label: "Ônibus Escolar",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoCarroParticular",
                label: "Carro particular",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "trabalhoConducaoOutros",
                label: "Outros",
                type: "checkbox" as const,
                required: false
            },
            {
                name: "quantHorasTrabalho",
                label: "Horário de saída da unidade",
                type: "time" as const,
                required: false,
            },
            {
                name: "tempoAndandoConducao",
                label: "Tempo andando ate a condução",
                type: "time" as const,
                required: false,
            },
            {
                name: "tempoConducaoDestino",
                label: "Tempo andando da condução até o destino",
                type: "time" as const,
                required: false,
            },
            {
                name: "tempoTotalTrabalho",
                label: "Tempo total do percurso",
                type: "text" as const,
                required: false,
            },
        );
    }

    return {
        usoUnidadeConditionals,
        identRespConditionals,
        documentosConditionals,
        deficienciaConditionals,
        educacaoConditionals,
        atividadeRemuneradaConditionals,
        rendaResponsavelConditionals
    };
}

// Retorna todas as seções do formulário com campos condicionais na posição correta
export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {
        const baseFields = [...identRespDefinition.sections[0].fields];
        const {
            usoUnidadeConditionals,
            identRespConditionals,
            documentosConditionals,
            deficienciaConditionals,
            educacaoConditionals,
            atividadeRemuneradaConditionals,
            rendaResponsavelConditionals
        } = getConditionalFields(formValues);

        let fields = [...baseFields];
        fields = insertAfter(fields, "situacaoUsoUnidade", identRespConditionals);
        fields = insertAfter(fields, "usoUnidade", usoUnidadeConditionals);
        fields = insertAfter(fields, "documentosSelecionados", documentosConditionals);
        fields = insertAfter(fields, "temPessoaDeficiencia", deficienciaConditionals);
        fields = insertAfter(fields, "frequetaEscola", educacaoConditionals);
        fields = insertAfter(fields, "atividadeRemunerada", atividadeRemuneradaConditionals);

        // ✅ INSERIR BLOCO DE RENDA DO RESPONSÁVEL APÓS O CAMPO DE IDADE
        fields = insertAfter(fields, "tempoTotalTrabalho", rendaResponsavelConditionals);

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