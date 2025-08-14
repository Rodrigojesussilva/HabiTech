export type ArrolamentoApiData = any

function toBrDate(isoOrBr?: string): string {
  if (!isoOrBr) return ''
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoOrBr)) return isoOrBr
  const m = isoOrBr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  return isoOrBr
}

function mapFamilyFormToFields(formEntry: any): Record<string, any> {
  const ident = formEntry?.identificacao_responsavel || {}
  const infoFamilia = formEntry?.informacao_familia || {}
  const contato = formEntry?.contato || {}
  const situacaoUso = formEntry?.situacao_uso || {}
  const doc = formEntry?.documentacao || {}
  const etnicoRacial = formEntry?.identificacao_etnico_racial || {}
  const nup = formEntry?.nupcidade || {}
  const pessoaDef = formEntry?.pessoa_deficiente || {}
  //const outrasInf = formEntry?.outras_informacoes || {}


  const contatoProprietarioBack = situacaoUso.contato_proprietario
  // Aplica o fallback para string vazia
  const contatoProprietarioCampo = contatoProprietarioBack ?? ''

  console.log('Valor do back situacaoUso.contato_proprietario:', contatoProprietarioBack)
  console.log('Valor no campo contato_proprietario:', contatoProprietarioCampo)

  const possuiCINBack = doc.possui_cin;
  // Aplica o fallback para string vazia
  const possuiCINCampo = possuiCINBack ? 'sim' : '';

  console.log('Valor do back doc.possui_cin:', possuiCINBack);
  console.log('Valor no campo possui_cin:', possuiCINCampo);

  return {

    // Identificação do responsável
    responsavel: ident.responsavel === true ? 'sim' : ident.responsavel === false ? 'nao' : '',
    nomeCompletoResp: ident.nome_completo || '',
    dataNascimentoResp: toBrDate(ident.data_nascimento),
    relacaoResponsavel: ident.relacao_social || '',
    DescrevParentesco: ident.descrev_parentesco || '',
    nomeSocialEntrevistado: ident.nome_social || '',
    naoSeAplicaEntrevistado: ident.nome_social_aplicavel === false ? true : false,
    nomeCompletoEntrevistado: ident.nome_completo_entrevistado || '',
    pessoaEmancipada: ident.pessoa_emancipada === true ? 'sim' : ident.pessoa_emancipada === false ? 'nao' : '',
    certidaoEmancipacao: ident.certidao_emancipacao || '',
    idadeResp: ident.idade ?? '',

    // Contato
    email: contato.email || '',
    naoSabeEmail: !!contato.nao_sabe_email,
    telefone1: contato.telefone1 || '',
    telefone2: contato.telefone2 || '',
    telefone3: contato.telefone3 || '',
    telefone4: contato.telefone4 || '',
    tipoTelefone1: contato.tipo_telefone1 || '',
    tipoTelefone2: contato.tipo_telefone2 || '',
    tipoTelefone3: contato.tipo_telefone3 || '',
    tipoTelefone4: contato.tipo_telefone4 || '',
    nomeRecado1: contato.nome_recado_tel1 || '',
    nomeRecado2: contato.nome_recado_tel2 || '',
    nomeRecado3: contato.nome_recado_tel3 || '',
    nomeRecado4: contato.nome_recado_tel4 || '',
    escrevParentesco1: contato.relacao_parentesco_tel1 || '',
    escrevParentesco2: contato.relacao_parentesco_tel2 || '',
    escrevParentesco3: contato.relacao_parentesco_tel3 || '',
    escrevParentesco4: contato.relacao_parentesco_tel4 || '',
    telefone1WhatsApp: !!contato.whatzap_telefone1,
    telefone2WhatsApp: !!contato.whatzap_telefone2,
    telefone3WhatsApp: !!contato.whatzap_telefone3,
    telefone4WhatsApp: !!contato.whatzap_telefone4,
    ativarTelefone2: !!contato.ativar_telefone2,
    ativarTelefone3: !!contato.ativar_telefone3,
    ativarTelefone4: !!contato.ativar_telefone4,

    // Informação Família
    totalPessoas: infoFamilia.total_pessoas ?? '',
    rendaFamiliar: infoFamilia.renda_familiar ?? '',
    criancas0a3: infoFamilia.criancas_0a3 ?? '',
    criancas4a6: infoFamilia.criancas_4a6 ?? '',
    criancas7a11: infoFamilia.criancas_7a11 ?? '',
    adolescentes12a18: infoFamilia.adolescentes_12a18 ?? '',
    adultos19a59: infoFamilia.adultos_19a59 ?? '',
    idosos60: infoFamilia.idosos_60 ?? '',
    pessoasComDoencasCronicas: infoFamilia.pessoas_com_deficiencia_cronica ?? '',
    gestantes: infoFamilia.gestantes ?? '',
    pessoasImigrantes: infoFamilia.pessoas_imigrantes ?? '',
    nacionalidadesSelecionadas: Array.isArray(infoFamilia.nacionalidades_selecionadas) ? infoFamilia.nacionalidades_selecionadas : [],
    numerosPorPais: infoFamilia.numeros_por_pais ?? [],

    // Situação e uso
    regime_ocupacao: situacaoUso.regime_ocupacao ?? '',
    valor_locacao: situacaoUso.valor_locacao ?? '',
    nsi_valor_locacao: !!situacaoUso.nsi_valor_locacao,
    contrato_locacao: situacaoUso.contrato_locacao ?? '',
    nome_proprietario: situacaoUso.nome_proprietario ?? '',
    contato_proprietario: situacaoUso.contato_proprietario ?? '',
    nsi_contato_proprietario: !!situacaoUso.nsi_contato_proprietario,
    documentoComprovacao: situacaoUso.documento_comprovacao ?? '',
    descricaoDocumento: situacaoUso.descricao_documento ?? '',
    nome_proprietario_cedida: situacaoUso.nome_proprietario_cedida ?? '',
    telefone_proprietario_cedida: situacaoUso.telefone_proprietario_cedida ?? '',
    tempoMoradiaAnos: situacaoUso.tempo_moradia_anos ?? '',
    tempoMoradiaMeses: situacaoUso.tempo_moradia_meses ?? '',
    tempoMoradiaNaoSabe: situacaoUso.tempo_moradia_naosabe ? 'sim' : '',
    tempoMoradiaNaoSabe1: situacaoUso.tempo_moradia_naosabe1 ? 'sim' : '',
    cozinhaCompartilhada: situacaoUso.cozinha_compartilhada ? 'sim' : '',
    banheiroCompartilhado: situacaoUso.banheiro_compartilhado ? 'sim' : '',
    separaResiduos: situacaoUso.separa_residuos ?? '',
    destinoReciclavel: situacaoUso.destino_reciclavel ?? '',
    outroDestinoReciclavel: situacaoUso.outro_destino_reciclavel ?? '',
    destinoOrganico: situacaoUso.destino_organico ?? '',
    outroDestinoOrganico: situacaoUso.outro_destino_organico ?? '',
    destinoDomestico: situacaoUso.destino_domestico ?? '',
    outroDestinoDomestico: situacaoUso.outro_destino_domestico ?? '',

    // Documentação
    cidade: doc.cidade || '',
    cpf: doc.cpf || '',
    dataExpedicaoRg: toBrDate(doc.data_emissao_rg),
    dataExpedicaoCIN: toBrDate(doc.data_expedicao_cin),
    dataExpedicaoCrnm: toBrDate(doc.data_expedicao_crnm),
    dataExpedicaoPassaporte: toBrDate(doc.data_expedicao_passaporte),
    dataExpedicaoRnm: toBrDate(doc.data_expedicao_rnm),
    documentacao: doc.documentacao || '',
    estadoEmissaoRg: doc.estado_emissao_rg || '',
    fonteCpf: doc.fonte_cpf || '',
    cin: doc.numero_cin ? String(doc.numero_cin) : '',
    numeroCrnm: doc.numero_crnm || '',
    numeroPassaporte: doc.numero_passaporte || '',
    numeroProtocolo: doc.numero_protocolo || '',
    numeroRnm: doc.numero_rnm || '',
    orgaoExpedidor: doc.orgao_expedidor || '',
    paisOrigem: doc.pais_origem || '',
    possui_cin: doc.possui_cin ? 'sim' : '',
    rg: doc.rg || '',
    statusCrnm: doc.status_crnm || '',
    statusRnm: doc.status_rnm || '',
    uf: doc.uf || '',

    //Identidade Étnico-Racial e de Gênero
    etnicoRacial: etnicoRacial.etnico_racial,
    genero: etnicoRacial.genero,
    generoOutro: etnicoRacial.genero_outro,

    //Nupcialidade
    estadoCivil: nup.estado_civil ,
    nomeCompanheiro: nup.nome_companheiro ,
    viveComCompanheiro: nup.vive_com_companheiro ? 'sim' : '',

    //Outras informações relevantes
   // texto: outrasInf.texto,

    // Pessoa com deficiência
    tecnologiaAssistiva: pessoaDef.utiliza_tecnologia_assistida ? 'sim' : '',
    responsavelPossuiLaudo: pessoaDef.possui_laudo || '',
    responsavelTemDeficiencia: pessoaDef.responsavel_tem_deficiencia ? 'sim' : '',
    temPessoaDeficienciaFam: pessoaDef.tem_deficiencia ? 'sim' : '',

    aparelhoAuditivo: !!pessoaDef.aparelho_auditivo,
    bengalaBrancaOuVerdeVermelha: !!pessoaDef.bengala_branca_ou_verde_vermelha,
    brailleEquipSinteseVoz: !!pessoaDef.braille_equip_sintese_voz,
    cadeiraRoda: !!pessoaDef.cadeira_de_roda,
    camaHospitalar: !!pessoaDef.cama_hospitalar,
    caoGuia: !!pessoaDef.cao_guia,
    defAuditiva: !!pessoaDef.def_auditiva,
    defFisica: !!pessoaDef.def_fisica,
    defIntelectualMental: !!pessoaDef.def_intelectual_mental,
    defMobilidadeReduzida: !!pessoaDef.def_mobilidade_reduzida,
    defMultiplas: !!pessoaDef.def_multiplas,
    defOutra: !!pessoaDef.def_outra,
    defSurdoCegueira: !!pessoaDef.def_surdo,
    defVisual: !!pessoaDef.def_visual,
    especifiqueOutras: pessoaDef.especifique_outra_def || '',
    especifiqueOutraTecAssistiva: pessoaDef.especifique_outra_tec_assistida || '',
    leituraFacialLabial: !!pessoaDef.leitura_facial_labial,
    libras: !!pessoaDef.libras,
    lupaLenteFontaAmpliada: !!pessoaDef.lupa_lente_fonte_ampliada,
    muletaBengala4pontasAndador: !!pessoaDef.muleta_bengala4pontas_andador,
    ortesesProteses: !!pessoaDef.ortese_protese,
    outrasTecAssistiva: !!pessoaDef.outras_tec_assistiva,
    pranchaComunicacaoAlternativa: !!pessoaDef.prancha_comunicacao_alternativa,

    quantAuditiva: pessoaDef.qtd_def_auditiva ?? 0,
    quantFisica: pessoaDef.qtd_def_fisica ?? 0,
    quantIntelectual: pessoaDef.qtd_def_intelectual_mental ?? 0,
    quantMobilidade: pessoaDef.qtd_def_mobilidade_reduzida ?? 0,
    quantMultiplas: pessoaDef.qtd_def_multiplas ?? 0,
    quantSurdo: pessoaDef.qtd_def_surdo ?? 0,
    quantVisual: pessoaDef.qtd_def_visual ?? 0,

    responsavelAparelhoAuditivo: !!pessoaDef.responsavel_aparelho_auditivo,
    responsavelBnglBranOuVerdVerm: !!pessoaDef.responsavel_bengala_branca_ou_verde_vermelha,
    responsavelBrailleEquipSinteseVoz: !!pessoaDef.responsavel_braille_equip_sintese_voz,
    responsavelCadeiraRoda: !!pessoaDef.responsavel_cadeira_de_roda,
    responsavelCamaHospitalar: !!pessoaDef.responsavel_cama_hospitalar,
    responsavelCaoGuia: !!pessoaDef.responsavel_cao_guia,
    responsavelPranchaComAlt: !!pessoaDef.responsavel_prancha,
    responsavelDefAuditiva: !!pessoaDef.responsavel_def_auditiva,
    responsavelDefFisica: !!pessoaDef.responsavel_def_fisica,
    responsavelDefIntelectual: !!pessoaDef.responsavel_def_intelectual,
    responsavelDefMobilidade: !!pessoaDef.responsavel_def_mobilidade,
    responsavelDefMultipla: !!pessoaDef.responsavel_def_multipla,
    responsavelDefOutra: !!pessoaDef.responsavel_def_outra,
    responsavelDefSurdoCegueira: !!pessoaDef.responsavel_def_surdo_cegueira,
    responsavelDefVisual: !!pessoaDef.responsavel_def_visual,
    responsavelLeituraFacialLabial: !!pessoaDef.responsavel_leitura_facial_labial,
    responsavelLibras: !!pessoaDef.responsavel_libras,
    responsavelLupaLenteFontaAmpliada: !!pessoaDef.responsavel_lupa_lente_fonte_ampliada,
    responsavelMuletaBengala4pontasAndador: !!pessoaDef.responsavel_muleta_bengala4pontas_andador,
    responsavelOrteseProtese: !!pessoaDef.responsavel_ortese_protese,
    responsavelOutraTecAssistiva: !!pessoaDef.responsavel_outra_tec_assistiva,
  }
}

export function mapArrolamentoToFormData(api: ArrolamentoApiData) {
  const survey = api?.survey || {}
  const forms = Array.isArray(survey?.forms) ? survey.forms : []

  const families = forms.length > 0
    ? forms.map((f: any) => mapFamilyFormToFields(f))
    : [mapFamilyFormToFields({})]

  return {
    questionario: api?.created_by || 'SEHAB-123',
    seiNumber: survey?.main_metadata?.numero_sei || '',
    sealNumber: survey?.main_metadata?.numero_selo || '',
    numberFamilies: Number(survey?.main_metadata?.quantidade_familias ?? families.length ?? 1),
    visitNumber: api?.visit_count != null ? String(api.visit_count) : '',
    firstVisitStart: '',
    firstVisitEnd: '',
    secondVisit: '',
    thirdVisit: '',
    interviewDate: '',
    startTime: '',
    endTime: '',
    timeElapsed: '',
    families,
  }
} 