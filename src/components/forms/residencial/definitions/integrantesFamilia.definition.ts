import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const integrantesFamiliaSchema = z.object({
    // Campo principal
    possuiIntegrantes: z.string().optional(),

    // Campos para integrante 1 (sempre visível se tiver integrantes)
    nomeIntegrante1: z.string().optional(),
    nomeSocialIntegrante1: z.string().optional(),
    dataNascimentoIntegrante1: z.string().optional(),
    idadeIntegrante1: z.string().optional(),
    relacaoResponsavel1: z.string().optional(),
    outraRelacaoResponsavel1: z.string().optional(),
    responsavelUnidade1: z.string().optional(),

    // Documentos integrante 1
    rgI1: z.boolean().optional(),
    numeroRGI1: z.string().optional(),
    cpfI1: z.boolean().optional(),
    numeroCPFI1: z.string().optional(),
    cnhI1: z.boolean().optional(),
    numeroCNHI1: z.string().optional(),
    rnmI1: z.boolean().optional(),
    numeroRNMI1: z.string().optional(),

    // Informações pessoais integrante 1
    filiacao1_nome1: z.string().optional(),
    filiacao1_naoSeAplica1: z.boolean().optional(),
    filiacao2_nome1: z.string().optional(),
    filiacao2_naoSeAplica1: z.boolean().optional(),
    pessoaDeficiencia1: z.string().optional(),
    pessoaInterditada1: z.string().optional(),
    nomeCuradorTutora1: z.string().optional(),
    tipoInterdicao1: z.string().optional(),
    estadoCivil1: z.string().optional(),
    regimeCasamento1: z.string().optional(),
    escolaridade1: z.string().optional(),
    frequentaEscola1: z.string().optional(),
    modalidadeEnsino1: z.string().optional(),
    nomeInstituicaoEnsino1: z.string().optional(),
    pontoPartida1: z.string().optional(),

    // Dias da semana escola
    domingo1: z.boolean().optional(),
    segunda1: z.boolean().optional(),
    terca1: z.boolean().optional(),
    quarta1: z.boolean().optional(),
    quinta1: z.boolean().optional(),
    sexta1: z.boolean().optional(),
    sabado1: z.boolean().optional(),

    // Conduções escola
    onibus1: z.boolean().optional(),
    metro1: z.boolean().optional(),
    trem1: z.boolean().optional(),
    onibusEscolar1: z.boolean().optional(),
    outros1: z.boolean().optional(),

    // Tempos escola
    quantHoras1: z.string().optional(),
    tempoTotal1: z.string().optional(),
    tempoAndando1: z.string().optional(),

    // Endereço instituição
    cepI1: z.string().optional(),
    naoAplicaI1: z.boolean().optional(),
    logradouroI1: z.string().optional(),
    numeroI1: z.string().optional(),
    bairroI1: z.string().optional(),
    complementoI1: z.string().optional(),
    ufI1: z.string().optional(),
    cidadeI1: z.string().optional(),
    subPrefeituraI1: z.string().optional(),
    distritoI1: z.string().optional(),
    localizacaoInstituicaoEnsino1: z.string().optional(),

    // Trabalho integrante 1
    atividadeRemunerada1: z.string().optional(),
    modalidadeTrabalho1: z.string().optional(),
    localizacaoTrabalho1: z.string().optional(),
    nomeAtividadeRemunerada1: z.string().optional(),

    // Endereço trabalho
    cepTrabalho1: z.string().optional(),
    naoAplicaTrabalho1: z.boolean().optional(),
    logradouroTrabalho1: z.string().optional(),
    numeroTrabalho1: z.string().optional(),
    bairroTrabalho1: z.string().optional(),
    complementoTrabalho1: z.string().optional(),
    ufTrabalho1: z.string().optional(),
    cidadeTrabalho1: z.string().optional(),
    subPrefeituraTrabalho1: z.string().optional(),
    distritoTrabalho1: z.string().optional(),

    // Dias trabalho
    diasSemanaTrabalho1: z.string().optional(),

    // Conduções trabalho
    onibusTrabalho1: z.boolean().optional(),
    metroTrabalho1: z.boolean().optional(),
    tremTrabalho1: z.boolean().optional(),
    onibusEscolarTrabalho1: z.boolean().optional(),
    outrosTrabalho1: z.boolean().optional(),

    // Tempos trabalho
    quantHorasTrabalho1: z.string().optional(),
    tempoAndandoConducao1: z.string().optional(),
    tempoConducaoDestino1: z.string().optional(),
    tempoTotalTrabalho1: z.string().optional(),

    // Documentação complementar
    anexoComprovanteRenda1: z.any().optional(),
    anexoCarteiraTrabalho1: z.any().optional(),
    anexoArea1: z.any().optional(),

    // Contatos
    telefoneCelularIntegrante1: z.string().optional(),
    emailIntegrante1: z.string().optional(),

    // INTEGRANTE 2
    ativarIntegrante2: z.boolean().optional(),
    nomeIntegrante2: z.string().optional(),
    nomeSocialIntegrante2: z.string().optional(),
    dataNascimentoIntegrante2: z.string().optional(),
    idadeIntegrante2: z.string().optional(),
    relacaoResponsavel2: z.string().optional(),
    outraRelacaoResponsavel2: z.string().optional(),
    responsavelUnidade2: z.string().optional(),

    // Documentos integrante 2
    rgI2: z.boolean().optional(),
    numeroRGI2: z.string().optional(),
    cpfI2: z.boolean().optional(),
    numeroCPFI2: z.string().optional(),
    cnhI2: z.boolean().optional(),
    numeroCNHI2: z.string().optional(),
    rnmI2: z.boolean().optional(),
    numeroRNMI2: z.string().optional(),

    // Informações pessoais integrante 2
    filiacao1_nome2: z.string().optional(),
    filiacao1_naoSeAplica2: z.boolean().optional(),
    filiacao2_nome2: z.string().optional(),
    filiacao2_naoSeAplica2: z.boolean().optional(),
    pessoaDeficiencia2: z.string().optional(),
    pessoaInterditada2: z.string().optional(),
    nomeCuradorTutora2: z.string().optional(),
    tipoInterdicao2: z.string().optional(),
    estadoCivil2: z.string().optional(),
    regimeCasamento2: z.string().optional(),
    escolaridade2: z.string().optional(),
    frequentaEscola2: z.string().optional(),
    modalidadeEnsino2: z.string().optional(),
    nomeInstituicaoEnsino2: z.string().optional(),
    pontoPartida2: z.string().optional(),

    // Dias da semana escola 2
    domingo2: z.boolean().optional(),
    segunda2: z.boolean().optional(),
    terca2: z.boolean().optional(),
    quarta2: z.boolean().optional(),
    quinta2: z.boolean().optional(),
    sexta2: z.boolean().optional(),
    sabado2: z.boolean().optional(),

    // Conduções escola 2
    onibus2: z.boolean().optional(),
    metro2: z.boolean().optional(),
    trem2: z.boolean().optional(),
    onibusEscolar2: z.boolean().optional(),
    outros2: z.boolean().optional(),

    // Tempos escola 2
    quantHoras2: z.string().optional(),
    tempoTotal2: z.string().optional(),
    tempoAndando2: z.string().optional(),

    // Endereço instituição 2
    cepI2: z.string().optional(),
    naoAplicaI2: z.boolean().optional(),
    logradouroI2: z.string().optional(),
    numeroI2: z.string().optional(),
    bairroI2: z.string().optional(),
    complementoI2: z.string().optional(),
    ufI2: z.string().optional(),
    cidadeI2: z.string().optional(),
    subPrefeituraI2: z.string().optional(),
    distritoI2: z.string().optional(),
    localizacaoInstituicaoEnsino2: z.string().optional(),

    // Trabalho integrante 2
    atividadeRemunerada2: z.string().optional(),
    modalidadeTrabalho2: z.string().optional(),
    localizacaoTrabalho2: z.string().optional(),
    nomeAtividadeRemunerada2: z.string().optional(),

    // Endereço trabalho 2
    cepTrabalho2: z.string().optional(),
    naoAplicaTrabalho2: z.boolean().optional(),
    logradouroTrabalho2: z.string().optional(),
    numeroTrabalho2: z.string().optional(),
    bairroTrabalho2: z.string().optional(),
    complementoTrabalho2: z.string().optional(),
    ufTrabalho2: z.string().optional(),
    cidadeTrabalho2: z.string().optional(),
    subPrefeituraTrabalho2: z.string().optional(),
    distritoTrabalho2: z.string().optional(),

    // Dias trabalho 2
    diasSemanaTrabalho2: z.string().optional(),

    // Conduções trabalho 2
    onibusTrabalho2: z.boolean().optional(),
    metroTrabalho2: z.boolean().optional(),
    tremTrabalho2: z.boolean().optional(),
    onibusEscolarTrabalho2: z.boolean().optional(),
    outrosTrabalho2: z.boolean().optional(),

    // Tempos trabalho 2
    quantHorasTrabalho2: z.string().optional(),
    tempoAndandoConducao2: z.string().optional(),
    tempoConducaoDestino2: z.string().optional(),
    tempoTotalTrabalho2: z.string().optional(),

    // Documentação complementar 2
    anexoComprovanteRenda2: z.any().optional(),
    anexoCarteiraTrabalho2: z.any().optional(),
    anexoArea2: z.any().optional(),

    // Contatos 2
    telefoneCelularIntegrante2: z.string().optional(),
    emailIntegrante2: z.string().optional(),

    // INTEGRANTE 3
    ativarIntegrante3: z.boolean().optional(),
    nomeIntegrante3: z.string().optional(),
    nomeSocialIntegrante3: z.string().optional(),
    dataNascimentoIntegrante3: z.string().optional(),
    idadeIntegrante3: z.string().optional(),
    relacaoResponsavel3: z.string().optional(),
    outraRelacaoResponsavel3: z.string().optional(),
    responsavelUnidade3: z.string().optional(),

    // Documentos integrante 3
    rgI3: z.boolean().optional(),
    numeroRGI3: z.string().optional(),
    cpfI3: z.boolean().optional(),
    numeroCPFI3: z.string().optional(),
    cnhI3: z.boolean().optional(),
    numeroCNHI3: z.string().optional(),
    rnmI3: z.boolean().optional(),
    numeroRNMI3: z.string().optional(),

    // Informações pessoais integrante 3
    filiacao1_nome3: z.string().optional(),
    filiacao1_naoSeAplica3: z.boolean().optional(),
    filiacao2_nome3: z.string().optional(),
    filiacao2_naoSeAplica3: z.boolean().optional(),
    pessoaDeficiencia3: z.string().optional(),
    pessoaInterditada3: z.string().optional(),
    nomeCuradorTutora3: z.string().optional(),
    tipoInterdicao3: z.string().optional(),
    estadoCivil3: z.string().optional(),
    regimeCasamento3: z.string().optional(),
    escolaridade3: z.string().optional(),
    frequentaEscola3: z.string().optional(),
    modalidadeEnsino3: z.string().optional(),
    nomeInstituicaoEnsino3: z.string().optional(),
    pontoPartida3: z.string().optional(),

    // Dias da semana escola 3
    domingo3: z.boolean().optional(),
    segunda3: z.boolean().optional(),
    terca3: z.boolean().optional(),
    quarta3: z.boolean().optional(),
    quinta3: z.boolean().optional(),
    sexta3: z.boolean().optional(),
    sabado3: z.boolean().optional(),

    // Conduções escola 3
    onibus3: z.boolean().optional(),
    metro3: z.boolean().optional(),
    trem3: z.boolean().optional(),
    onibusEscolar3: z.boolean().optional(),
    outros3: z.boolean().optional(),

    // Tempos escola 3
    quantHoras3: z.string().optional(),
    tempoTotal3: z.string().optional(),
    tempoAndando3: z.string().optional(),

    // Endereço instituição 3
    cepI3: z.string().optional(),
    naoAplicaI3: z.boolean().optional(),
    logradouroI3: z.string().optional(),
    numeroI3: z.string().optional(),
    bairroI3: z.string().optional(),
    complementoI3: z.string().optional(),
    ufI3: z.string().optional(),
    cidadeI3: z.string().optional(),
    subPrefeituraI3: z.string().optional(),
    distritoI3: z.string().optional(),
    localizacaoInstituicaoEnsino3: z.string().optional(),

    // Trabalho integrante 3
    atividadeRemunerada3: z.string().optional(),
    modalidadeTrabalho3: z.string().optional(),
    localizacaoTrabalho3: z.string().optional(),
    nomeAtividadeRemunerada3: z.string().optional(),

    // Endereço trabalho 3
    cepTrabalho3: z.string().optional(),
    naoAplicaTrabalho3: z.boolean().optional(),
    logradouroTrabalho3: z.string().optional(),
    numeroTrabalho3: z.string().optional(),
    bairroTrabalho3: z.string().optional(),
    complementoTrabalho3: z.string().optional(),
    ufTrabalho3: z.string().optional(),
    cidadeTrabalho3: z.string().optional(),
    subPrefeituraTrabalho3: z.string().optional(),
    distritoTrabalho3: z.string().optional(),

    // Dias trabalho 3
    diasSemanaTrabalho3: z.string().optional(),

    // Conduções trabalho 3
    onibusTrabalho3: z.boolean().optional(),
    metroTrabalho3: z.boolean().optional(),
    tremTrabalho3: z.boolean().optional(),
    onibusEscolarTrabalho3: z.boolean().optional(),
    outrosTrabalho3: z.boolean().optional(),

    // Tempos trabalho 3
    quantHorasTrabalho3: z.string().optional(),
    tempoAndandoConducao3: z.string().optional(),
    tempoConducaoDestino3: z.string().optional(),
    tempoTotalTrabalho3: z.string().optional(),

    // Documentação complementar 3
    anexoComprovanteRenda3: z.any().optional(),
    anexoCarteiraTrabalho3: z.any().optional(),
    anexoArea3: z.any().optional(),

    // Contatos 3
    telefoneCelularIntegrante3: z.string().optional(),
    emailIntegrante3: z.string().optional(),

    recebeBeneficio1: z.string().optional(),
    origemRenda1: z.array(z.string()).optional(),

    valorRendaAposentadoria1: z.string().optional(),
    valorRendaPensaoPorMorte1: z.string().optional(),
    valorRendaPensaoAlimenticia1: z.string().optional(),
    valorRendaAuxilioDoenca1: z.string().optional(),
    valorRendaAuxilioReclusao1: z.string().optional(),
    valorRendaAuxilioAcidente1: z.string().optional(),
    valorRendaSalarioFamilia1: z.string().optional(),
    valorRendaSalarioMaternidade1: z.string().optional(),
    valorRendaAluguel1: z.string().optional(),
    valorRendaOutros1: z.string().optional(),

    naoInformadoRendaAposentadoria1: z.boolean().optional(),
    naoInformadoRendaPensaoPorMorte1: z.boolean().optional(),
    naoInformadoRendaPensaoAlimenticia1: z.boolean().optional(),
    naoInformadoRendaAuxilioDoenca1: z.boolean().optional(),
    naoInformadoRendaAuxilioReclusao1: z.boolean().optional(),
    naoInformadoRendaAuxilioAcidente1: z.boolean().optional(),
    naoInformadoRendaSalarioFamilia1: z.boolean().optional(),
    naoInformadoRendaSalarioMaternidade1: z.boolean().optional(),
    naoInformadoRendaAluguel1: z.boolean().optional(),
    naoInformadoRendaOutros1: z.boolean().optional(),

    especificarOutros1: z.string().optional(),

    beneficiosRecebidos1: z.array(z.string()).optional(),
    valorRendaBolsaF1: z.string().optional(),
    naoAplicaValorRendaBolsaF1: z.boolean().optional(),
    valorRendaAuxilioE1: z.string().optional(),
    naoAplicaValorRendaAuxilioE1: z.boolean().optional(),
    valorRendaBPC_PessoaI1: z.string().optional(),
    naoAplicaValorBPC_PessoaI1: z.boolean().optional(),
    valorRendaBPC_PessoaD1: z.string().optional(),
    naoAplicaValorBPC_PessoaD1: z.boolean().optional(),
    valorRendaAuxilioInclusao1: z.string().optional(),
    naoAplicaValorAuxilioInclusao1: z.boolean().optional(),
    valorRendaCidada1: z.string().optional(),
    naoAplicaValorRendaCidada1: z.boolean().optional(),
    valorRendaMinima1: z.string().optional(),
    naoAplicaValorRendaMinima1: z.boolean().optional(),
    valorRendaAcaoJovem1: z.string().optional(),
    naoAplicaValorAcaoJovem1: z.boolean().optional(),

    // Integrante 2
    recebeBeneficio2: z.string().optional(),
    origemRenda2: z.array(z.string()).optional(),

    valorRendaAposentadoria2: z.string().optional(),
    valorRendaPensaoPorMorte2: z.string().optional(),
    valorRendaPensaoAlimenticia2: z.string().optional(),
    valorRendaAuxilioDoenca2: z.string().optional(),
    valorRendaAuxilioReclusao2: z.string().optional(),
    valorRendaAuxilioAcidente2: z.string().optional(),
    valorRendaSalarioFamilia2: z.string().optional(),
    valorRendaSalarioMaternidade2: z.string().optional(),
    valorRendaAluguel2: z.string().optional(),
    valorRendaOutros2: z.string().optional(),

    naoInformadoRendaAposentadoria2: z.boolean().optional(),
    naoInformadoRendaPensaoPorMorte2: z.boolean().optional(),
    naoInformadoRendaPensaoAlimenticia2: z.boolean().optional(),
    naoInformadoRendaAuxilioDoenca2: z.boolean().optional(),
    naoInformadoRendaAuxilioReclusao2: z.boolean().optional(),
    naoInformadoRendaAuxilioAcidente2: z.boolean().optional(),
    naoInformadoRendaSalarioFamilia2: z.boolean().optional(),
    naoInformadoRendaSalarioMaternidade2: z.boolean().optional(),
    naoInformadoRendaAluguel2: z.boolean().optional(),
    naoInformadoRendaOutros2: z.boolean().optional(),

    especificarOutros2: z.string().optional(),

    beneficiosRecebidos2: z.array(z.string()).optional(),
    valorRendaBolsaF2: z.string().optional(),
    naoAplicaValorRendaBolsaF2: z.boolean().optional(),
    valorRendaAuxilioE2: z.string().optional(),
    naoAplicaValorRendaAuxilioE2: z.boolean().optional(),
    valorRendaBPC_PessoaI2: z.string().optional(),
    naoAplicaValorBPC_PessoaI2: z.boolean().optional(),
    valorRendaBPC_PessoaD2: z.string().optional(),
    naoAplicaValorBPC_PessoaD2: z.boolean().optional(),
    valorRendaAuxilioInclusao2: z.string().optional(),
    naoAplicaValorAuxilioInclusao2: z.boolean().optional(),
    valorRendaCidada2: z.string().optional(),
    naoAplicaValorRendaCidada2: z.boolean().optional(),
    valorRendaMinima2: z.string().optional(),
    naoAplicaValorRendaMinima2: z.boolean().optional(),
    valorRendaAcaoJovem2: z.string().optional(),
    naoAplicaValorAcaoJovem2: z.boolean().optional(),

    // Integrante 3
    recebeBeneficio3: z.string().optional(),
    origemRenda3: z.array(z.string()).optional(),

    valorRendaAposentadoria3: z.string().optional(),
    valorRendaPensaoPorMorte3: z.string().optional(),
    valorRendaPensaoAlimenticia3: z.string().optional(),
    valorRendaAuxilioDoenca3: z.string().optional(),
    valorRendaAuxilioReclusao3: z.string().optional(),
    valorRendaAuxilioAcidente3: z.string().optional(),
    valorRendaSalarioFamilia3: z.string().optional(),
    valorRendaSalarioMaternidade3: z.string().optional(),
    valorRendaAluguel3: z.string().optional(),
    valorRendaOutros3: z.string().optional(),

    naoInformadoRendaAposentadoria3: z.boolean().optional(),
    naoInformadoRendaPensaoPorMorte3: z.boolean().optional(),
    naoInformadoRendaPensaoAlimenticia3: z.boolean().optional(),
    naoInformadoRendaAuxilioDoenca3: z.boolean().optional(),
    naoInformadoRendaAuxilioReclusao3: z.boolean().optional(),
    naoInformadoRendaAuxilioAcidente3: z.boolean().optional(),
    naoInformadoRendaSalarioFamilia3: z.boolean().optional(),
    naoInformadoRendaSalarioMaternidade3: z.boolean().optional(),
    naoInformadoRendaAluguel3: z.boolean().optional(),
    naoInformadoRendaOutros3: z.boolean().optional(),

    especificarOutros3: z.string().optional(),

    beneficiosRecebidos3: z.array(z.string()).optional(),
    valorRendaBolsaF3: z.string().optional(),
    naoAplicaValorRendaBolsaF3: z.boolean().optional(),
    valorRendaAuxilioE3: z.string().optional(),
    naoAplicaValorRendaAuxilioE3: z.boolean().optional(),
    valorRendaBPC_PessoaI3: z.string().optional(),
    naoAplicaValorBPC_PessoaI3: z.boolean().optional(),
    valorRendaBPC_PessoaD3: z.string().optional(),
    naoAplicaValorBPC_PessoaD3: z.boolean().optional(),
    valorRendaAuxilioInclusao3: z.string().optional(),
    naoAplicaValorAuxilioInclusao3: z.boolean().optional(),
    valorRendaCidada3: z.string().optional(),
    naoAplicaValorRendaCidada3: z.boolean().optional(),
    valorRendaMinima3: z.string().optional(),
    naoAplicaValorRendaMinima3: z.boolean().optional(),
    valorRendaAcaoJovem3: z.string().optional(),
    naoAplicaValorAcaoJovem3: z.boolean().optional(),

    idLocal: z.string().optional(),
    selagem_id: z.string().optional(),
});

