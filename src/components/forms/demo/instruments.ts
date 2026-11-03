import type { DemoInstrumentType } from "@/lib/demo-form-records"

export type DemoInstrumentField = {
  name: string
  label: string
  type?: "text" | "number" | "date" | "select" | "textarea"
  required?: boolean
  options?: string[]
}

export type DemoInstrumentSection = {
  id: string
  title: string
  fields: DemoInstrumentField[]
}

export type DemoInstrumentDefinition = {
  id: DemoInstrumentType
  title: string
  description: string
  listPath: string
  sections: DemoInstrumentSection[]
}

export const naoResidencialInstrument: DemoInstrumentDefinition = {
  id: "nao-residencial",
  title: "Não Residencial",
  description: "Levantamento de imóvel, atividade econômica e condições de ocupação não residencial.",
  listPath: "/lista-nao-residenciais",
  sections: [
    {
      id: "identificacao-pesquisa",
      title: "Identificação da pesquisa",
      fields: [
        { name: "numeroSei", label: "Número SEI", required: true },
        { name: "numeroSelo", label: "Número do selo" },
        { name: "dataLevantamento", label: "Data do levantamento", type: "date", required: true },
        { name: "nomeEntrevistador", label: "Entrevistador(a)", required: true },
      ],
    },
    {
      id: "identificacao-imovel",
      title: "Identificação do imóvel",
      fields: [
        { name: "nomeEstabelecimento", label: "Nome fantasia ou identificação do estabelecimento", required: true },
        { name: "sql", label: "Número do contribuinte (SQL), se disponível" },
        { name: "tipoImovel", label: "Tipo de imóvel", type: "select", required: true, options: ["Loja", "Sala ou conjunto", "Galpão", "Edificação de uso misto", "Equipamento institucional", "Outro"] },
        { name: "cep", label: "CEP" },
        { name: "logradouro", label: "Logradouro", required: true },
        { name: "numero", label: "Número", required: true },
        { name: "complemento", label: "Complemento" },
        { name: "bairro", label: "Bairro", required: true },
        { name: "distrito", label: "Distrito" },
        { name: "subprefeitura", label: "Subprefeitura" },
      ],
    },
    {
      id: "atividade-economica",
      title: "Uso e atividade não residencial",
      fields: [
        { name: "tipoAtividade", label: "Tipo de atividade", type: "select", required: true, options: ["Comércio", "Serviços", "Indústria ou produção", "Institucional ou equipamento público", "Religiosa", "Depósito ou armazenamento", "Outra"] },
        { name: "atividadePrincipal", label: "Atividade principal exercida", required: true },
        { name: "cnae", label: "CNAE, se informado pelo responsável" },
        { name: "situacaoOcupacao", label: "Situação atual do imóvel", type: "select", required: true, options: ["Em funcionamento", "Fechado temporariamente", "Desocupado", "Em implantação", "Interditado", "Em reforma"] },
        { name: "areaUtil", label: "Área ocupada aproximada (m²)", type: "number" },
        { name: "quantidadeTrabalhadores", label: "Trabalhadores no local (aproximado)", type: "number" },
      ],
    },
    {
      id: "responsavel-estabelecimento",
      title: "Responsável e contato",
      fields: [
        { name: "razaoSocial", label: "Razão social, se houver" },
        { name: "cnpj", label: "CNPJ, se informado" },
        { name: "responsavel", label: "Nome do responsável presente no local", required: true },
        { name: "telefone", label: "Telefone de contato" },
        { name: "email", label: "E-mail" },
        { name: "vinculoImovel", label: "Vínculo com o imóvel", type: "select", options: ["Proprietário", "Locatário", "Permissionário", "Responsável pela atividade", "Outro", "Não informado"] },
      ],
    },
    {
      id: "caracteristicas-edificacao",
      title: "Características da edificação",
      fields: [
        { name: "areaConstruida", label: "Área construída aproximada (m²)", type: "number" },
        { name: "pavimentos", label: "Pavimentos da edificação", type: "number" },
        { name: "tipoConstrucao", label: "Tipo construtivo predominante", type: "select", options: ["Alvenaria", "Concreto", "Metálica", "Madeira", "Mista", "Outro", "Não identificado"] },
        { name: "estadoConservacao", label: "Estado aparente de conservação", type: "select", options: ["Bom", "Regular", "Precário", "Ruim", "Não avaliado"] },
      ],
    },
    {
      id: "observacoes-nao-residencial",
      title: "Observações e registro da visita",
      fields: [
        { name: "observacoes", label: "Observações do levantamento", type: "textarea" },
        { name: "referenciaLocalizacao", label: "Ponto de referência", type: "textarea" },
      ],
    },
  ],
}

