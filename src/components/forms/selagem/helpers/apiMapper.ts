import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"
import Swal from 'sweetalert2'

// Tipos para o mapeamento
export interface SelagemApiData {
  id: string
  survey_id: string
  created_by: string
  visit_count: number
  created_at: string
  completed_at?: string
  survey: {
    main_metadata: any
    identificacao_espaco_habitado: any
    identificacao_unidade: any
    situacao_uso_unidade: any
    caracteristicas_unidade: any
    caracteristicas_infra_urbana: any
    outras_informacoes: any
    status_notas: any
  }
  attachments: string[]
}

export interface LoadSelagemDataParams {
  selagemId: string
  setIsLoadingData: (loading: boolean) => void
  setLoadedSelagemData: (data: any) => void
  form: {
    reset: (data: any) => void
  }
  interviewerNameFromStorage: string
}

// Mock de dados para teste quando a API não estiver disponível
export const getMockSelagemData = (id: string): { selagens: SelagemApiData[] } => {
  const mockData = {
    selagens: [{
      id: id,
      survey_id: "survey_mock_001",
      created_by: "João Silva (Mock)",
      visit_count: 1,
      created_at: "2024-01-15T10:30:00Z",
      completed_at: "2024-01-15T12:30:00Z",
      survey: {
        main_metadata: {
          numero_sei: "SEI123456789",
          numero_sei_nao_aplicavel: false
        },
        identificacao_espaco_habitado: {
          nome_espaco_habitado: "Comunidade Teste",
          selo_setor: "ST001",
          selo_lote: "LT001", 
          selo_unidade: "UN001",
          selo_complemento: "COMP001",
          numero_selo: "SELO123"
        },
        identificacao_unidade: {
          cep: "05422-001",
          logradouro: "Rua das Flores, 123",
          numero: "123",
          bairro: "Butantã",
          complemento: "Apto 45",
          uf: "SP",
          cidade: "São Paulo",
          subprefeitura: "Butantã",
          distrito: "Butantã"
        },
        situacao_uso_unidade: {
          situacao: "Ocupado",
          uso: "Residencial",
          qual_uso: "Habitação unifamiliar",
          tipos_uso: "Residencial",
          nome_responsavel: "Maria Silva",
          telefone_responsavel: "(11) 99999-9999",
          responsavel_identificado: true,
          uso_terreno: "Habitacional"
        },
        caracteristicas_unidade: {
          numero_comodos: "3",
          numero_pavimentos: "1",
          numero_sanitarios: "1"
        },
        outras_informacoes: {
          texto: "Casa em bom estado de conservação. Família colaborativa."
        },
        status_notas: {
          status: "Concluida",
          justificativa: "Pesquisa realizada com sucesso",
          nome_supervisor: "Carlos Supervisor",
          observacao: "Dados coletados conforme protocolo"
        },
        caracteristicas_infra_urbana: {
          material_parede: "Alvenaria",
          descricao_material: "Tijolo comum com reboco",
          insalubridade: "Não",
          pe_direito: "Adequado",
          iluminacao_natural: "Adequada",
          janelas_externas: "Sim",
          infiltracao_mofo: "Não",
          cozinha: "Adequada",
          descricao_cozinha: "Boa ventilação e iluminação",
          banheiro: "Adequado",
          descricao_banheiro: "Ventilação natural presente",
          demais_comodos: "Adequados",
          descricao_demais_comodos: "Todos com ventilação adequada",
          abastecimento_agua: "Rede pública",
          outro_abastecimento_agua: "",
          esgotamento_sanitario: "Rede pública",
          outro_esgoto: "",
          ligacao_eletrica: "Ligação regular",
          descricao_ligacao_eletrica: "Ligação oficial da concessionária"
        }
      },
      attachments: [
        "anexo_selo_12345.jpg",
        "anexo_fachada_12345.jpg", 
        "anexo_morador_12345.jpg",
        "anexo_outros_12345.pdf"
      ]
    }]
  }
  return mockData
}