export type FormValues = z.infer<typeof integrantesFamiliaSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    possuiIntegrantes: "",

    // Integrante 1
    nomeIntegrante1: "",
    nomeSocialIntegrante1: "",
    dataNascimentoIntegrante1: "",
    idadeIntegrante1: "",
    relacaoResponsavel1: "select",
    outraRelacaoResponsavel1: "",
    responsavelUnidade1: "",
    rgI1: false,
    numeroRGI1: "",
    cpfI1: false,
    numeroCPFI1: "",
    cnhI1: false,
    numeroCNHI1: "",
    rnmI1: false,
    numeroRNMI1: "",

    // Informações pessoais
    filiacao1_nome1: "",
    filiacao1_naoSeAplica1: false,
    filiacao2_nome1: "",
    filiacao2_naoSeAplica1: false,
    pessoaDeficiencia1: "",
    pessoaInterditada1: "",
    nomeCuradorTutora1: "",
    tipoInterdicao1: "",
    estadoCivil1: "",
    regimeCasamento1: "",
    escolaridade1: "",
    frequentaEscola1: "",
    modalidadeEnsino1: "",
    nomeInstituicaoEnsino1: "",
    pontoPartida1: "",

    // Dias semana
    domingo1: false,
    segunda1: false,
    terca1: false,
    quarta1: false,
    quinta1: false,
    sexta1: false,
    sabado1: false,

    // Conduções
    onibus1: false,
    metro1: false,
    trem1: false,
    onibusEscolar1: false,
    outros1: false,

    // Tempos
    quantHoras1: "",
    tempoTotal1: "",
    tempoAndando1: "",

    // Endereço
    cepI1: "",
    naoAplicaI1: false,
    logradouroI1: "",
    numeroI1: "",
    bairroI1: "",
    complementoI1: "",
    ufI1: "",
    cidadeI1: "",
    subPrefeituraI1: "",
    distritoI1: "",
    localizacaoInstituicaoEnsino1: "",

    // Trabalho
    atividadeRemunerada1: "",
    modalidadeTrabalho1: "",
    localizacaoTrabalho1: "",
    nomeAtividadeRemunerada1: "",
    cepTrabalho1: "",
    naoAplicaTrabalho1: false,
    logradouroTrabalho1: "",
    numeroTrabalho1: "",
    bairroTrabalho1: "",
    complementoTrabalho1: "",
    ufTrabalho1: "",
    cidadeTrabalho1: "",
    subPrefeituraTrabalho1: "",
    distritoTrabalho1: "",
    diasSemanaTrabalho1: "",
    onibusTrabalho1: false,
    metroTrabalho1: false,
    tremTrabalho1: false,
    onibusEscolarTrabalho1: false,
    outrosTrabalho1: false,
    quantHorasTrabalho1: "",
    tempoAndandoConducao1: "",
    tempoConducaoDestino1: "",
    tempoTotalTrabalho1: "",

    // Documentação
    anexoComprovanteRenda1: null,
    anexoCarteiraTrabalho1: null,
    anexoArea1: null,

    // Contatos
    telefoneCelularIntegrante1: "",
    emailIntegrante1: "",

    // Integrante 2
    ativarIntegrante2: false,
    nomeIntegrante2: "",
    nomeSocialIntegrante2: "",
    dataNascimentoIntegrante2: "",
    idadeIntegrante2: "",
    relacaoResponsavel2: "select",
    outraRelacaoResponsavel2: "",
    responsavelUnidade2: "",
    rgI2: false,
    numeroRGI2: "",
    cpfI2: false,
    numeroCPFI2: "",
    cnhI2: false,
    numeroCNHI2: "",
    rnmI2: false,
    numeroRNMI2: "",

    // Informações pessoais integrante 2
    filiacao1_nome2: "",
    filiacao1_naoSeAplica2: false,
    filiacao2_nome2: "",
    filiacao2_naoSeAplica2: false,
    pessoaDeficiencia2: "",
    pessoaInterditada2: "",
    nomeCuradorTutora2: "",
    tipoInterdicao2: "",
    estadoCivil2: "",
    regimeCasamento2: "",
    escolaridade2: "",
    frequentaEscola2: "",
    modalidadeEnsino2: "",
    nomeInstituicaoEnsino2: "",
    pontoPartida2: "",

    // Dias semana 2
    domingo2: false,
    segunda2: false,
    terca2: false,
    quarta2: false,
    quinta2: false,
    sexta2: false,
    sabado2: false,

    // Conduções 2
    onibus2: false,
    metro2: false,
    trem2: false,
    onibusEscolar2: false,
    outros2: false,

    // Tempos 2
    quantHoras2: "",
    tempoTotal2: "",
    tempoAndando2: "",

    // Endereço 2
    cepI2: "",
    naoAplicaI2: false,
    logradouroI2: "",
    numeroI2: "",
    bairroI2: "",
    complementoI2: "",
    ufI2: "",
    cidadeI2: "",
    subPrefeituraI2: "",
    distritoI2: "",
    localizacaoInstituicaoEnsino2: "",

    // Trabalho 2
    atividadeRemunerada2: "",
    modalidadeTrabalho2: "",
    localizacaoTrabalho2: "",
    nomeAtividadeRemunerada2: "",
    cepTrabalho2: "",
    naoAplicaTrabalho2: false,
    logradouroTrabalho2: "",
    numeroTrabalho2: "",
    bairroTrabalho2: "",
    complementoTrabalho2: "",
    ufTrabalho2: "",
    cidadeTrabalho2: "",
    subPrefeituraTrabalho2: "",
    distritoTrabalho2: "",
    diasSemanaTrabalho2: "",
    onibusTrabalho2: false,
    metroTrabalho2: false,
    tremTrabalho2: false,
    onibusEscolarTrabalho2: false,
    outrosTrabalho2: false,
    quantHorasTrabalho2: "",
    tempoAndandoConducao2: "",
    tempoConducaoDestino2: "",
    tempoTotalTrabalho2: "",

    // Documentação 2
    anexoComprovanteRenda2: null,
    anexoCarteiraTrabalho2: null,
    anexoArea2: null,

    // Contatos 2
    telefoneCelularIntegrante2: "",
    emailIntegrante2: "",

    // Integrante 3
    ativarIntegrante3: false,
    nomeIntegrante3: "",
    nomeSocialIntegrante3: "",
    dataNascimentoIntegrante3: "",
    idadeIntegrante3: "",
    relacaoResponsavel3: "select",
    outraRelacaoResponsavel3: "",
    responsavelUnidade3: "",
    rgI3: false,
    numeroRGI3: "",
    cpfI3: false,
    numeroCPFI3: "",
    cnhI3: false,
    numeroCNHI3: "",
    rnmI3: false,
    numeroRNMI3: "",

    // Informações pessoais integrante 3
    filiacao1_nome3: "",
    filiacao1_naoSeAplica3: false,
    filiacao2_nome3: "",
    filiacao2_naoSeAplica3: false,
    pessoaDeficiencia3: "",
    pessoaInterditada3: "",
    nomeCuradorTutora3: "",
    tipoInterdicao3: "",
    estadoCivil3: "",
    regimeCasamento3: "",
    escolaridade3: "",
    frequentaEscola3: "",
    modalidadeEnsino3: "",
    nomeInstituicaoEnsino3: "",
    pontoPartida3: "",

    // Dias semana 3
    domingo3: false,
    segunda3: false,
    terca3: false,
    quarta3: false,
    quinta3: false,
    sexta3: false,
    sabado3: false,

    // Conduções 3
    onibus3: false,
    metro3: false,
    trem3: false,
    onibusEscolar3: false,
    outros3: false,

    // Tempos 3
    quantHoras3: "",
    tempoTotal3: "",
    tempoAndando3: "",

    // Endereço 3
    cepI3: "",
    naoAplicaI3: false,
    logradouroI3: "",
    numeroI3: "",
    bairroI3: "",
    complementoI3: "",
    ufI3: "",
    cidadeI3: "",
    subPrefeituraI3: "",
    distritoI3: "",
    localizacaoInstituicaoEnsino3: "",

    // Trabalho 3
    atividadeRemunerada3: "",
    modalidadeTrabalho3: "",
    localizacaoTrabalho3: "",
    nomeAtividadeRemunerada3: "",
    cepTrabalho3: "",
    naoAplicaTrabalho3: false,
    logradouroTrabalho3: "",
    numeroTrabalho3: "",
    bairroTrabalho3: "",
    complementoTrabalho3: "",
    ufTrabalho3: "",
    cidadeTrabalho3: "",
    subPrefeituraTrabalho3: "",
    distritoTrabalho3: "",
    diasSemanaTrabalho3: "",
    onibusTrabalho3: false,
    metroTrabalho3: false,
    tremTrabalho3: false,
    onibusEscolarTrabalho3: false,
    outrosTrabalho3: false,
    quantHorasTrabalho3: "",
    tempoAndandoConducao3: "",
    tempoConducaoDestino3: "",
    tempoTotalTrabalho3: "",

    // Documentação 3
    anexoComprovanteRenda3: null,
    anexoCarteiraTrabalho3: null,
    anexoArea3: null,

    // Contatos 3
    telefoneCelularIntegrante3: "",
    emailIntegrante3: "",

    // Integrante 1
    recebeBeneficio1: "",
    origemRenda1: [],

    valorRendaAposentadoria1: "",
    valorRendaPensaoPorMorte1: "",
    valorRendaPensaoAlimenticia1: "",
    valorRendaAuxilioDoenca1: "",
    valorRendaAuxilioReclusao1: "",
    valorRendaAuxilioAcidente1: "",
    valorRendaSalarioFamilia1: "",
    valorRendaSalarioMaternidade1: "",
    valorRendaAluguel1: "",
    valorRendaOutros1: "",

    naoInformadoRendaAposentadoria1: false,
    naoInformadoRendaPensaoPorMorte1: false,
    naoInformadoRendaPensaoAlimenticia1: false,
    naoInformadoRendaAuxilioDoenca1: false,
    naoInformadoRendaAuxilioReclusao1: false,
    naoInformadoRendaAuxilioAcidente1: false,
    naoInformadoRendaSalarioFamilia1: false,
    naoInformadoRendaSalarioMaternidade1: false,
    naoInformadoRendaAluguel1: false,
    naoInformadoRendaOutros1: false,

    especificarOutros1: "",

    beneficiosRecebidos1: [],
    valorRendaBolsaF1: "",
    naoAplicaValorRendaBolsaF1: false,
    valorRendaAuxilioE1: "",
    naoAplicaValorRendaAuxilioE1: false,
    valorRendaBPC_PessoaI1: "",
    naoAplicaValorBPC_PessoaI1: false,
    valorRendaBPC_PessoaD1: "",
    naoAplicaValorBPC_PessoaD1: false,
    valorRendaAuxilioInclusao1: "",
    naoAplicaValorAuxilioInclusao1: false,
    valorRendaCidada1: "",
    naoAplicaValorRendaCidada1: false,
    valorRendaMinima1: "",
    naoAplicaValorRendaMinima1: false,
    valorRendaAcaoJovem1: "",
    naoAplicaValorAcaoJovem1: false,

    // Integrante 2
    recebeBeneficio2: "",
    origemRenda2: [],

    valorRendaAposentadoria2: "",
    valorRendaPensaoPorMorte2: "",
    valorRendaPensaoAlimenticia2: "",
    valorRendaAuxilioDoenca2: "",
    valorRendaAuxilioReclusao2: "",
    valorRendaAuxilioAcidente2: "",
    valorRendaSalarioFamilia2: "",
    valorRendaSalarioMaternidade2: "",
    valorRendaAluguel2: "",
    valorRendaOutros2: "",

    naoInformadoRendaAposentadoria2: false,
    naoInformadoRendaPensaoPorMorte2: false,
    naoInformadoRendaPensaoAlimenticia2: false,
    naoInformadoRendaAuxilioDoenca2: false,
    naoInformadoRendaAuxilioReclusao2: false,
    naoInformadoRendaAuxilioAcidente2: false,
    naoInformadoRendaSalarioFamilia2: false,
    naoInformadoRendaSalarioMaternidade2: false,
    naoInformadoRendaAluguel2: false,
    naoInformadoRendaOutros2: false,

    especificarOutros2: "",

    beneficiosRecebidos2: [],
    valorRendaBolsaF2: "",
    naoAplicaValorRendaBolsaF2: false,
    valorRendaAuxilioE2: "",
    naoAplicaValorRendaAuxilioE2: false,
    valorRendaBPC_PessoaI2: "",
    naoAplicaValorBPC_PessoaI2: false,
    valorRendaBPC_PessoaD2: "",
    naoAplicaValorBPC_PessoaD2: false,
    valorRendaAuxilioInclusao2: "",
    naoAplicaValorAuxilioInclusao2: false,
    valorRendaCidada2: "",
    naoAplicaValorRendaCidada2: false,
    valorRendaMinima2: "",
    naoAplicaValorRendaMinima2: false,
    valorRendaAcaoJovem2: "",
    naoAplicaValorAcaoJovem2: false,

    // Integrante 3
    recebeBeneficio3: "",
    origemRenda3: [],

    valorRendaAposentadoria3: "",
    valorRendaPensaoPorMorte3: "",
    valorRendaPensaoAlimenticia3: "",
    valorRendaAuxilioDoenca3: "",
    valorRendaAuxilioReclusao3: "",
    valorRendaAuxilioAcidente3: "",
    valorRendaSalarioFamilia3: "",
    valorRendaSalarioMaternidade3: "",
    valorRendaAluguel3: "",
    valorRendaOutros3: "",

    naoInformadoRendaAposentadoria3: false,
    naoInformadoRendaPensaoPorMorte3: false,
    naoInformadoRendaPensaoAlimenticia3: false,
    naoInformadoRendaAuxilioDoenca3: false,
    naoInformadoRendaAuxilioReclusao3: false,
    naoInformadoRendaAuxilioAcidente3: false,
    naoInformadoRendaSalarioFamilia3: false,
    naoInformadoRendaSalarioMaternidade3: false,
    naoInformadoRendaAluguel3: false,
    naoInformadoRendaOutros3: false,

    especificarOutros3: "",

    beneficiosRecebidos3: [],
    valorRendaBolsaF3: "",
    naoAplicaValorRendaBolsaF3: false,
    valorRendaAuxilioE3: "",
    naoAplicaValorRendaAuxilioE3: false,
    valorRendaBPC_PessoaI3: "",
    naoAplicaValorBPC_PessoaI3: false,
    valorRendaBPC_PessoaD3: "",
    naoAplicaValorBPC_PessoaD3: false,
    valorRendaAuxilioInclusao3: "",
    naoAplicaValorAuxilioInclusao3: false,
    valorRendaCidada3: "",
    naoAplicaValorRendaCidada3: false,
    valorRendaMinima3: "",
    naoAplicaValorRendaMinima3: false,
    valorRendaAcaoJovem3: "",
    naoAplicaValorAcaoJovem3: false,

    idLocal: "not",
};