export const ocupacaoPredialInstrument: DemoInstrumentDefinition = {
  id: "ocupacao-predial",
  title: "Ocupação Predial",
  description: "Levantamento da edificação, das unidades existentes e das condições de ocupação.",
  listPath: "/lista-ocupacao-predial",
  sections: [
    {
      id: "identificacao-levantamento",
      title: "Identificação do levantamento",
      fields: [
        { name: "numeroSei", label: "Número SEI", required: true },
        { name: "numeroSelo", label: "Número do selo ou identificação local" },
        { name: "dataLevantamento", label: "Data do levantamento", type: "date", required: true },
        { name: "nomeEntrevistador", label: "Entrevistador(a)", required: true },
      ],
    },
    {
      id: "identificacao-edificacao",
      title: "Identificação e localização da edificação",
      fields: [
        { name: "nomePredio", label: "Nome ou identificação local da edificação", required: true },
        { name: "sql", label: "Número do contribuinte (SQL), se disponível" },
        { name: "cep", label: "CEP" },
        { name: "logradouro", label: "Logradouro", required: true },
        { name: "numero", label: "Número", required: true },
        { name: "complemento", label: "Complemento" },
        { name: "bairro", label: "Bairro", required: true },
        { name: "distrito", label: "Distrito" },
        { name: "subprefeitura", label: "Subprefeitura" },
      ],
    },
    {
      id: "caracteristicas-edificacao",
      title: "Características físicas",
      fields: [
        { name: "tipoEdificacao", label: "Tipologia predominante", type: "select", required: true, options: ["Casa", "Edifício de apartamentos", "Conjunto habitacional", "Cortiço ou moradia coletiva", "Galpão", "Edificação de uso misto", "Equipamento institucional", "Outra"] },
        { name: "usoPredominante", label: "Uso predominante", type: "select", required: true, options: ["Residencial", "Não residencial", "Misto", "Desocupado", "Em construção", "Outro"] },
        { name: "areaTerreno", label: "Área aproximada do terreno (m²)", type: "number" },
        { name: "areaConstruida", label: "Área construída aproximada (m²)", type: "number" },
        { name: "pavimentos", label: "Quantidade de pavimentos", type: "number" },
        { name: "tipoConstrucao", label: "Tipo construtivo predominante", type: "select", options: ["Alvenaria", "Concreto", "Metálica", "Madeira", "Mista", "Outro", "Não identificado"] },
        { name: "estadoConservacao", label: "Estado aparente de conservação", type: "select", options: ["Bom", "Regular", "Precário", "Ruim", "Não avaliado"] },
      ],
    },
    {
      id: "unidades-e-ocupacao",
      title: "Unidades e situação de ocupação",
      fields: [
        { name: "quantidadeUnidades", label: "Quantidade total de unidades", type: "number", required: true },
        { name: "unidadesOcupadas", label: "Unidades ocupadas", type: "number" },
        { name: "unidadesVazias", label: "Unidades vazias", type: "number" },
        { name: "quantidadeFamilias", label: "Famílias ou domicílios identificados", type: "number" },
        { name: "quantidadeMoradores", label: "Moradores identificados (aproximado)", type: "number" },
        { name: "situacaoOcupacao", label: "Situação geral da ocupação", type: "select", required: true, options: ["Totalmente ocupada", "Parcialmente ocupada", "Desocupada", "Em construção", "Interditada", "Não identificada"] },
        { name: "dataInicioOcupacao", label: "Período aproximado de início da ocupação" },
      ],
    },
    {
      id: "infraestrutura-e-risco",
      title: "Infraestrutura e condições observadas",
      fields: [
        { name: "abastecimentoAgua", label: "Abastecimento de água", type: "select", options: ["Rede pública", "Poço ou nascente", "Compartilhado", "Outro", "Não informado"] },
        { name: "esgotamentoSanitario", label: "Esgotamento sanitário", type: "select", options: ["Rede pública", "Fossa", "Compartilhado", "Sem ligação", "Outro", "Não informado"] },
        { name: "energiaEletrica", label: "Energia elétrica", type: "select", options: ["Ligação individual", "Ligação compartilhada", "Sem ligação", "Outro", "Não informado"] },
        { name: "coletaResiduos", label: "Coleta de resíduos", type: "select", options: ["Regular", "Irregular", "Ponto de descarte próximo", "Não informado"] },
        { name: "indicioRisco", label: "Há indício visível de risco ou insalubridade?", type: "select", options: ["Não observado", "Sim", "Não avaliado"] },
        { name: "descricaoRisco", label: "Descrever situação observada", type: "textarea" },
      ],
    },
    {
      id: "responsavel-observacoes",
      title: "Responsável e observações",
      fields: [
        { name: "responsavel", label: "Responsável ou representante presente" },
        { name: "telefone", label: "Telefone de contato" },
        { name: "observacoes", label: "Observações do levantamento", type: "textarea" },
        { name: "referenciaLocalizacao", label: "Ponto de referência", type: "textarea" },
      ],
    },
  ],
}