// Função para mapear dados da API para o formato do formulário
export const mapSelagemToFormData = (selagemData: SelagemApiData, interviewerNameFromStorage: string): any => {
  const survey = selagemData.survey || {}
  const mainMetadata = survey.main_metadata || {}
  const identEspaco = survey.identificacao_espaco_habitado || {}
  const identUnidade = survey.identificacao_unidade || {}
  const situUso = survey.situacao_uso_unidade || {}
  const caractUnidade = survey.caracteristicas_unidade || {}
  const infraUrbana = survey.caracteristicas_infra_urbana || {}
  const outrasInfo = survey.outras_informacoes || {}
  const statusNotas = survey.status_notas || {}
  const anexosData = selagemData.attachments || []

  return {
    questionario: selagemData.survey_id || "SEHAB-123",
    seiNumber: mainMetadata.numero_sei || "",
    naoAplica: Boolean(mainMetadata.numero_sei_nao_aplicavel),
    interviewerName: selagemData.created_by || interviewerNameFromStorage,
    interviewDate: selagemData.created_at ? new Date(selagemData.created_at).toISOString().split('T')[0] : "",
    startTime: "",
    endTime: "",
    timeElapsed: "",
    sealNumber: identEspaco.numero_selo || "",
    numberFamilies: 1,
    firstVisitStart: selagemData.created_at ? new Date(selagemData.created_at).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' -') : "",
    firstVisitEnd: selagemData.completed_at ? new Date(selagemData.completed_at).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' -') : "",
    secondVisit: "",
    thirdVisit: "",
    visitNumber: selagemData.visit_count != null ? String(selagemData.visit_count) : "",
    families: [{
      // Identificação Espaço Habitado (schema: identEspacoHabitadoSchema)
      nomeEspacoHabitado: identEspaco.nome_espaco_habitado || "",
      identificacaoSeloSetor: identEspaco.selo_setor || "",
      identificacaoSeloLote: identEspaco.selo_lote || "",
      identificacaoSeloUnidade: identEspaco.selo_unidade || "",
      identificacaoSeloComplemento: identEspaco.selo_complemento || "",
      numeroSelo: identEspaco.numero_selo || "",
      
      // Identificação Unidade (schema: identUnidadeSchema)
      cep: identUnidade.cep || "",
      logradouro: identUnidade.logradouro || "",
      numero: identUnidade.numero || "",
      bairro: identUnidade.bairro || "",
      complemento: identUnidade.complemento || "",
      uf: identUnidade.uf || "",
      cidade: identUnidade.cidade || "",
      subPrefeitura: identUnidade.subprefeitura || "",
      distrito: identUnidade.distrito || "",
      
      // Situação Uso Unidade (schema: situUsoUniSchema)
      situacaoUsoUnidade: situUso.situacao || "",
      usoUnidade: situUso.uso_unidade || "",
      qualUso: situUso.qual_uso || "",
      quaisTipos: situUso.tipos_uso || "",
      nome_responsavel: situUso.nome_responsavel || "",
      telefone_responsavel: situUso.telefone_responsavel || "",
      responsavel_nao_identificado: situUso.responsavel_identificado || false,
      uso_terreno: situUso.uso_terreno || "",
      uso: situUso.uso || "",
      
      // Características Unidade (schema: caractUnidadeSchema)
      numeroComodos: caractUnidade.numero_comodos || "",
      numeroPavimentos: caractUnidade.numero_pavimentos || "",
      numeroSanitarios: caractUnidade.numero_sanitarios || "",
      
      // Status e Notas (schema: statusNotasSchema)
      status: statusNotas.status || "",
      justificativa: statusNotas.justificativa || "",
      nomeSupervisor: statusNotas.nome_supervisor || "",
      observacao: statusNotas.observacao || "",
      
      // Outras Informações (schema: outrasInfoRelevantesSchema)
      outrasInformacoes: outrasInfo.texto || "",
      
      // Características Infraestrutura Urbana (schema: caracInfraUrbUnidSchema)
      materialPredominante: infraUrbana.material_parede || "",
      outroMaterialPredominante: infraUrbana.descricao_material || "",
      unidadeInsalubre: infraUrbana.insalubridade || "",
      peDireitoAtendente230: infraUrbana.pe_direito || "",
      iluminicaoNatural: infraUrbana.iluminacao_natural || "",
      areaVentilacao: infraUrbana.janelas_externas || "",
      infiltracaoMofo: infraUrbana.infiltracao_mofo || "",
      cozinhaVentilacaoNatural: infraUrbana.cozinha || "",
      cozinhaSalubridade: infraUrbana.descricao_cozinha || "",
      banheiroVentilacaoNatural: infraUrbana.banheiro || "",
      banheiroSalubridade: infraUrbana.descricao_banheiro || "",
      demaisComodosVentilacaoNatural: infraUrbana.demais_comodos || "",
      demaisComodosSalubridade: infraUrbana.descricao_demais_comodos || "",
      abastecimentoAgua: infraUrbana.abastecimento_agua || "",
      outroAbastecimentoAgua: infraUrbana.outro_abastecimento_agua || "",
      esgotamentoSanitario: infraUrbana.esgotamento_sanitario || "",
      outroEsgotamentoSanitario: infraUrbana.outro_esgoto || "",
      ligacaoEletrica: infraUrbana.ligacao_eletrica || "",
      outroLigacaoEletrica: infraUrbana.descricao_ligacao_eletrica || "",
      
      // Anexos (schema: anexosSchema)
      anexoSelo: anexosData.length > 0 ? anexosData[0] || "" : "",
      anexoFachada: anexosData.length > 1 ? anexosData[1] || "" : "",
      anexoMorador: anexosData.length > 2 ? anexosData[2] || "" : "",
      anexoOutros: anexosData.length > 3 ? anexosData[3] || "" : "",
    }]
  }
}