// Base form structure
export const integrantesFamiliaDefinition: FormConfig = {
    title: "Integrantes da Família",
    sections: [
        {
            id: "integrantesFamilia",
            title: "Integrantes da Família",
            fields: [
                {
                    name: "possuiIntegrantes",
                    label: "Possui Integrantes na Família?",
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

// Função para calcular idade
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

// Opções para selects
const relacaoResponsavelOptions = [
    { label: "Selecione uma opção", value: "select" },
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
];

const responsavelUnidadeOptions = [
    { label: "Sim", value: "sim" },
    { label: "Não", value: "nao" },
];

const estadoCivilOptions = [
    { label: "Solteiro(a)", value: "solteiro" },
    { label: "Casado(a)", value: "casado" },
    { label: "Viúvo(a)", value: "viuvo" },
    { label: "Divorciado(a)", value: "divorciado" },
];

const escolaridadeOptions = [
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
];

const localizacaoOptions = [
    { label: "Na área", value: "na_area" },
    { label: "Em outro lugar", value: "em_outro_lugar" },
];

const modalidadeTrabalhoOptions = [
    { label: "Presencial", value: "presencial" },
    { label: "EAD", value: "ead" },
    { label: "Híbrido", value: "hibrido" },
    { label: "Outros", value: "outros" },
];

const modalidadeEnsinoOptions = [
    { label: "Presencial", value: "Presencial" },
    { label: "EAD", value: "EAD" },
    { label: "Hibrido", value: "Hibrido" },
    { label: "Outros", value: "Outros" },
];

const diasSemanaOptions = [
    { label: "Domingo", value: "Domingo" },
    { label: "Segunda", value: "Segunda" },
    { label: "Terça", value: "Terça" },
    { label: "Quarta", value: "Quarta" },
    { label: "Quinta", value: "Quinta" },
    { label: "Sexta", value: "Sexta" },
    { label: "Sábado", value: "Sábado" },
];

const conducoesOptions = [
    { label: "Ônibus", value: "Onibus" },
    { label: "Metrô", value: "Metro" },
    { label: "Trem", value: "Trem" },
    { label: "Ônibus Escolar", value: "Onibus Escolar" },
    { label: "Carro particular", value: "Carro particular" },
    { label: "Outros", value: "Outros" }
];

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


/**
 * Get additional conditional fields based on form values - VERSÃO COMPLETA COM 3 INTEGRANTES
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];

    // Se possui integrantes, mostra campos do primeiro integrante
    if (formValues.possuiIntegrantes === "sim") {
        // ========== INTEGRANTE 1 ==========
        conditionalFields.push(
            {
                name: "nomeIntegrante1",
                label: "Nome do Integrante",
                type: "text" as const,
                required: true,
                placeholder: "Nome completo"
            },
            {
                name: "nomeSocialIntegrante1",
                label: "Nome social",
                type: "text" as const,
                required: false,
                placeholder: "Nome social (se houver)"
            },
            {
                name: "dataNascimentoIntegrante1",
                label: "Data de nascimento",
                type: "date" as const,
                required: false,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA"
            },
            {
                name: "idadeIntegrante1",
                label: "Idade",
                type: "display" as const,
                required: false,
                displayValue: () => calcularIdade(formValues.dataNascimentoIntegrante1 || "")
            }
        );

        // ✅ BLOCO DE RENDA INTEGRANTE 1 (idade ≥ 14) - CALCULADO A PARTIR DA DATA
        const dataIntegrante1 = formValues.dataNascimentoIntegrante1 || "";

        // Calcular idade a partir da data
        let mostrarRenda1 = false;
        let idadeCalculada1 = 0;

        if (dataIntegrante1) {
            // Converter a data do formato YYYY-MM-DD para calcular idade
            const [ano, mes, dia] = dataIntegrante1.split('-').map(Number);
            const dataNascimento = new Date(ano, mes - 1, dia); // mês é 0-indexed
            const hoje = new Date();

            idadeCalculada1 = hoje.getFullYear() - dataNascimento.getFullYear();

            // Ajustar se ainda não fez aniversário este ano
            const mesAtual = hoje.getMonth();
            const diaAtual = hoje.getDate();

            if (mesAtual < (mes - 1) || (mesAtual === (mes - 1) && diaAtual < dia)) {
                idadeCalculada1--;
            }

            mostrarRenda1 = idadeCalculada1 >= 14;
        }

        console.log('🔍 Data nascimento integrante 1:', dataIntegrante1);
        console.log('🔍 Idade calculada:', idadeCalculada1);
        console.log('🔍 Mostrar renda 1 (idade ≥ 14):', mostrarRenda1);

        if (mostrarRenda1) {
            conditionalFields.push(
                {
                    name: "renda1",
                    label: `Renda do Integrante 1 (idade: ${idadeCalculada1} anos)`,
                    type: "label" as const,
                    required: false,
                },
                {
                    name: "recebeBeneficio1",
                    label: "Recebe benefício?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            );

            if (formValues.recebeBeneficio1 === "sim") {
                conditionalFields.push({
                    name: "beneficiosRecebidos1",
                    label: "Benefícios recebidos",
                    type: "multicombobox",
                    required: false,
                    placeholder: "Escolha os benefícios",
                    options: BENEFICIOS_OPTIONS.map((b) => ({
                        label: b.replace(/_/g, " "),
                        value: b,
                    })),
                });

                const beneficiosRecebidos1 = formValues.beneficiosRecebidos1 || [];

                // Configuração dos benefícios para evitar repetição de código
                const beneficiosConfig = [
                    { key: "Bolsa Familia", label: "Bolsa Família", fieldName: "valorRendaBolsaF1" },
                    { key: "Auxilio Emergencial", label: "Auxílio Emergencial", fieldName: "valorRendaAuxilioE1" },
                    { key: "BPC_Pessoa idosa", label: "BPC Pessoa Idosa", fieldName: "valorRendaBPC_PessoaI1" },
                    { key: "BPC_Pessoa com deficiencia", label: "BPC Pessoa com Deficiência", fieldName: "valorRendaBPC_PessoaD1" },
                    { key: "Auxilio inclusao", label: "Auxílio Inclusão", fieldName: "valorRendaAuxilioInclusao1" },
                    { key: "Renda cidada", label: "Renda Cidadã", fieldName: "valorRendaCidada1" },
                    { key: "Renda minima", label: "Renda Mínima", fieldName: "valorRendaMinima1" },
                    { key: "Acao jovem", label: "Ação Jovem", fieldName: "valorRendaAcaoJovem1" }
                ];

                beneficiosConfig.forEach(({ key, label, fieldName }) => {
                    if (beneficiosRecebidos1.includes(key)) {
                        conditionalFields.push(
                            {
                                name: fieldName,
                                label: `Valor do ${label}`,
                                type: "text",
                                required: true,
                                placeholder: "Digite o valor"
                            },
                            {
                                name: `naoAplica${fieldName}`,
                                label: "Não se aplica",
                                type: "checkbox" as const,
                                required: false,
                            }
                        );
                    }
                });
            }

            conditionalFields.push({
                name: "origemRenda1",
                label: "Indique a origem da renda",
                type: "multicombobox",
                required: false,
                placeholder: "Selecione as origens de renda",
                options: ORIGEM_RENDA_OPTIONS.map((item) => ({
                    label: item,
                    value: item,
                })),
            });

            const origensSelecionadas1 = formValues.origemRenda1 || [];

            // Configuração das origens de renda para evitar repetição de código
            const origensConfig = [
                {
                    key: "Aposentadoria (idade, invalidez ou por tempo de contribuição)",
                    fieldName: "valorRendaAposentadoria1",
                    label: "Aposentadoria"
                },
                {
                    key: "Pensão por morte",
                    fieldName: "valorRendaPensaoPorMorte1",
                    label: "Pensão por morte"
                },
                {
                    key: "Pensão alimentícia",
                    fieldName: "valorRendaPensaoAlimenticia1",
                    label: "Pensão alimentícia"
                },
                {
                    key: "Auxílio doença",
                    fieldName: "valorRendaAuxilioDoenca1",
                    label: "Auxílio doença"
                },
                {
                    key: "Auxílio reclusão",
                    fieldName: "valorRendaAuxilioReclusao1",
                    label: "Auxílio reclusão"
                },
                {
                    key: "Auxílio acidente",
                    fieldName: "valorRendaAuxilioAcidente1",
                    label: "Auxílio acidente"
                },
                {
                    key: "Salário família",
                    fieldName: "valorRendaSalarioFamilia1",
                    label: "Salário família"
                },
                {
                    key: "Salário maternidade",
                    fieldName: "valorRendaSalarioMaternidade1",
                    label: "Salário maternidade"
                },
                {
                    key: "Aluguel",
                    fieldName: "valorRendaAluguel1",
                    label: "Aluguel"
                }
            ];

            origensConfig.forEach(({ key, fieldName, label }) => {
                if (origensSelecionadas1.includes(key)) {
                    conditionalFields.push(
                        {
                            name: fieldName,
                            label: `Valor da ${label}`,
                            type: "text",
                            required: true,
                            placeholder: "Digite o valor"
                        },
                        {
                            name: `naoInformado${fieldName}`,
                            label: "Não informado",
                            type: "checkbox" as const,
                            required: false,
                        }
                    );
                }
            });

            if (origensSelecionadas1.includes("Outros")) {
                conditionalFields.push({
                    name: "especificarOutros1",
                    label: "Especifique as fontes de renda (Outros)",
                    type: "text",
                    required: true,
                    placeholder: "Descreva a fonte de renda"
                });
            }
        }


        // CONTINUAÇÃO DOS CAMPOS DO INTEGRANTE 1
        conditionalFields.push(
            {
                name: "relacaoResponsavel1",
                label: "Parentesco com o responsável",
                type: "select" as const,
                required: false,
                options: relacaoResponsavelOptions
            }
        );

        // REMOVIDO: Campo duplicado de relacaoResponsavel1

        if (formValues.relacaoResponsavel1 === "outro") {
            conditionalFields.push({
                name: "outraRelacaoResponsavel1",
                label: "Descreva a relação de parentesco",
                type: "text" as const,
                required: true,
                placeholder: "Descreva a relação de parentesco"
            });
        }

        conditionalFields.push(
            {
                name: "responsavelUnidade1",
                label: "É responsável pela unidade?",
                type: "radio" as const,
                required: false,
                options: responsavelUnidadeOptions
            },
            {
                name: "doc1",
                label: "Documentos do Integrante",
                type: "label" as const,
                required: false,
            },
            {
                name: "rgI1",
                label: "RG",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.rgI1 === true) {
            conditionalFields.push({
                name: "numeroRGI1",
                label: "Número do RG",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do RG"
            });
        }

        conditionalFields.push(
            {
                name: "cpfI1",
                label: "CPF",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.cpfI1 === true) {
            conditionalFields.push({
                name: "numeroCPFI1",
                label: "Número do CPF",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do CPF"
            });
        }

        conditionalFields.push(
            {
                name: "cnhI1",
                label: "CNH",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.cnhI1 === true) {
            conditionalFields.push({
                name: "numeroCNHI1",
                label: "Número da CNH",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número da CNH"
            });
        }

        conditionalFields.push(
            {
                name: "rnmI1",
                label: "RNM",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.rnmI1 === true) {
            conditionalFields.push({
                name: "numeroRNMI1",
                label: "Número do RNM",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do RNM"
            });
        }

        conditionalFields.push(
            {
                name: "filiacao1",
                label: "Informações de Filiação",
                type: "label" as const,
                required: false,
            },
            {
                name: "filiacao1_nome1",
                label: "Nome da filiação 1",
                type: "text" as const,
                required: false,
                placeholder: "Nome completo da filiação 1",
            },
            {
                name: "filiacao1_naoSeAplica1",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
            },
            {
                name: "filiacao2_nome1",
                label: "Nome da filiação 2",
                type: "text" as const,
                required: false,
                placeholder: "Nome completo da filiação 2",
            },
            {
                name: "filiacao2_naoSeAplica1",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
            },
            {
                name: "pessoaDeficiencia1",
                label: "Possui deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                    { label: "Não sei informar", value: "nao_sei_informar" },
                    { label: "Não respondeu", value: "nao_respondeu" },
                ]
            }
        );

        if (formValues.pessoaDeficiencia1 === "sim") {
            conditionalFields.push({
                name: "pessoaInterditada1",
                label: "A pessoa é interditada por consequência da deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ]
            });

            if (formValues.pessoaInterditada1 === "sim") {
                conditionalFields.push(
                    {
                        name: "nomeCuradorTutora1",
                        label: "Nome do curador(a)/tutor(a)",
                        type: "text" as const,
                        required: true,
                    },
                    {
                        name: "tipoInterdicao1",
                        label: "Tipo de interdição",
                        type: "radio" as const,
                        required: true,
                        options: [
                            { label: "Parcial", value: "parcial" },
                            { label: "Total", value: "total" },
                        ],
                    }
                );
            }
        }

        conditionalFields.push(
            {
                name: "estadoCivil1",
                label: "Estado civil",
                type: "radio" as const,
                required: false,
                options: estadoCivilOptions
            },
            {
                name: "escolaridade1",
                label: "Escolaridade",
                type: "select" as const,
                required: true,
                options: escolaridadeOptions
            },
            {
                name: "frequentaEscola1",
                label: "Frequenta educação escolar?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }
        );

        if (formValues.frequentaEscola1 === "sim") {
            conditionalFields.push(
                {
                    name: "modalidadeEnsino1",
                    label: "Modalidade de ensino",
                    type: "radio" as const,
                    required: false,
                    options: modalidadeEnsinoOptions
                },
                {
                    name: "nomeInstituicaoEnsino1",
                    label: "Nome da instituição de ensino",
                    type: "text" as const,
                    required: true,
                    placeholder: "Digite o Nome da instituição de ensino"
                }
            );

            if (
                (formValues.modalidadeEnsino1 === "Presencial" ||
                    formValues.modalidadeEnsino1 === "Hibrido" ||
                    formValues.modalidadeEnsino1 === "Outros") &&
                formValues.frequentaEscola1 === "sim"
            ) {
                conditionalFields.push(
                    {
                        name: "cepI1",
                        label: "Cep",
                        type: "text" as const,
                        mask: "9999-999",
                        placeholder: "0000-000",
                        required: false,
                    },
                    {
                        name: "naoAplicaI1",
                        label: "Não aplica Cep",
                        type: "checkbox" as const,
                        disableField: "cepI1",
                        required: false,
                    },
                    {
                        name: "logradouroI1",
                        label: "Logradouro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "numeroI1",
                        label: "Número",
                        type: "numberSpinner" as const,
                        step: 1,
                        required: false,
                    },
                    {
                        name: "bairroI1",
                        label: "Bairro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "complementoI1",
                        label: "Complemento",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "ufI1",
                        label: "Uf",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "cidadeI1",
                        label: "Cidade",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "subPrefeituraI1",
                        label: "Subprefeitura",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "distritoI1",
                        label: "Distrito",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "localizacaoInstituicaoEnsino1",
                        label: "Localização da Instituição de Ensino",
                        type: "radio" as const,
                        required: false,
                        options: localizacaoOptions,
                    }
                );
            }
            else if (formValues.modalidadeEnsino1 === "EAD" && formValues.frequentaEscola1 === "sim") {
                conditionalFields.push(
                    {
                        name: "localizacaoInstituicaoEnsino1",
                        label: "Localização da Instituição de Ensino",
                        type: "radio" as const,
                        required: false,
                        options: localizacaoOptions
                    }
                );
            }

            conditionalFields.push(
                {
                    name: "pontoPartida1",
                    label: "Ponto de partida é a unidade? ",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            );

            if (formValues.frequentaEscola1 === "sim" && formValues.pontoPartida1 === "sim") {
                conditionalFields.push(
                    {
                        name: "diasSemanaTrabalho1",
                        label: "Quais dias da semana frequenta?",
                        type: "multicombobox" as const,
                        required: false,
                        options: diasSemanaOptions
                    },
                    {
                        name: "quaisConducoesTrabalho1",
                        label: "Quais conduções você utiliza para chegar até a instituição de ensino?",
                        type: "multicombobox" as const,
                        required: false,
                        options: conducoesOptions
                    },
                    {
                        name: "quantHorasTrabalho1",
                        label: "Horário de saída da unidade",
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: "tempoTotalTrabalho1",
                        label: "Tempo total do percurso",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "tempoAndandoConducao1",
                        label: "Tempo andando da condução até a instituição de ensino",
                        type: "time" as const,
                        required: false,
                    }
                );
            }
        }

        conditionalFields.push(
            {
                name: "atividadeRemunerada1",
                label: "Exerce atividade remunerada?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }
        );

        if (formValues.atividadeRemunerada1 === "sim") {
            conditionalFields.push(
                {
                    name: "modalidadeTrabalho1",
                    label: "Modalidade de trabalho",
                    type: "radio" as const,
                    required: false,
                    options: modalidadeTrabalhoOptions,
                },
                {
                    name: "localizacaoTrabalho1",
                    label: "Localização da atividade remunerada principal ",
                    type: "radio" as const,
                    required: false,
                    options: localizacaoOptions,
                },
                {
                    name: "nomeAtividadeRemunerada1",
                    label: "Nome da atividade remunerada",
                    type: "text" as const,
                    required: false,
                }
            );

            if (formValues.modalidadeTrabalho1 === "presencial" || formValues.modalidadeTrabalho1 === "hibrido") {
                conditionalFields.push(
                    {
                        name: "cepTrabalho1",
                        label: "Cep",
                        type: "text" as const,
                        mask: "9999-999",
                        placeholder: "0000-000",
                        required: false,
                    },
                    {
                        name: "naoAplicaTrabalho1",
                        label: "Não aplica Cep",
                        type: "checkbox" as const,
                        disableField: "cepTrabalho1",
                        required: false,
                    },
                    {
                        name: "logradouroTrabalho1",
                        label: "Logradouro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "numeroTrabalho1",
                        label: "Número",
                        type: "numberSpinner" as const,
                        step: 1,
                        required: false,
                    },
                    {
                        name: "bairroTrabalho1",
                        label: "Bairro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "complementoTrabalho1",
                        label: "Complemento",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "ufTrabalho1",
                        label: "Uf",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "cidadeTrabalho1",
                        label: "Cidade",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "subPrefeituraTrabalho1",
                        label: "Subprefeitura",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "distritoTrabalho1",
                        label: "Distrito",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    }
                );
            }

            conditionalFields.push(
                {
                    name: "diasSemanaTrabalho1",
                    label: "Quais dias da semana trabalha?",
                    type: "multicombobox" as const,
                    required: false,
                    options: diasSemanaOptions,
                },
                {
                    name: "quaisConducoesTrabalho1",
                    label: "Quais conduções você utiliza para chegar até o trabalho?",
                    type: "multicombobox" as const,
                    required: false,
                    options: conducoesOptions,
                },
                {
                    name: "quantHorasTrabalho1",
                    label: "Horário de saída da unidade",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoAndandoConducao1",
                    label: "Tempo andando ate a condução",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoConducaoDestino1",
                    label: "Tempo andando da condução até o destino",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoTotalTrabalho1",
                    label: "Tempo total do percurso",
                    type: "text" as const,
                    required: false,
                }
            );
        }

        conditionalFields.push(
            {
                name: "contatos1",
                label: "Contatos",
                type: "label" as const,
                required: false,
            },
            {
                name: "telefoneCelularIntegrante1",
                label: "Telefone celular",
                type: "text" as const,
                required: true,
            },
            {
                name: "emailIntegrante1",
                label: "E-mail",
                type: "email" as const,
                required: true,
            }
        );

        // ✅ BOTÃO PARA ADICIONAR PRÓXIMO INTEGRANTE
        conditionalFields.push({
            name: "ativarIntegrante2",
            label: "Adicionar segundo integrante",
            type: "checkbox" as const,
            required: false
        });
    }

    // ========== INTEGRANTE 2 ==========
    if (formValues.ativarIntegrante2 === true && formValues.possuiIntegrantes === "sim") {
        conditionalFields.push(
            {
                name: "nomeIntegrante2",
                label: "Nome do Integrante",
                type: "text" as const,
                required: true,
                placeholder: "Nome completo"
            },
            {
                name: "nomeSocialIntegrante2",
                label: "Nome social",
                type: "text" as const,
                required: false,
                placeholder: "Nome social (se houver)"
            },
            {
                name: "dataNascimentoIntegrante2",
                label: "Data de nascimento",
                type: "date" as const,
                required: false,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA"
            },
            {
                name: "idadeIntegrante2",
                label: "Idade",
                type: "display" as const,
                required: false,
                displayValue: () => calcularIdade(formValues.dataNascimentoIntegrante2 || "")
            },

        );
        const dataIntegrante2 = formValues.dataNascimentoIntegrante2 || "";

        // Calcular idade a partir da data
        let mostrarRenda2 = false;
        let idadeCalculada2 = 0;

        if (dataIntegrante2) {
            // Converter a data do formato YYYY-MM-DD para calcular idade
            const [ano, mes, dia] = dataIntegrante2.split('-').map(Number);
            const dataNascimento = new Date(ano, mes - 1, dia); // mês é 0-indexed
            const hoje = new Date();

            idadeCalculada2 = hoje.getFullYear() - dataNascimento.getFullYear();

            // Ajustar se ainda não fez aniversário este ano
            const mesAtual = hoje.getMonth();
            const diaAtual = hoje.getDate();

            if (mesAtual < (mes - 1) || (mesAtual === (mes - 1) && diaAtual < dia)) {
                idadeCalculada2--;
            }

            mostrarRenda2 = idadeCalculada2 >= 14;
        }

        console.log('🔍 Data nascimento integrante 2:', dataIntegrante2);
        console.log('🔍 Idade calculada integrante 2:', idadeCalculada2);
        console.log('🔍 Mostrar renda 2 (idade ≥ 14):', mostrarRenda2);

        if (mostrarRenda2) {
            conditionalFields.push(
                {
                    name: "renda2",
                    label: `Renda do Integrante 2 (idade: ${idadeCalculada2} anos)`,
                    type: "label" as const,
                    required: false,
                },
                {
                    name: "recebeBeneficio2",
                    label: "Recebe benefício?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            );

            if (formValues.recebeBeneficio2 === "sim") {
                conditionalFields.push({
                    name: "beneficiosRecebidos2",
                    label: "Benefícios recebidos",
                    type: "multicombobox",
                    required: false,
                    placeholder: "Escolha os benefícios",
                    options: BENEFICIOS_OPTIONS.map((b) => ({
                        label: b.replace(/_/g, " "),
                        value: b,
                    })),
                });

                const beneficiosRecebidos2 = formValues.beneficiosRecebidos2 || [];

                // Configuração dos benefícios para evitar repetição de código
                const beneficiosConfig = [
                    { key: "Bolsa Familia", label: "Bolsa Família", fieldName: "valorRendaBolsaF2" },
                    { key: "Auxilio Emergencial", label: "Auxílio Emergencial", fieldName: "valorRendaAuxilioE2" },
                    { key: "BPC_Pessoa idosa", label: "BPC Pessoa Idosa", fieldName: "valorRendaBPC_PessoaI2" },
                    { key: "BPC_Pessoa com deficiencia", label: "BPC Pessoa com Deficiência", fieldName: "valorRendaBPC_PessoaD2" },
                    { key: "Auxilio inclusao", label: "Auxílio Inclusão", fieldName: "valorRendaAuxilioInclusao2" },
                    { key: "Renda cidada", label: "Renda Cidadã", fieldName: "valorRendaCidada2" },
                    { key: "Renda minima", label: "Renda Mínima", fieldName: "valorRendaMinima2" },
                    { key: "Acao jovem", label: "Ação Jovem", fieldName: "valorRendaAcaoJovem2" }
                ];

                beneficiosConfig.forEach(({ key, label, fieldName }) => {
                    if (beneficiosRecebidos2.includes(key)) {
                        conditionalFields.push(
                            {
                                name: fieldName,
                                label: `Valor do ${label}`,
                                type: "text",
                                required: true,
                                placeholder: "Digite o valor"
                            },
                            {
                                name: `naoAplica${fieldName}`,
                                label: "Não se aplica",
                                type: "checkbox" as const,
                                required: false,
                            }
                        );
                    }
                });
            }

            conditionalFields.push({
                name: "origemRenda2",
                label: "Indique a origem da renda",
                type: "multicombobox",
                required: false,
                placeholder: "Selecione as origens de renda",
                options: ORIGEM_RENDA_OPTIONS.map((item) => ({
                    label: item,
                    value: item,
                })),
            });

            const origensSelecionadas2 = formValues.origemRenda2 || [];

            // Configuração das origens de renda para evitar repetição de código
            const origensConfig = [
                {
                    key: "Aposentadoria (idade, invalidez ou por tempo de contribuição)",
                    fieldName: "valorRendaAposentadoria2",
                    label: "Aposentadoria"
                },
                {
                    key: "Pensão por morte",
                    fieldName: "valorRendaPensaoPorMorte2",
                    label: "Pensão por morte"
                },
                {
                    key: "Pensão alimentícia",
                    fieldName: "valorRendaPensaoAlimenticia2",
                    label: "Pensão alimentícia"
                },
                {
                    key: "Auxílio doença",
                    fieldName: "valorRendaAuxilioDoenca2",
                    label: "Auxílio doença"
                },
                {
                    key: "Auxílio reclusão",
                    fieldName: "valorRendaAuxilioReclusao2",
                    label: "Auxílio reclusão"
                },
                {
                    key: "Auxílio acidente",
                    fieldName: "valorRendaAuxilioAcidente2",
                    label: "Auxílio acidente"
                },
                {
                    key: "Salário família",
                    fieldName: "valorRendaSalarioFamilia2",
                    label: "Salário família"
                },
                {
                    key: "Salário maternidade",
                    fieldName: "valorRendaSalarioMaternidade2",
                    label: "Salário maternidade"
                },
                {
                    key: "Aluguel",
                    fieldName: "valorRendaAluguel2",
                    label: "Aluguel"
                }
            ];

            origensConfig.forEach(({ key, fieldName, label }) => {
                if (origensSelecionadas2.includes(key)) {
                    conditionalFields.push(
                        {
                            name: fieldName,
                            label: `Valor da ${label}`,
                            type: "text",
                            required: true,
                            placeholder: "Digite o valor"
                        },
                        {
                            name: `naoInformado${fieldName}`,
                            label: "Não informado",
                            type: "checkbox" as const,
                            required: false,
                        }
                    );
                }
            });

            if (origensSelecionadas2.includes("Outros")) {
                conditionalFields.push({
                    name: "especificarOutros2",
                    label: "Especifique as fontes de renda (Outros)",
                    type: "text",
                    required: true,
                    placeholder: "Descreva a fonte de renda"
                });
            }
        }
        // CONTINUAÇÃO DOS CAMPOS DO INTEGRANTE 1
        conditionalFields.push(
            {
                name: "relacaoResponsavel2",
                label: "Parentesco com o responsável",
                type: "select" as const,
                required: false,
                options: relacaoResponsavelOptions
            }
        );

        if (formValues.relacaoResponsavel2 === "outro") {
            conditionalFields.push({
                name: "outraRelacaoResponsavel2",
                label: "Descreva a relação de parentesco",
                type: "text" as const,
                required: true,
                placeholder: "Descreva a relação de parentesco"
            });
        }

        conditionalFields.push(
            {
                name: "responsavelUnidade2",
                label: "É responsável pela unidade?",
                type: "radio" as const,
                required: false,
                options: responsavelUnidadeOptions
            },
            {
                name: "doc2",
                label: "Documentos do Integrante",
                type: "label" as const,
                required: false,
            },
            {
                name: "rgI2",
                label: "RG",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.rgI2 === true) {
            conditionalFields.push({
                name: "numeroRGI2",
                label: "Número do RG",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do RG"
            });
        }

        conditionalFields.push(
            {
                name: "cpfI2",
                label: "CPF",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.cpfI2 === true) {
            conditionalFields.push({
                name: "numeroCPFI2",
                label: "Número do CPF",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do CPF"
            });
        }

        conditionalFields.push(
            {
                name: "cnhI2",
                label: "CNH",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.cnhI2 === true) {
            conditionalFields.push({
                name: "numeroCNHI2",
                label: "Número da CNH",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número da CNH"
            });
        }

        conditionalFields.push(
            {
                name: "rnmI2",
                label: "RNM",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.rnmI2 === true) {
            conditionalFields.push({
                name: "numeroRNMI2",
                label: "Número do RNM",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do RNM"
            });
        }

        conditionalFields.push(
            {
                name: "filiacao2",
                label: "Informações de Filiação",
                type: "label" as const,
                required: false,
            },
            {
                name: "filiacao1_nome2",
                label: "Nome da filiação 1",
                type: "text" as const,
                required: false,
                placeholder: "Nome completo da filiação 1",
            },
            {
                name: "filiacao1_naoSeAplica2",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
            },
            {
                name: "filiacao2_nome2",
                label: "Nome da filiação 2",
                type: "text" as const,
                required: false,
                placeholder: "Nome completo da filiação 2",
            },
            {
                name: "filiacao2_naoSeAplica2",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
            },
            {
                name: "pessoaDeficiencia2",
                label: "Possui deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                    { label: "Não sei informar", value: "nao_sei_informar" },
                    { label: "Não respondeu", value: "nao_respondeu" },
                ]
            }
        );

        if (formValues.pessoaDeficiencia2 === "sim") {
            conditionalFields.push({
                name: "pessoaInterditada2",
                label: "A pessoa é interditada por consequência da deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ]
            });

            if (formValues.pessoaInterditada2 === "sim") {
                conditionalFields.push(
                    {
                        name: "nomeCuradorTutora2",
                        label: "Nome do curador(a)/tutor(a)",
                        type: "text" as const,
                        required: true,
                    },
                    {
                        name: "tipoInterdicao2",
                        label: "Tipo de interdição",
                        type: "radio" as const,
                        required: true,
                        options: [
                            { label: "Parcial", value: "parcial" },
                            { label: "Total", value: "total" },
                        ],
                    }
                );
            }
        }

        conditionalFields.push(
            {
                name: "estadoCivil2",
                label: "Estado civil",
                type: "radio" as const,
                required: false,
                options: estadoCivilOptions
            },
            {
                name: "escolaridade2",
                label: "Escolaridade",
                type: "select" as const,
                required: true,
                options: escolaridadeOptions
            },
            {
                name: "frequentaEscola2",
                label: "Frequenta educação escolar?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }
        );

        if (formValues.frequentaEscola2 === "sim") {
            conditionalFields.push(
                {
                    name: "modalidadeEnsino2",
                    label: "Modalidade de ensino",
                    type: "radio" as const,
                    required: false,
                    options: modalidadeEnsinoOptions
                },
                {
                    name: "nomeInstituicaoEnsino2",
                    label: "Nome da instituição de ensino",
                    type: "text" as const,
                    required: true,
                    placeholder: "Digite o Nome da instituição de ensino"
                }
            );

            if (
                (formValues.modalidadeEnsino2 === "Presencial" ||
                    formValues.modalidadeEnsino2 === "Hibrido" ||
                    formValues.modalidadeEnsino2 === "Outros") &&
                formValues.frequentaEscola2 === "sim"
            ) {
                conditionalFields.push(
                    {
                        name: "cepI2",
                        label: "Cep",
                        type: "text" as const,
                        mask: "9999-999",
                        placeholder: "0000-000",
                        required: false,
                    },
                    {
                        name: "naoAplicaI2",
                        label: "Não aplica Cep",
                        type: "checkbox" as const,
                        disableField: "cepI2",
                        required: false,
                    },
                    {
                        name: "logradouroI2",
                        label: "Logradouro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "numeroI2",
                        label: "Número",
                        type: "numberSpinner" as const,
                        step: 1,
                        required: false,
                    },
                    {
                        name: "bairroI2",
                        label: "Bairro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "complementoI2",
                        label: "Complemento",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "ufI2",
                        label: "Uf",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "cidadeI2",
                        label: "Cidade",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "subPrefeituraI2",
                        label: "Subprefeitura",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "distritoI2",
                        label: "Distrito",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "localizacaoInstituicaoEnsino2",
                        label: "Localização da Instituição de Ensino",
                        type: "radio" as const,
                        required: false,
                        options: localizacaoOptions,
                    }
                );
            }
            else if (formValues.modalidadeEnsino2 === "EAD" && formValues.frequentaEscola2 === "sim") {
                conditionalFields.push(
                    {
                        name: "localizacaoInstituicaoEnsino2",
                        label: "Localização da Instituição de Ensino",
                        type: "radio" as const,
                        required: false,
                        options: localizacaoOptions
                    }
                );
            }

            conditionalFields.push(
                {
                    name: "pontoPartida2",
                    label: "Ponto de partida é a unidade? ",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            );

            if (formValues.frequentaEscola2 === "sim" && formValues.pontoPartida2 === "sim") {
                conditionalFields.push(
                    {
                        name: "diasSemanaTrabalho2",
                        label: "Quais dias da semana frequenta?",
                        type: "multicombobox" as const,
                        required: false,
                        options: diasSemanaOptions
                    },
                    {
                        name: "quaisConducoesTrabalho2",
                        label: "Quais conduções você utiliza para chegar até a instituição de ensino?",
                        type: "multicombobox" as const,
                        required: false,
                        options: conducoesOptions
                    },
                    {
                        name: "quantHorasTrabalho2",
                        label: "Horário de saída da unidade",
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: "tempoTotalTrabalho2",
                        label: "Tempo total do percurso",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "tempoAndandoConducao2",
                        label: "Tempo andando da condução até a instituição de ensino",
                        type: "time" as const,
                        required: false,
                    }
                );
            }
        }

        conditionalFields.push(
            {
                name: "atividadeRemunerada2",
                label: "Exerce atividade remunerada?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }
        );

        if (formValues.atividadeRemunerada2 === "sim") {
            conditionalFields.push(
                {
                    name: "modalidadeTrabalho2",
                    label: "Modalidade de trabalho",
                    type: "radio" as const,
                    required: false,
                    options: modalidadeTrabalhoOptions,
                },
                {
                    name: "localizacaoTrabalho2",
                    label: "Localização da atividade remunerada principal ",
                    type: "radio" as const,
                    required: false,
                    options: localizacaoOptions,
                },
                {
                    name: "nomeAtividadeRemunerada2",
                    label: "Nome da atividade remunerada",
                    type: "text" as const,
                    required: false,
                }
            );

            if (formValues.modalidadeTrabalho2 === "presencial" || formValues.modalidadeTrabalho2 === "hibrido") {
                conditionalFields.push(
                    {
                        name: "cepTrabalho2",
                        label: "Cep",
                        type: "text" as const,
                        mask: "9999-999",
                        placeholder: "0000-000",
                        required: false,
                    },
                    {
                        name: "naoAplicaTrabalho2",
                        label: "Não aplica Cep",
                        type: "checkbox" as const,
                        disableField: "cepTrabalho2",
                        required: false,
                    },
                    {
                        name: "logradouroTrabalho2",
                        label: "Logradouro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "numeroTrabalho2",
                        label: "Número",
                        type: "numberSpinner" as const,
                        step: 1,
                        required: false,
                    },
                    {
                        name: "bairroTrabalho2",
                        label: "Bairro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "complementoTrabalho2",
                        label: "Complemento",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "ufTrabalho2",
                        label: "Uf",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "cidadeTrabalho2",
                        label: "Cidade",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "subPrefeituraTrabalho2",
                        label: "Subprefeitura",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "distritoTrabalho2",
                        label: "Distrito",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    }
                );
            }

            conditionalFields.push(
                {
                    name: "diasSemanaTrabalho2",
                    label: "Quais dias da semana trabalha?",
                    type: "multicombobox" as const,
                    required: false,
                    options: diasSemanaOptions,
                },
                {
                    name: "quaisConducoesTrabalho2",
                    label: "Quais conduções você utiliza para chegar até o trabalho?",
                    type: "multicombobox" as const,
                    required: false,
                    options: conducoesOptions,
                },
                {
                    name: "quantHorasTrabalho2",
                    label: "Horário de saída da unidade",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoAndandoConducao2",
                    label: "Tempo andando ate a condução",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoConducaoDestino2",
                    label: "Tempo andando da condução até o destino",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoTotalTrabalho2",
                    label: "Tempo total do percurso",
                    type: "text" as const,
                    required: false,
                }
            );
        }

        conditionalFields.push(
            {
                name: "contatos2",
                label: "Contatos",
                type: "label" as const,
                required: false,
            },
            {
                name: "telefoneCelularIntegrante2",
                label: "Telefone celular",
                type: "text" as const,
                required: true,
            },
            {
                name: "emailIntegrante2",
                label: "E-mail",
                type: "email" as const,
                required: true,
            }
        );

        conditionalFields.push({
            name: "ativarIntegrante3",
            label: "Adicionar terceiro integrante",
            type: "checkbox" as const,
            required: false
        });
    }

    // ========== INTEGRANTE 3 ==========
    if (formValues.ativarIntegrante3 === true && formValues.possuiIntegrantes === "sim") {
        conditionalFields.push(
            {
                name: "nomeIntegrante3",
                label: "Nome do Integrante",
                type: "text" as const,
                required: true,
                placeholder: "Nome completo"
            },
            {
                name: "nomeSocialIntegrante3",
                label: "Nome social",
                type: "text" as const,
                required: false,
                placeholder: "Nome social (se houver)"
            },
            {
                name: "dataNascimentoIntegrante3",
                label: "Data de nascimento",
                type: "date" as const,
                required: false,
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA"
            },
            {
                name: "idadeIntegrante3",
                label: "Idade",
                type: "display" as const,
                required: false,
                displayValue: () => calcularIdade(formValues.dataNascimentoIntegrante3 || "")
            },

        );
        const dataIntegrante3 = formValues.dataNascimentoIntegrante3 || "";

        // Calcular idade a partir da data
        let mostrarRenda3 = false;
        let idadeCalculada3 = 0;

        if (dataIntegrante3) {
            // Converter a data do formato YYYY-MM-DD para calcular idade
            const [ano, mes, dia] = dataIntegrante3.split('-').map(Number);
            const dataNascimento = new Date(ano, mes - 1, dia); // mês é 0-indexed
            const hoje = new Date();

            idadeCalculada3 = hoje.getFullYear() - dataNascimento.getFullYear();

            // Ajustar se ainda não fez aniversário este ano
            const mesAtual = hoje.getMonth();
            const diaAtual = hoje.getDate();

            if (mesAtual < (mes - 1) || (mesAtual === (mes - 1) && diaAtual < dia)) {
                idadeCalculada3--;
            }

            mostrarRenda3 = idadeCalculada3 >= 14;
        }

        console.log('🔍 Data nascimento integrante 3:', dataIntegrante3);
        console.log('🔍 Idade calculada integrante 3:', idadeCalculada3);
        console.log('🔍 Mostrar renda 3 (idade ≥ 14):', mostrarRenda3);

        if (mostrarRenda3) {
            conditionalFields.push(
                {
                    name: "renda3",
                    label: `Renda do Integrante 3 (idade: ${idadeCalculada3} anos)`,
                    type: "label" as const,
                    required: false,
                },
                {
                    name: "recebeBeneficio3",
                    label: "Recebe benefício?",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            );

            if (formValues.recebeBeneficio3 === "sim") {
                conditionalFields.push({
                    name: "beneficiosRecebidos3",
                    label: "Benefícios recebidos",
                    type: "multicombobox",
                    required: false,
                    placeholder: "Escolha os benefícios",
                    options: BENEFICIOS_OPTIONS.map((b) => ({
                        label: b.replace(/_/g, " "),
                        value: b,
                    })),
                });

                const beneficiosRecebidos3 = formValues.beneficiosRecebidos3 || [];

                // Configuração dos benefícios para evitar repetição de código
                const beneficiosConfig = [
                    { key: "Bolsa Familia", label: "Bolsa Família", fieldName: "valorRendaBolsaF3" },
                    { key: "Auxilio Emergencial", label: "Auxílio Emergencial", fieldName: "valorRendaAuxilioE3" },
                    { key: "BPC_Pessoa idosa", label: "BPC Pessoa Idosa", fieldName: "valorRendaBPC_PessoaI3" },
                    { key: "BPC_Pessoa com deficiencia", label: "BPC Pessoa com Deficiência", fieldName: "valorRendaBPC_PessoaD3" },
                    { key: "Auxilio inclusao", label: "Auxílio Inclusão", fieldName: "valorRendaAuxilioInclusao3" },
                    { key: "Renda cidada", label: "Renda Cidadã", fieldName: "valorRendaCidada3" },
                    { key: "Renda minima", label: "Renda Mínima", fieldName: "valorRendaMinima3" },
                    { key: "Acao jovem", label: "Ação Jovem", fieldName: "valorRendaAcaoJovem3" }
                ];

                beneficiosConfig.forEach(({ key, label, fieldName }) => {
                    if (beneficiosRecebidos3.includes(key)) {
                        conditionalFields.push(
                            {
                                name: fieldName,
                                label: `Valor do ${label}`,
                                type: "text",
                                required: true,
                                placeholder: "Digite o valor"
                            },
                            {
                                name: `naoAplica${fieldName}`,
                                label: "Não se aplica",
                                type: "checkbox" as const,
                                required: false,
                            }
                        );
                    }
                });
            }

            conditionalFields.push({
                name: "origemRenda3",
                label: "Indique a origem da renda",
                type: "multicombobox",
                required: false,
                placeholder: "Selecione as origens de renda",
                options: ORIGEM_RENDA_OPTIONS.map((item) => ({
                    label: item,
                    value: item,
                })),
            });

            const origensSelecionadas3 = formValues.origemRenda3 || [];

            // Configuração das origens de renda para evitar repetição de código
            const origensConfig = [
                {
                    key: "Aposentadoria (idade, invalidez ou por tempo de contribuição)",
                    fieldName: "valorRendaAposentadoria3",
                    label: "Aposentadoria"
                },
                {
                    key: "Pensão por morte",
                    fieldName: "valorRendaPensaoPorMorte3",
                    label: "Pensão por morte"
                },
                {
                    key: "Pensão alimentícia",
                    fieldName: "valorRendaPensaoAlimenticia3",
                    label: "Pensão alimentícia"
                },
                {
                    key: "Auxílio doença",
                    fieldName: "valorRendaAuxilioDoenca3",
                    label: "Auxílio doença"
                },
                {
                    key: "Auxílio reclusão",
                    fieldName: "valorRendaAuxilioReclusao3",
                    label: "Auxílio reclusão"
                },
                {
                    key: "Auxílio acidente",
                    fieldName: "valorRendaAuxilioAcidente3",
                    label: "Auxílio acidente"
                },
                {
                    key: "Salário família",
                    fieldName: "valorRendaSalarioFamilia3",
                    label: "Salário família"
                },
                {
                    key: "Salário maternidade",
                    fieldName: "valorRendaSalarioMaternidade3",
                    label: "Salário maternidade"
                },
                {
                    key: "Aluguel",
                    fieldName: "valorRendaAluguel3",
                    label: "Aluguel"
                }
            ];

            origensConfig.forEach(({ key, fieldName, label }) => {
                if (origensSelecionadas3.includes(key)) {
                    conditionalFields.push(
                        {
                            name: fieldName,
                            label: `Valor da ${label}`,
                            type: "text",
                            required: true,
                            placeholder: "Digite o valor"
                        },
                        {
                            name: `naoInformado${fieldName}`,
                            label: "Não informado",
                            type: "checkbox" as const,
                            required: false,
                        }
                    );
                }
            });

            if (origensSelecionadas3.includes("Outros")) {
                conditionalFields.push({
                    name: "especificarOutros3",
                    label: "Especifique as fontes de renda (Outros)",
                    type: "text",
                    required: true,
                    placeholder: "Descreva a fonte de renda"
                });
            }
        }
        if (formValues.relacaoResponsavel3 === "outro") {
            conditionalFields.push({
                name: "outraRelacaoResponsavel3",
                label: "Descreva a relação de parentesco",
                type: "text" as const,
                required: true,
                placeholder: "Descreva a relação de parentesco"
            });
        }

        conditionalFields.push(
            {
                name: "responsavelUnidade3",
                label: "É responsável pela unidade?",
                type: "radio" as const,
                required: false,
                options: responsavelUnidadeOptions
            },
            {
                name: "doc3",
                label: "Documentos do Integrante",
                type: "label" as const,
                required: false,
            },
            {
                name: "rgI3",
                label: "RG",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.rgI3 === true) {
            conditionalFields.push({
                name: "numeroRGI3",
                label: "Número do RG",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do RG"
            });
        }

        conditionalFields.push(
            {
                name: "cpfI3",
                label: "CPF",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.cpfI3 === true) {
            conditionalFields.push({
                name: "numeroCPFI3",
                label: "Número do CPF",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do CPF"
            });
        }

        conditionalFields.push(
            {
                name: "cnhI3",
                label: "CNH",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.cnhI3 === true) {
            conditionalFields.push({
                name: "numeroCNHI3",
                label: "Número da CNH",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número da CNH"
            });
        }

        conditionalFields.push(
            {
                name: "rnmI3",
                label: "RNM",
                type: "checkbox" as const,
                required: false
            }
        );

        if (formValues.rnmI3 === true) {
            conditionalFields.push({
                name: "numeroRNMI3",
                label: "Número do RNM",
                type: "text" as const,
                required: true,
                placeholder: "Digite o número do RNM"
            });
        }

        conditionalFields.push(
            {
                name: "filiacao3",
                label: "Informações de Filiação",
                type: "label" as const,
                required: false,
            },
            {
                name: "filiacao1_nome3",
                label: "Nome da filiação 1",
                type: "text" as const,
                required: false,
                placeholder: "Nome completo da filiação 1",
            },
            {
                name: "filiacao1_naoSeAplica3",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
            },
            {
                name: "filiacao2_nome3",
                label: "Nome da filiação 2",
                type: "text" as const,
                required: false,
                placeholder: "Nome completo da filiação 2",
            },
            {
                name: "filiacao2_naoSeAplica3",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
            },
            {
                name: "pessoaDeficiencia3",
                label: "Possui deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                    { label: "Não sei informar", value: "nao_sei_informar" },
                    { label: "Não respondeu", value: "nao_respondeu" },
                ]
            }
        );

        if (formValues.pessoaDeficiencia3 === "sim") {
            conditionalFields.push({
                name: "pessoaInterditada3",
                label: "A pessoa é interditada por consequência da deficiência?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" },
                ]
            });

            if (formValues.pessoaInterditada3 === "sim") {
                conditionalFields.push(
                    {
                        name: "nomeCuradorTutora3",
                        label: "Nome do curador(a)/tutor(a)",
                        type: "text" as const,
                        required: true,
                    },
                    {
                        name: "tipoInterdicao3",
                        label: "Tipo de interdição",
                        type: "radio" as const,
                        required: true,
                        options: [
                            { label: "Parcial", value: "parcial" },
                            { label: "Total", value: "total" },
                        ],
                    }
                );
            }
        }

        conditionalFields.push(
            {
                name: "estadoCivil3",
                label: "Estado civil",
                type: "radio" as const,
                required: false,
                options: estadoCivilOptions
            },
            {
                name: "escolaridade3",
                label: "Escolaridade",
                type: "select" as const,
                required: true,
                options: escolaridadeOptions
            },
            {
                name: "frequentaEscola3",
                label: "Frequenta educação escolar?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }
        );

        if (formValues.frequentaEscola3 === "sim") {
            conditionalFields.push(
                {
                    name: "modalidadeEnsino3",
                    label: "Modalidade de ensino",
                    type: "radio" as const,
                    required: false,
                    options: modalidadeEnsinoOptions
                },
                {
                    name: "nomeInstituicaoEnsino3",
                    label: "Nome da instituição de ensino",
                    type: "text" as const,
                    required: true,
                    placeholder: "Digite o Nome da instituição de ensino"
                }
            );

            if (
                (formValues.modalidadeEnsino3 === "Presencial" ||
                    formValues.modalidadeEnsino3 === "Hibrido" ||
                    formValues.modalidadeEnsino3 === "Outros") &&
                formValues.frequentaEscola3 === "sim"
            ) {
                conditionalFields.push(
                    {
                        name: "cepI3",
                        label: "Cep",
                        type: "text" as const,
                        mask: "9999-999",
                        placeholder: "0000-000",
                        required: false,
                    },
                    {
                        name: "naoAplicaI3",
                        label: "Não aplica Cep",
                        type: "checkbox" as const,
                        disableField: "cepI3",
                        required: false,
                    },
                    {
                        name: "logradouroI3",
                        label: "Logradouro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "numeroI3",
                        label: "Número",
                        type: "numberSpinner" as const,
                        step: 1,
                        required: false,
                    },
                    {
                        name: "bairroI3",
                        label: "Bairro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "complementoI3",
                        label: "Complemento",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "ufI3",
                        label: "Uf",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "cidadeI3",
                        label: "Cidade",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "subPrefeituraI3",
                        label: "Subprefeitura",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "distritoI3",
                        label: "Distrito",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "localizacaoInstituicaoEnsino3",
                        label: "Localização da Instituição de Ensino",
                        type: "radio" as const,
                        required: false,
                        options: localizacaoOptions,
                    }
                );
            }
            else if (formValues.modalidadeEnsino3 === "EAD" && formValues.frequentaEscola3 === "sim") {
                conditionalFields.push(
                    {
                        name: "localizacaoInstituicaoEnsino3",
                        label: "Localização da Instituição de Ensino",
                        type: "radio" as const,
                        required: false,
                        options: localizacaoOptions
                    }
                );
            }

            conditionalFields.push(
                {
                    name: "pontoPartida3",
                    label: "Ponto de partida é a unidade? ",
                    type: "radio" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                    ]
                }
            );

            if (formValues.frequentaEscola3 === "sim" && formValues.pontoPartida3 === "sim") {
                conditionalFields.push(
                    {
                        name: "diasSemanaTrabalho3",
                        label: "Quais dias da semana frequenta?",
                        type: "multicombobox" as const,
                        required: false,
                        options: diasSemanaOptions
                    },
                    {
                        name: "quaisConducoesTrabalho3",
                        label: "Quais conduções você utiliza para chegar até a instituição de ensino?",
                        type: "multicombobox" as const,
                        required: false,
                        options: conducoesOptions
                    },
                    {
                        name: "quantHorasTrabalho3",
                        label: "Horário de saída da unidade",
                        type: "time" as const,
                        required: false,
                    },
                    {
                        name: "tempoTotalTrabalho3",
                        label: "Tempo total do percurso",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "tempoAndandoConducao3",
                        label: "Tempo andando da condução até a instituição de ensino",
                        type: "time" as const,
                        required: false,
                    }
                );
            }
        }

        conditionalFields.push(
            {
                name: "atividadeRemunerada3",
                label: "Exerce atividade remunerada?",
                type: "radio" as const,
                required: false,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }
        );

        if (formValues.atividadeRemunerada3 === "sim") {
            conditionalFields.push(
                {
                    name: "modalidadeTrabalho3",
                    label: "Modalidade de trabalho",
                    type: "radio" as const,
                    required: false,
                    options: modalidadeTrabalhoOptions,
                },
                {
                    name: "localizacaoTrabalho3",
                    label: "Localização da atividade remunerada principal ",
                    type: "radio" as const,
                    required: false,
                    options: localizacaoOptions,
                },
                {
                    name: "nomeAtividadeRemunerada3",
                    label: "Nome da atividade remunerada",
                    type: "text" as const,
                    required: false,
                }
            );

            if (formValues.modalidadeTrabalho3 === "presencial" || formValues.modalidadeTrabalho3 === "hibrido") {
                conditionalFields.push(
                    {
                        name: "cepTrabalho3",
                        label: "Cep",
                        type: "text" as const,
                        mask: "9999-999",
                        placeholder: "0000-000",
                        required: false,
                    },
                    {
                        name: "naoAplicaTrabalho3",
                        label: "Não aplica Cep",
                        type: "checkbox" as const,
                        disableField: "cepTrabalho3",
                        required: false,
                    },
                    {
                        name: "logradouroTrabalho3",
                        label: "Logradouro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "numeroTrabalho3",
                        label: "Número",
                        type: "numberSpinner" as const,
                        step: 1,
                        required: false,
                    },
                    {
                        name: "bairroTrabalho3",
                        label: "Bairro",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "complementoTrabalho3",
                        label: "Complemento",
                        type: "text" as const,
                        required: false,
                    },
                    {
                        name: "ufTrabalho3",
                        label: "Uf",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "cidadeTrabalho3",
                        label: "Cidade",
                        type: "combobox" as const,
                        options: [],
                        required: true,
                    },
                    {
                        name: "subPrefeituraTrabalho3",
                        label: "Subprefeitura",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    },
                    {
                        name: "distritoTrabalho3",
                        label: "Distrito",
                        type: "combobox" as const,
                        options: [],
                        required: false,
                    }
                );
            }

            conditionalFields.push(
                {
                    name: "diasSemanaTrabalho3",
                    label: "Quais dias da semana trabalha?",
                    type: "multicombobox" as const,
                    required: false,
                    options: diasSemanaOptions,
                },
                {
                    name: "quaisConducoesTrabalho3",
                    label: "Quais conduções você utiliza para chegar até o trabalho?",
                    type: "multicombobox" as const,
                    required: false,
                    options: conducoesOptions,
                },
                {
                    name: "quantHorasTrabalho3",
                    label: "Horário de saída da unidade",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoAndandoConducao3",
                    label: "Tempo andando ate a condução",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoConducaoDestino3",
                    label: "Tempo andando da condução até o destino",
                    type: "time" as const,
                    required: false,
                },
                {
                    name: "tempoTotalTrabalho3",
                    label: "Tempo total do percurso",
                    type: "text" as const,
                    required: false,
                }
            );
        }

        conditionalFields.push(
            {
                name: "contatos3",
                label: "Contatos",
                type: "label" as const,
                required: false,
            },
            {
                name: "telefoneCelularIntegrante3",
                label: "Telefone celular",
                type: "text" as const,
                required: true,
            },
            {
                name: "emailIntegrante3",
                label: "E-mail",
                type: "email" as const,
                required: true,
            }
        );

    }

    return conditionalFields;
}

export function getMergedFormSections(formValues: Partial<FormValues>) {
    try {
        const conditionalFields = getConditionalFields(formValues);
        let baseFields = [...integrantesFamiliaDefinition.sections[0].fields];

        // ✅ ESTRATÉGIA SIMPLES: Inserir todos os campos condicionais após "possuiIntegrantes"
        const indexBase = baseFields.findIndex(f => f.name === "possuiIntegrantes");
        if (indexBase !== -1) {
            baseFields.splice(indexBase + 1, 0, ...conditionalFields);
        }

        console.log('✅ ORDEM FINAL DOS CAMPOS:', baseFields.map(f => f.name));

        return [
            {
                ...integrantesFamiliaDefinition.sections[0],
                fields: baseFields
            }
        ];
    } catch (error) {
        console.error("Error in getMergedFormSections:", error);
        return [integrantesFamiliaDefinition.sections[0]];
    }
}