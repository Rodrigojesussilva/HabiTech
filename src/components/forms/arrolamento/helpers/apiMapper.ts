export type ArrolamentoApiData = any

function toIsoDate(dateStr?: string): string {
  if (!dateStr) return "";

  // Se já estiver em formato ISO, retorna direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Converte "11/12/2019" → "2019-12-11"
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";

  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}


// Helper to map boolean from API to radio value in form
const boolToRadio = (value?: boolean | null): '' | 'sim' | 'nao' =>
  value === true ? 'sim' : value === false ? 'nao' : '';

function mapFamilyFormToFields(formEntry: any, rootOutrasInfo?: any, rootStatusNotas?: any): Record<string, any> {
  const ident = formEntry?.identificacao_responsavel || {}
  const infoFamilia = formEntry?.informacao_familia || {}
  const contato = formEntry?.contato || {}
  const situacaoUso = formEntry?.situacao_uso || {}
  const doc = formEntry?.documentacao || {}
  const etnicoRacial = formEntry?.identificacao_etnico_racial || {}
  const nup = formEntry?.nupcidade || {}
  const pessoaDef = formEntry?.pessoa_deficiente || {}
  //const outrasInf = formEntry?.outras_informacoes || {}


  const responsavelBack = doc.responsavel;
  // Aplica o fallback para 'não' caso o valor não seja verdadeiro (true)
  const responsavelCampo = responsavelBack === true ? 'sim' : 'nao';

  // Logs para depuração
  console.log('Valor do back doc.responsavel:', responsavelBack);
  console.log('Valor no campo responsavelCampo:', responsavelCampo);

  const perFamilyOutrasInfo = formEntry?.outras_informacoes || rootOutrasInfo || {}
  const perFamilyStatusNotas = formEntry?.status_notas || rootStatusNotas || {}

  console.log('pessoaDef.tem_deficiencia', pessoaDef.tem_deficiencia)
  console.log('pessoaDef.tem_deficiencia bool', boolToRadio(pessoaDef.tem_deficiencia))
  return {

    // Identificação do responsável
    responsavel: ident.responsavel === true ? 'sim' : 'nao',
    nomeCompletoResp: ident.nome_completo || '',
    dataNascimentoResp: toIsoDate(ident.data_nascimento),
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
    dataExpedicaoRg: toIsoDate(doc.data_emissao_rg),
    dataExpedicaoCIN: toIsoDate(doc.data_expedicao_cin),
    dataExpedicaoCrnm: toIsoDate(doc.data_expedicao_crnm),
    dataExpedicaoPassaporte: toIsoDate(doc.data_expedicao_passaporte),
    dataExpedicaoRnm: toIsoDate(doc.data_expedicao_rnm),
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
    possui_cin: doc.possui_cin === true ? 'sim' : 'nao',
    rg: doc.rg || '',
    statusCrnm: doc.status_crnm || '',
    statusRnm: doc.status_rnm || '',
    uf: doc.uf || '',

    //Identidade Étnico-Racial e de Gênero
    etnicoRacial: etnicoRacial.etnico_racial,
    genero: etnicoRacial.genero,
    generoOutro: etnicoRacial.genero_outro,

    //Nupcialidade
    estadoCivil: nup.estado_civil,
    nomeCompanheiro: nup.nome_companheiro,
    viveComCompanheiro: nup.vive_com_companheiro ? 'sim' : '',

    //Outras informações relevantes (do nível raiz do survey)
    texto: perFamilyOutrasInfo?.texto || '',

    // Pessoa com deficiência
    tecnologiaAssistiva: boolToRadio(pessoaDef.utiliza_tecnologia_assistida),
    responsavelPossuiLaudo: boolToRadio(pessoaDef.possui_laudo),
    responsavelTemDeficiencia: boolToRadio(pessoaDef.responsavel_tem_deficiencia),
    temPessoaDeficienciaFam: boolToRadio(pessoaDef.tem_deficiencia),
    
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

    // Status e Notas (do nível raiz do survey)
    status: perFamilyStatusNotas?.status || '',
    justificativa: perFamilyStatusNotas?.justificativa || '',
    nomeSupervisor: perFamilyStatusNotas?.nome_supervisor || '',
    observacao: perFamilyStatusNotas?.observacao || '',
  }
}

export function mapArrolamentoToFormData(api: ArrolamentoApiData, interviewerNameFromStorage: string) {
  const survey = api?.survey || {}
  const forms = Array.isArray(survey?.forms) ? survey.forms : []
  const rootOutrasInfo = (survey?.outras_informacoes ?? {})
  const rootStatusNotas = survey?.status_notas || {}

  const families = forms.length > 0
    ? forms.map((f: any) => mapFamilyFormToFields(f, rootOutrasInfo, rootStatusNotas))
    : [mapFamilyFormToFields({}, rootOutrasInfo, rootStatusNotas)]

  // Calcula duração em horas entre início e fim (ou agora, se fim ausente)
  const computeVisitDurationHours = (createdAtIso?: string, completedAtIso?: string): string => {
    try {
      if (!createdAtIso) return "";
      const start = new Date(createdAtIso);
      const end = completedAtIso ? new Date(completedAtIso) : new Date();
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
      let diffMs = end.getTime() - start.getTime();
      if (diffMs < 0) diffMs = 0;
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hh = Math.floor(totalMinutes / 60);
      const mm = totalMinutes % 60;
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    } catch { return ""; }
  }

  return {
    questionario: api?.survey_id || 'SEHAB-123',
    seiNumber: (survey?.main_metadata?.numero_sei === '999999' || survey?.main_metadata?.numero_sei_nao_aplicavel)
      ? '999999'
      : (survey?.main_metadata?.numero_sei || ''),
    naoAplica: Boolean(survey?.main_metadata?.numero_sei_nao_aplicavel) || survey?.main_metadata?.numero_sei === '999999',
    sealNumber: survey?.main_metadata?.numero_selo || '',
    numberFamilies: Number(survey?.main_metadata?.quantidade_familias ?? families.length ?? 1),
    visitNumber: api?.visit_count != null ? String(api.visit_count) : '',
    interviewerName: api?.created_by || interviewerNameFromStorage,
    interviewDate: api?.created_at ? new Date(api.created_at).toISOString().split('T')[0] : "",
    firstVisitStart: api?.created_at ? new Date(api.created_at).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' -') : "",
    firstVisitEnd: (() => {
      //const status = (survey?.status_notas?.status) as string | undefined
      const createdAt = api?.created_at
      const completedAt = api?.completed_at
     //if (!status) return ""
      if (createdAt && completedAt && new Date(completedAt) < new Date(createdAt)) return ""
      return completedAt
        ? new Date(completedAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric', 
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', ' -')
        : ""
    })(),
    secondVisit: '',
    thirdVisit: '',
    startTime: '',
    endTime: '',
    timeElapsed: '',
    visitDurationHours: computeVisitDurationHours(api?.created_at, api?.completed_at),
    families,
  }
} 