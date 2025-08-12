export type ArrolamentoApiData = any

function toBrDate(isoOrBr?: string): string {
  if (!isoOrBr) return ''
  // If already DD/MM/YYYY, return
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoOrBr)) return isoOrBr
  // Try YYYY-MM-DD
  const m = isoOrBr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  return isoOrBr
}

export function mapArrolamentoToFormData(api: ArrolamentoApiData) {
  const survey = api?.survey || {}
  const forms = Array.isArray(survey?.forms) ? survey.forms : []
  const firstForm = forms[0] || {}

  const ident = firstForm.identificacao_responsavel || {}
  const infoFamilia = firstForm.informacao_familia || {}
  const contato = firstForm.contato || {}
  const situacaoUso = firstForm.situacao_uso || {}
  const etnico = firstForm.identificacao_etnico_racial || {}

  const families0: Record<string, any> = {
    // Identificação do responsável
    responsavel: ident.responsavel === true ? 'sim' : ident.responsavel === false ? 'nao' : '',
    nomeCompletoResp: ident.nome_completo || '',
    dataNascimentoResp: toBrDate(ident.data_nascimento),
    relacaoResponsavel: ident.relacao_social || '',
    DescrevParentesco: ident.descrev_parentesco || '',
    nomeSocialEntrevistado: ident.nome_social || '',
    naoSeAplicaEntrevistado: ident.nome_social_aplicavel === false ? true : false,

    // Contato (mapeamento básico)
    email: contato.email || '',
    naoSabeEmail: !!contato.nao_sabe_email,

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

    // Situação e uso (básico)
    regime_ocupacao: situacaoUso.regime_ocupacao ?? '',
    valor_locacao: situacaoUso.valor_locacao ?? '',
    nsi_valor_locacao: !!situacaoUso.nsi_valor_locacao,

    // Étnico-racial (básico)
    etnicoRacial: etnico.etnico_racial ?? '',
    genero: etnico.genero ?? '',
    generoOutro: etnico.genero_outro ?? '',
  }

  return {
    questionario: api?.created_by || 'SEHAB-123',
    seiNumber: survey?.main_metadata?.numero_sei || '',
    sealNumber: survey?.main_metadata?.numero_selo || '',
    numberFamilies: Number(survey?.main_metadata?.quantidade_familias ?? 1),
    visitNumber: api?.visit_count != null ? String(api.visit_count) : '',
    firstVisitStart: '',
    firstVisitEnd: '',
    secondVisit: '',
    thirdVisit: '',
    interviewDate: '',
    startTime: '',
    endTime: '',
    timeElapsed: '',
    families: [families0],
  }
} 