// Função para buscar dados da selagem na API
export const loadSelagemData = async (params: LoadSelagemDataParams): Promise<void> => {
  const { selagemId, setIsLoadingData, setLoadedSelagemData, form, interviewerNameFromStorage } = params

  if (!selagemId) return

  setIsLoadingData(true)
  try {
    console.log("🔍 Buscando dados da selagem:", selagemId)
    
    const response = await survey_resource.GetSelagem(
      { id: selagemId },
      async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }

        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
        const res = await fetch(url, {
          method: req.method,
          headers: {
            "Content-Type": "application/json",
            ...(req.headers || {}),
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        return res.json()
      }
    )

    console.log("📊 Dados recebidos da API:", response)
    
    // Type guard para validar se o response é válido
    if (response && 'selagens' in response && Array.isArray(response.selagens) && response.selagens.length > 0) {
      const selagemData = response.selagens[0]
      setLoadedSelagemData(selagemData)
      
      // Mapear os dados para o formato do formulário (TODOS os 8 schemas)
      const mappedData = mapSelagemToFormData(selagemData, interviewerNameFromStorage)
      console.log("🗂️ Dados mapeados para o formulário (8/8 schemas):", mappedData)
      
      // Preencher o formulário com os dados carregados
      form.reset(mappedData)
      
      Swal.fire({
        icon: 'success',
        title: 'Dados Carregados!',
        text: `Selagem ${selagemData.survey_id ?? selagemId} carregada com sucesso`,
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      throw new Error("Selagem não encontrada")
    }
  } catch (error) {
    console.error("❌ Erro ao carregar selagem da API, tentando mock:", error)
    
    // Usar dados mockados como fallback
    try {
      console.log("🎭 Usando dados mockados para teste...")
      const mockResponse = getMockSelagemData(selagemId)
      
      if (mockResponse && mockResponse.selagens && mockResponse.selagens.length > 0) {
        const selagemData = mockResponse.selagens[0]
        setLoadedSelagemData(selagemData)
        
        const mappedData = mapSelagemToFormData(selagemData, interviewerNameFromStorage)
        console.log("🗂️ Dados mockados mapeados (8/8 schemas):", mappedData)
        
        form.reset(mappedData)
        
        Swal.fire({
          icon: 'info',
          title: 'Dados Mock Carregados!',
          text: `Selagem ${selagemData.survey_id ?? selagemId} carregada com dados de teste (API indisponível)`,
          timer: 3000,
          showConfirmButton: false
        })
      }
    } catch (mockError) {
      console.error("❌ Erro ao usar dados mockados:", mockError)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao Carregar',
        text: `Não foi possível carregar a selagem nem usar dados de teste`,
        confirmButtonText: 'OK'
      })
    }
  } finally {
    setIsLoadingData(false)
  }
}
