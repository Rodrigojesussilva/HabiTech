import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const regFundiariaSchema = z.object({
	// IDENTIFICAÇÃO DO DOMICÍLIO
	nucleoUrbano: z.string().optional(),
	quadra: z.string().optional(),
	lote: z.string().optional(),
	domicilio: z.string().optional(),
	empreendimentosBloco: z.string().optional(),
	empreendimentosPavimento: z.string().optional(),
	empreendimentosComplemento: z.string().optional(),
	endereco: z.string().optional(),
	numero: z.string().optional(),
	complemento: z.string().optional(),
	telefoneResidencial: z.string().optional(),
	telefoneCelular1: z.string().optional(),
	telefoneCelular2: z.string().optional(),
	telefoneRecado: z.string().optional(),
	email: z.string().optional(),

	// DADOS DO IMÓVEL
	quantidadeDomicilios: z.string().optional(),
	situacaoImovel: z.string().optional(),
	usoImovel: z.string().optional(),
	atividade: z.string().optional(),

	// REGIME DE OCUPAÇÃO DA MORADIA
	tipoOcupacao: z.string().optional(),
	documentoTPU: z.boolean().optional(),
	documentoContratoCompraVenda: z.boolean().optional(),
	documentoConcessaoUso: z.boolean().optional(),
	documentoAutorizacaoUso: z.boolean().optional(),
	documentoEscritura: z.boolean().optional(),
	documentoOutro: z.boolean().optional(),
	outroDocumento: z.string().optional(),
	naoPossuiDocumento: z.boolean().optional(),
	naoSabeInformar: z.boolean().optional(),
	proprietarioExclusivo: z.string().optional(),

	// FAMÍLIA
	tempoMoradia: z.string().optional(),
	numeroMoradores: z.string().optional(),
	atendimentoHabitacional: z.array(z.string()).optional(),
	outroAtendimento: z.string().optional(),
	acaoDespejo: z.string().optional(),
	rendaFamiliar: z.string().optional(),

	// RESPONSÁVEL/TITULAR 1
	nomeCompleto: z.string().optional(),
	nomeSocial: z.string().optional(),
	dataNascimento: z.string().optional(),
	naturalidade: z.string().optional(),
	uf: z.string().optional(),
	pais: z.string().optional(),
	nomePai: z.string().optional(),
	naoConstaPai: z.boolean().optional(),
	nomeMae: z.string().optional(),
	naoConstaMae: z.boolean().optional(),
	identidadeEtnica: z.string().optional(),
	identidadeGenero: z.string().optional(),
	deficiencia: z.string().optional(),
	tipoDeficienciaAuditivo: z.boolean().optional(),
	tipoDeficienciaVisual: z.boolean().optional(),
	tipoDeficienciaMotora: z.boolean().optional(),
	tipoDeficienciaMental: z.boolean().optional(),
	tipoDeficienciaMultipla: z.boolean().optional(),
	titularidade: z.string().optional(),
	parentescoChefe: z.string().optional(),
	rg: z.string().optional(),
	orgaoExpedidor: z.string().optional(),
	ufRg: z.string().optional(),
	dataExpedicao: z.string().optional(),
	naoPossuiRg: z.boolean().optional(),
	naoSabeRg: z.boolean().optional(),
	recusaInformarRg: z.boolean().optional(),
	cpf: z.string().optional(),
	rne: z.string().optional(),
	rneTipo: z.string().optional(),
	naoPossuiCpf: z.boolean().optional(),
	naoSabeCpf: z.boolean().optional(),
	recusaInformarCpf: z.boolean().optional(),
	nis: z.string().optional(),
	naoPossuiNis: z.boolean().optional(),
	estadoCivil: z.string().optional(),
	dataCasamento: z.string().optional(),
	nomeConjuge: z.string().optional(),
	regimeBens: z.string().optional(),
	situacaoFato: z.string().optional(),
	companheiro: z.string().optional(),
	uniaoConsensual: z.string().optional(),
	atividadeRemunerada: z.string().optional(),
	relacaoTrabalho: z.string().optional(),
	motivoNaoTrabalhar: z.string().optional(),
	profissao: z.string().optional(),

	// RESPONSÁVEL/TITULAR 2
	nomeCompleto2: z.string().optional(),
	nomeSocial2: z.string().optional(),
	dataNascimento2: z.string().optional(),
	naturalidade2: z.string().optional(),
	uf2: z.string().optional(),
	pais2: z.string().optional(),
	nomePai2: z.string().optional(),
	naoConstaPai2: z.boolean().optional(),
	nomeMae2: z.string().optional(),
	naoConstaMae2: z.boolean().optional(),
	identidadeEtnica2: z.string().optional(),
	identidadeGenero2: z.string().optional(),
	deficiencia2: z.string().optional(),
	tipoDeficienciaAuditivo2: z.boolean().optional(),
	tipoDeficienciaVisual2: z.boolean().optional(),
	tipoDeficienciaMotora2: z.boolean().optional(),
	tipoDeficienciaMental2: z.boolean().optional(),
	tipoDeficienciaMultipla2: z.boolean().optional(),
	titularidade2: z.string().optional(),
	parentescoChefe2: z.string().optional(),
	rg2: z.string().optional(),
	orgaoExpedidor2: z.string().optional(),
	ufRg2: z.string().optional(),
	dataExpedicao2: z.string().optional(),
	naoPossuiRg2: z.boolean().optional(),
	naoSabeRg2: z.boolean().optional(),
	recusaInformarRg2: z.boolean().optional(),
	cpf2: z.string().optional(),
	rne2: z.string().optional(),
	rneTipo2: z.string().optional(),
	naoPossuiCpf2: z.boolean().optional(),
	naoSabeCpf2: z.boolean().optional(),
	recusaInformarCpf2: z.boolean().optional(),
	nis2: z.string().optional(),
	naoPossuiNis2: z.boolean().optional(),
	estadoCivil2: z.string().optional(),
	dataCasamento2: z.string().optional(),
	nomeConjuge2: z.string().optional(),
	regimeBens2: z.string().optional(),
	situacaoFato2: z.string().optional(),
	companheiro2: z.string().optional(),
	uniaoConsensual2: z.string().optional(),
	atividadeRemunerada2: z.string().optional(),
	relacaoTrabalho2: z.string().optional(),
	motivoNaoTrabalhar2: z.string().optional(),
	profissao2: z.string().optional(),

	// DECLARAÇÕES
	local: z.string().optional(),
	data: z.string().optional(),
	assinaturaOcupante: z.string().optional(),


	// REGISTRO DE VISITAS
	primeiraVisita: z.string().optional(),
	primeiraConcluida: z.boolean().optional(),
	primeiraIncompleta: z.boolean().optional(),
	segundaVisita: z.string().optional(),
	segundaConcluida: z.boolean().optional(),
	segundaIncompleta: z.boolean().optional(),
	segundaMoradorAusente: z.boolean().optional(),
	terceiraVisita: z.string().optional(),
	terceiraConcluida: z.boolean().optional(),
	terceiraMoradorAusente: z.boolean().optional(),
	terceiraRecusa: z.boolean().optional(),
	entrevistado: z.string().optional(),
	entrevistadoConcluida: z.boolean().optional(),
	entrevistadoRecusa: z.boolean().optional(),
	posicaoFamilia: z.string().optional(),
	observacoes: z.string().optional(),

	// DOCUMENTAÇÃO RECOLHIDA
	copiasRG1: z.boolean().optional(),
	copiasCPF1: z.boolean().optional(),
	copiasCertidaoNascimento1: z.boolean().optional(),
	copiasCertidaoCasamentoObito1: z.boolean().optional(),
	copiasOutro1: z.boolean().optional(),
	copiasRG2: z.boolean().optional(),
	copiasCPF2: z.boolean().optional(),
	copiasCertidaoNascimento2: z.boolean().optional(),
	copiasCertidaoCasamentoObito2: z.boolean().optional(),
	copiasOutro2: z.boolean().optional(),
	docImovelContratoVendaCompra: z.boolean().optional(),
	docImovelContratoDoacao: z.boolean().optional(),
	docImovelTPU: z.boolean().optional(),
	docImovelCompromissoVendaCompra: z.boolean().optional(),
	docImovelContratoLocacao: z.boolean().optional(),
	docImovelConcessaoUso: z.boolean().optional(),
	docImovelContratoCessaoDireitos: z.boolean().optional(),
	docImovelContratoComodato: z.boolean().optional(),
	docImovelAutorizacaoUso: z.boolean().optional(),
	docImovelRecibosCompra: z.boolean().optional(),
	docImovelOutros: z.boolean().optional(),
	numeroMatricula: z.string().optional(),
	sri: z.string().optional(),

	// Replace array with individual boolean fields
	atendimentoPMSP: z.boolean().optional(),
	atendimentoCDHU: z.boolean().optional(),
	atendimentoCOHAB: z.boolean().optional(),
	atendimentoVerba: z.boolean().optional(),
	atendimentoNaoRecebeu: z.boolean().optional(),
	atendimentoOutro: z.boolean().optional(),
});

export type FormValues = z.infer<typeof regFundiariaSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
	nucleoUrbano: "",
	quadra: "",
	lote: "",
	domicilio: "",
	empreendimentosBloco: "",
	empreendimentosPavimento: "",
	empreendimentosComplemento: "",
	endereco: "",
	numero: "",
	complemento: "",
	telefoneResidencial: "",
	telefoneCelular1: "",
	telefoneCelular2: "",
	telefoneRecado: "",
	email: "",
	quantidadeDomicilios: "",
	situacaoImovel: "",
	usoImovel: "",
	atividade: "",
	tipoOcupacao: "",
	documentoTPU: false,
	documentoContratoCompraVenda: false,
	documentoConcessaoUso: false,
	documentoAutorizacaoUso: false,
	documentoEscritura: false,
	documentoOutro: false,
	outroDocumento: "",
	naoPossuiDocumento: false,
	naoSabeInformar: false,
	proprietarioExclusivo: "",
	tempoMoradia: "",
	numeroMoradores: "",
	atendimentoHabitacional: [],
	outroAtendimento: "",
	acaoDespejo: "",
	rendaFamiliar: "",
	atendimentoPMSP: false,
	atendimentoCDHU: false,
	atendimentoCOHAB: false,
	atendimentoVerba: false,
	atendimentoNaoRecebeu: false,
	atendimentoOutro: false,
	
	// Responsável/Titular 1
	nomeCompleto: "",
	nomeSocial: "",
	dataNascimento: "",
	naturalidade: "",
	uf: "",
	pais: "",
	nomePai: "",
	naoConstaPai: false,
	nomeMae: "",
	naoConstaMae: false,
	identidadeEtnica: "",
	identidadeGenero: "",
	deficiencia: "",
	tipoDeficienciaAuditivo: false,
	tipoDeficienciaVisual: false,
	tipoDeficienciaMotora: false,
	tipoDeficienciaMental: false,
	tipoDeficienciaMultipla: false,
	titularidade: "",
	parentescoChefe: "",
	rg: "",
	orgaoExpedidor: "",
	ufRg: "",
	dataExpedicao: "",
	naoPossuiRg: false,
	naoSabeRg: false,
	recusaInformarRg: false,
	cpf: "",
	rne: "",
	rneTipo: "",
	naoPossuiCpf: false,
	naoSabeCpf: false,
	recusaInformarCpf: false,
	nis: "",
	naoPossuiNis: false,
	estadoCivil: "",
	dataCasamento: "",
	nomeConjuge: "",
	regimeBens: "",
	situacaoFato: "",
	companheiro: "",
	uniaoConsensual: "",
	atividadeRemunerada: "",
	relacaoTrabalho: "",
	motivoNaoTrabalhar: "",
	profissao: "",
	
	// Responsável/Titular 2
	nomeCompleto2: "",
	nomeSocial2: "",
	dataNascimento2: "",
	naturalidade2: "",
	uf2: "",
	pais2: "",
	nomePai2: "",
	naoConstaPai2: false,
	nomeMae2: "",
	naoConstaMae2: false,
	identidadeEtnica2: "",
	identidadeGenero2: "",
	deficiencia2: "",
	tipoDeficienciaAuditivo2: false,
	tipoDeficienciaVisual2: false,
	tipoDeficienciaMotora2: false,
	tipoDeficienciaMental2: false,
	tipoDeficienciaMultipla2: false,
	titularidade2: "",
	parentescoChefe2: "",
	rg2: "",
	orgaoExpedidor2: "",
	ufRg2: "",
	dataExpedicao2: "",
	naoPossuiRg2: false,
	naoSabeRg2: false,
	recusaInformarRg2: false,
	cpf2: "",
	rne2: "",
	rneTipo2: "",
	naoPossuiCpf2: false,
	naoSabeCpf2: false,
	recusaInformarCpf2: false,
	nis2: "",
	naoPossuiNis2: false,
	estadoCivil2: "",
	dataCasamento2: "",
	nomeConjuge2: "",
	regimeBens2: "",
	situacaoFato2: "",
	companheiro2: "",
	uniaoConsensual2: "",
	atividadeRemunerada2: "",
	relacaoTrabalho2: "",
	motivoNaoTrabalhar2: "",
	profissao2: "",
	
	// Declarações
	local: "",
	data: "",
	assinaturaOcupante: "",
	
	
	// Registro de Visitas
	primeiraVisita: "",
	primeiraConcluida: false,
	primeiraIncompleta: false,
	segundaVisita: "",
	segundaConcluida: false,
	segundaIncompleta: false,
	segundaMoradorAusente: false,
	terceiraVisita: "",
	terceiraConcluida: false,
	terceiraMoradorAusente: false,
	terceiraRecusa: false,
	entrevistado: "",
	entrevistadoConcluida: false,
	entrevistadoRecusa: false,
	posicaoFamilia: "",
	observacoes: "",
	
	// Documentação Recolhida
	copiasRG1: false,
	copiasCPF1: false,
	copiasCertidaoNascimento1: false,
	copiasCertidaoCasamentoObito1: false,
	copiasOutro1: false,
	copiasRG2: false,
	copiasCPF2: false,
	copiasCertidaoNascimento2: false,
	copiasCertidaoCasamentoObito2: false,
	copiasOutro2: false,
	docImovelContratoVendaCompra: false,
	docImovelContratoDoacao: false,
	docImovelTPU: false,
	docImovelCompromissoVendaCompra: false,
	docImovelContratoLocacao: false,
	docImovelConcessaoUso: false,
	docImovelContratoCessaoDireitos: false,
	docImovelContratoComodato: false,
	docImovelAutorizacaoUso: false,
	docImovelRecibosCompra: false,
	docImovelOutros: false,
	numeroMatricula: "",
	sri: ""
};

// Base form structure
export const regFundiariaDefinition: FormConfig = {
	title: "Regularização Fundiária",
	sections: [
		{
			id: "Identificação do Domicílio",
			title: "IDENTIFICAÇÃO DO DOMICÍLIO",
			fields: [
				{
					name: "nucleoUrbano",
					label: "Núcleo Urbano",
					type: "text" as const,
					required: false
				},
				{
					name: "quadra",
					label: "Quadra",
					type: "number" as const,
					required: false
				},
				{
					name: "lote",
					label: "Lote",
					type: "number" as const,
					required: false
				},
				{
					name: "domicilio",
					label: "Domicílio",
					type: "number" as const,
					required: false
				},
				{
					name: "empreendimentosBloco",
					label: "Empreendimentos - Bloco",
					type: "number" as const,
					required: false
				},
				{
					name: "empreendimentosPavimento",
					label: "Empreendimentos - Pavimento",
					type: "number" as const,
					required: false
				},
				{
					name: "empreendimentosComplemento",
					label: "Empreendimentos - Complemento",
					type: "text" as const,
					required: false
				},
				{
					name: "endereco",
					label: "Endereço",
					type: "text" as const,
					required: false
				},
				{
					name: "numero",
					label: "Nº",
					type: "number" as const,
					required: false
				},
				{
					name: "complemento",
					label: "Complemento",
					type: "text" as const,
					required: false
				},
				{
					name: "telefoneResidencial",
					label: "Telefones Residencial",
					type: "number" as const,
					required: false
				},
				{
					name: "telefoneCelular1",
					label: "Telefones Celular 1",
					type: "number" as const,
					required: false
				},
				{
					name: "telefoneCelular2",
					label: "Telefones Celular 2",
					type: "number" as const,
					required: false
				},
				{
					name: "telefoneRecado",
					label: "Telefones Recado",
					type: "number" as const,
					required: false
				},
				{
					name: "email",
					label: "Email",
					type: "text" as const,
					required: false
				}
			]
		},
		{
			id: "Dados do Imóvel",
			title: "DADOS DO IMÓVEL",
			fields: [
				{
					name: "quantidadeDomicilios",
					label: "Quantidade de domicílios no lote",
					type: "number" as const,
					required: false
				},
				{
					name: "situacaoImovel",
					label: "Situação do imóvel",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Ocupado", value: "ocupado" },
						{ label: "Em Construção", value: "em_construcao" },
						{ label: "Vazio", value: "vazio" }
					]
				},
				{
					name: "usoImovel",
					label: "Uso do imóvel",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Exclusivamente Residencial", value: "exclusivamente_residencial" },
						{ label: "Comercial", value: "comercial" },
						{ label: "Serviços", value: "servicos" },
						{ label: "Residencial Misto", value: "residencial_misto" },
						{ label: "Institucional", value: "institucional" },
						{ label: "Industrial", value: "industrial" },
						{ label: "Outros", value: "outros" }
					]
				},
				{
					name: "atividade",
					label: "Atividade",
					type: "text" as const,
					required: false
				}
			]
		},
		{
			id: "Regime de Ocupação",
			title: "REGIME DE OCUPAÇÃO DA MORADIA",
			fields: [
				{
					name: "tipoOcupacao",
					label: "Tipo de ocupação",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Próprio", value: "proprio" },
						{ label: "Alugado", value: "alugado" },
						{ label: "Cedido", value: "cedido" },
						{ label: "Herdado", value: "herdado" },
						{ label: "Emprestado", value: "emprestado" }
					]
				},
				{
					name: "documentosComprobatorios",
					label: "Documentos Comprobatórios",
					type: "label" as const,
					required: false,

				},
				{
					name: "documentoTPU",
					label: "Termo de Permissão de Uso - TPU",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "documentoContratoCompraVenda",
					label: "Contrato de Compra e Venda",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "documentoConcessaoUso",
					label: "Concessão de Uso (CUEM/CDRU)",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "documentoAutorizacaoUso",
					label: "Autorização de Uso",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "documentoEscritura",
					label: "Escritura",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "documentoOutro",
					label: "Outro",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "outroDocumento",
					label: "Outro documento",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "documentoOutro",
						operator: "equals",
						value: true
					}]
				},
				{
					name: "naoPossuiDocumento",
					label: "Não Possui Documento",
					type: "checkbox" as const,
					dependent: true,

					required: false
				},
				{
					name: "naoSabeInformar",
					label: "Não sabe informar",
					type: "checkbox" as const,
					dependent: true,

					required: false
				},
				{
					name: "proprietarioExclusivo",
					label: "É proprietário exclusivo de outro imóvel urbano ou rural com matrícula?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				}
			]
		},
		{
			id: "Dados da Família",
			title: "FAMÍLIA",
			fields: [
				{
					name: "tempoMoradia",
					label: "Tempo de moradia no imóvel (anos)",
					type: "number" as const,
					required: false
				},
				{
					name: "numeroMoradores",
					label: "Número de moradores",
					type: "number" as const,
					required: false
				},
				{
					name: "atendimentoHabitacional",
					label: "Já recebeu atendimento habitacional?",
					type: "label" as const,
					required: false
				},
				{
					name: "atendimentoPMSP",
					label: "PMSP",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "atendimentoCDHU",
					label: "CDHU",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "atendimentoCOHAB",
					label: "COHAB",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "atendimentoVerba",
					label: "Verba de Atendimento Habitacional",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "atendimentoNaoRecebeu",
					label: "Não recebeu",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "atendimentoOutro",
					label: "Outro",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "outroAtendimento",
					label: "Outro atendimento habitacional",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "atendimentoOutro",
						operator: "equals",
						value: true
					}]
				},
				{
					name: "acaoDespejo",
					label: "Existe ação de despejo contra a família?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "rendaFamiliar",
					label: "Renda Familiar",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Não possui", value: "nao_possui" },
						{ label: "até 3 S.M.", value: "ate_3sm" },
						{ label: "de 3 a 6 S.M.", value: "de_3a6sm" },
						{ label: "acima de 6 S.M.", value: "acima_6sm" }
					]
				}
			]
		},
		{
			id: "Responsável Titular 1",
			title: "RESPONSÁVEL/TITULAR 1",
			fields: [
				{
					name: "nomeCompleto",
					label: "Nome Completo",
					type: "text" as const,
					required: false
				},
				{
					name: "nomeSocial",
					label: "Nome Social",
					type: "text" as const,
					required: false
				},
				{
					name: "dataNascimento",
					label: "Data de nascimento",
					type: "text" as const,
					required: false
				},
				{
					name: "naturalidade",
					label: "Naturalidade",
					type: "text" as const,
					required: false
				},
				{
					name: "uf",
					label: "U.F",
					type: "text" as const,
					required: false
				},
				{
					name: "pais",
					label: "País",
					type: "text" as const,
					required: false
				},
				{
					name: "nomePai",
					label: "Nome do Pai",
					type: "text" as const,
					required: false
				},
				{
					name: "naoConstaPai",
					label: "Não consta paternidade",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					disableField: "nomePai"

				},
				{
					name: "nomeMae",
					label: "Nome da Mãe",
					type: "text" as const,
					required: false
				},
				{
					name: "naoConstaMae",
					label: "Não consta maternidade",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "identidadeEtnica",
					label: "Identidade étnico-racial",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Amarela", value: "amarela" },
						{ label: "Branca", value: "branca" },
						{ label: "Indígena", value: "indigena" },
						{ label: "Parda", value: "parda" },
						{ label: "Preta", value: "preta" }
					]
				},
				{
					name: "identidadeGenero",
					label: "Identidade de Gênero",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Feminino", value: "feminino" },
						{ label: "Masculino", value: "masculino" },
						{ label: "Agênero", value: "agenero" },
						{ label: "Gênero fluído", value: "genero_fluido" },
						{ label: "Homem Cisgênero", value: "homem_cisgenero" },
						{ label: "Homem Transexual", value: "homem_transexual" },
						{ label: "Mulher Cisgênero", value: "mulher_cisgenero" },
						{ label: "Mulher Transexual", value: "mulher_transexual" },
						{ label: "Intersexo", value: "intersexo" },
						{ label: "Não binárie", value: "nao_binarie" },
						{ label: "Travesti", value: "travesti" },
						{ label: "Outros", value: "outros" }
					]
				},
				{
					name: "deficiencia",
					label: "Deficiência",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "tipoDeficienciaLabel",
					label: "Tipo de deficiência",
					type: "label" as const,
					required: false,
					conditions: [{
						field: "deficiencia",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaAuditivo",
					label: "Auditivo",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaVisual",
					label: "Visual",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaMotora",
					label: "Motora",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaMental",
					label: "Mental",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaMultipla",
					label: "Múltipla",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "titularidade",
					label: "Titularidade",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Titular 1", value: "titular_1" },
						{ label: "Titular 2", value: "titular_2" }
					]
				},
				{
					name: "parentescoChefe",
					label: "Parentesco com chefe",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Chefe", value: "chefe" },
						{ label: "Cônjuge", value: "conjuge" },
						{ label: "Filho", value: "filho" },
						{ label: "Irmão", value: "irmao" },
						{ label: "Outros", value: "outros" }
					]
				},
				{
					name: "rg",
					label: "RG",
					type: "text" as const,
					required: false
				},
				{
					name: "orgaoExpedidor",
					label: "Órgão Expedidor",
					type: "text" as const,
					required: false
				},
				{
					name: "ufRg",
					label: "U.F.",
					type: "text" as const,
					required: false
				},
				{
					name: "dataExpedicao",
					label: "Data de Expedição",
					type: "text" as const,
					required: false
				},
				{
					name: "naoPossuiRg",
					label: "Não possui RG",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "naoSabeRg",
					label: "Não sabe RG",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "recusaInformarRg",
					label: "Recusa informar RG",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "cpf",
					label: "CPF",
					type: "text" as const,
					required: false
				},
				{
					name: "rne",
					label: "RNE",
					type: "text" as const,
					required: false
				},
				{
					name: "rneTipo",
					label: "RNE Tipo",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Definitivo", value: "definitivo" },
						{ label: "Provisório", value: "provisorio" }
					]
				},
				{
					name: "naoPossuiCpf",
					label: "Não possui CPF",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "naoSabeCpf",
					label: "Não sabe CPF",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "recusaInformarCpf",
					label: "Recusa informar CPF",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "nis",
					label: "NIS",
					type: "text" as const,
					required: false
				},
				{
					name: "naoPossuiNis",
					label: "Não possui NIS",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "estadoCivil",
					label: "Estado Civil",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Solteiro", value: "solteiro" },
						{ label: "Divorciado(a)", value: "divorciado" },
						{ label: "Viúvo(a)", value: "viuvo" },
						{ label: "Separado(a) Judicialmente", value: "separado_judicialmente" },
						{ label: "Casado(a)", value: "casado" }
					]
				},
				{
					name: "dataCasamento",
					label: "Data do casamento",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "estadoCivil",
						operator: "equals",
						value: "casado"
					}]
				},
				{
					name: "nomeConjuge",
					label: "Nome do Cônjuge",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "estadoCivil",
						operator: "equals",
						value: "casado"
					}]
				},
				{
					name: "regimeBens",
					label: "Regime de Bens",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Comunhão Parcial", value: "comunhao_parcial" },
						{ label: "Comunhão Universal", value: "comunhao_universal" },
						{ label: "Separação Total", value: "separacao_total" }
					],
					conditions: [{
						field: "estadoCivil",
						operator: "equals",
						value: "casado"
					}]
				},
				{
					name: "situacaoFato",
					label: "Situação de Fato",
					type: "select" as const,
					required: false,
					options: [
						{ label: "União Estável com escritura", value: "uniao_estavel_escritura" },
						{ label: "União Estável sem escritura", value: "uniao_estavel_sem_escritura" },
						{ label: "Separado Judicialmente", value: "separado_judicialmente" }
					],
					conditions: [{
						field: "estadoCivil",
						operator: "notEquals",
						value: "casado"
					}]
				},
				{
					name: "companheiro",
					label: "Vive com companheiro legal?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "uniaoConsensual",
					label: "Vive em união consensual?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "atividadeRemunerada",
					label: "Exerce atividade remunerada?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "relacaoTrabalho",
					label: "Relação de trabalho",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Formal", value: "formal" },
						{ label: "Informal", value: "informal" },
						{ label: "Autônomo", value: "autonomo" },
						{ label: "Outros", value: "outros" }
					],
					conditions: [{
						field: "atividadeRemunerada",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "motivoNaoTrabalhar",
					label: "Motivo de não trabalhar",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Aposentado", value: "aposentado" },
						{ label: "Pensionista", value: "pensionista" },
						{ label: "Desempregado", value: "desempregado" },
						{ label: "Estudante", value: "estudante" },
						{ label: "Outros", value: "outros" }
					],
					conditions: [{
						field: "atividadeRemunerada",
						operator: "equals",
						value: "nao"
					}]
				},
				{
					name: "profissao",
					label: "Profissão",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "atividadeRemunerada",
						operator: "equals",
						value: "sim"
					}]
				}
			]
		},
		{
			id: "Responsável Titular 2",
			title: "RESPONSÁVEL/TITULAR 2",
			fields: [
				{
					name: "nomeCompleto2",
					label: "Nome Completo",
					type: "text" as const,
					required: false
				},
				{
					name: "nomeSocial2",
					label: "Nome Social",
					type: "text" as const,
					required: false
				},
				{
					name: "dataNascimento2",
					label: "Data de nascimento",
					type: "text" as const,
					required: false
				},
				{
					name: "naturalidade2",
					label: "Naturalidade",
					type: "text" as const,
					required: false
				},
				{
					name: "uf2",
					label: "U.F",
					type: "text" as const,
					required: false
				},
				{
					name: "pais2",
					label: "País",
					type: "text" as const,
					required: false
				},
				{
					name: "nomePai2",
					label: "Nome do Pai",
					type: "text" as const,
					required: false
				},
				{
					name: "naoConstaPai2",
					label: "Não consta paternidade",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "nomeMae2",
					label: "Nome da Mãe",
					type: "text" as const,
					required: false
				},
				{
					name: "naoConstaMae2",
					label: "Não consta maternidade",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "identidadeEtnica2",
					label: "Identidade étnico-racial",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Amarela", value: "amarela" },
						{ label: "Branca", value: "branca" },
						{ label: "Indígena", value: "indigena" },
						{ label: "Parda", value: "parda" },
						{ label: "Preta", value: "preta" }
					]
				},
				{
					name: "identidadeGenero2",
					label: "Identidade de Gênero",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Feminino", value: "feminino" },
						{ label: "Masculino", value: "masculino" },
						{ label: "Agênero", value: "agenero" },
						{ label: "Gênero fluído", value: "genero_fluido" },
						{ label: "Homem Cisgênero", value: "homem_cisgenero" },
						{ label: "Homem Transexual", value: "homem_transexual" },
						{ label: "Mulher Cisgênero", value: "mulher_cisgenero" },
						{ label: "Mulher Transexual", value: "mulher_transexual" },
						{ label: "Intersexo", value: "intersexo" },
						{ label: "Não binárie", value: "nao_binarie" },
						{ label: "Travesti", value: "travesti" },
						{ label: "Outros", value: "outros" }
					]
				},
				{
					name: "deficiencia2",
					label: "Deficiência",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "tipoDeficienciaLabel2",
					label: "Tipo de deficiência",
					type: "label" as const,
					required: false,
					conditions: [{
						field: "deficiencia2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaAuditivo2",
					label: "Auditivo",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaVisual2",
					label: "Visual",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaMotora2",
					label: "Motora",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaMental2",
					label: "Mental",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "tipoDeficienciaMultipla2",
					label: "Múltipla",
					type: "checkbox" as const,
					required: false,
					dependent: true,
					conditions: [{
						field: "deficiencia2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "titularidade2",
					label: "Titularidade",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Titular 1", value: "titular_1" },
						{ label: "Titular 2", value: "titular_2" }
					]
				},
				{
					name: "parentescoChefe2",
					label: "Parentesco com chefe",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Chefe", value: "chefe" },
						{ label: "Cônjuge", value: "conjuge" },
						{ label: "Filho", value: "filho" },
						{ label: "Irmão", value: "irmao" },
						{ label: "Outros", value: "outros" }
					]
				},
				{
					name: "rg2",
					label: "RG",
					type: "text" as const,
					required: false
				},
				{
					name: "orgaoExpedidor2",
					label: "Órgão Expedidor",
					type: "text" as const,
					required: false
				},
				{
					name: "ufRg2",
					label: "U.F.",
					type: "text" as const,
					required: false
				},
				{
					name: "dataExpedicao2",
					label: "Data de Expedição",
					type: "text" as const,
					required: false
				},
				{
					name: "naoPossuiRg2",
					label: "Não possui RG",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "naoSabeRg2",
					label: "Não sabe RG",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "recusaInformarRg2",
					label: "Recusa informar RG",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "cpf2",
					label: "CPF",
					type: "text" as const,
					required: false
				},
				{
					name: "rne2",
					label: "RNE",
					type: "text" as const,
					required: false
				},
				{
					name: "rneTipo2",
					label: "RNE Tipo",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Definitivo", value: "definitivo" },
						{ label: "Provisório", value: "provisorio" }
					]
				},
				{
					name: "naoPossuiCpf2",
					label: "Não possui CPF",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "naoSabeCpf2",
					label: "Não sabe CPF",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "recusaInformarCpf2",
					label: "Recusa informar CPF",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "nis2",
					label: "NIS",
					type: "text" as const,
					required: false
				},
				{
					name: "naoPossuiNis2",
					label: "Não possui NIS",
					type: "checkbox" as const,
					required: false
				},
				{
					name: "estadoCivil2",
					label: "Estado Civil",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Solteiro", value: "solteiro" },
						{ label: "Divorciado(a)", value: "divorciado" },
						{ label: "Viúvo(a)", value: "viuvo" },
						{ label: "Separado(a) Judicialmente", value: "separado_judicialmente" },
						{ label: "Casado(a)", value: "casado" }
					]
				},
				{
					name: "dataCasamento2",
					label: "Data do casamento",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "estadoCivil2",
						operator: "equals",
						value: "casado"
					}]
				},
				{
					name: "nomeConjuge2",
					label: "Nome do Cônjuge",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "estadoCivil2",
						operator: "equals",
						value: "casado"
					}]
				},
				{
					name: "regimeBens2",
					label: "Regime de Bens",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Comunhão Parcial", value: "comunhao_parcial" },
						{ label: "Comunhão Universal", value: "comunhao_universal" },
						{ label: "Separação Total", value: "separacao_total" }
					],
					conditions: [{
						field: "estadoCivil2",
						operator: "equals",
						value: "casado"
					}]
				},
				{
					name: "situacaoFato2",
					label: "Situação de Fato",
					type: "select" as const,
					required: false,
					options: [
						{ label: "União Estável com escritura", value: "uniao_estavel_escritura" },
						{ label: "União Estável sem escritura", value: "uniao_estavel_sem_escritura" },
						{ label: "Separado Judicialmente", value: "separado_judicialmente" }
					],
					conditions: [{
						field: "estadoCivil2",
						operator: "notEquals",
						value: "casado"
					}]
				},
				{
					name: "companheiro2",
					label: "Vive com companheiro legal?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "uniaoConsensual2",
					label: "Vive em união consensual?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "atividadeRemunerada2",
					label: "Exerce atividade remunerada?",
					type: "radio" as const,
					required: false,
					options: [
						{ label: "Sim", value: "sim" },
						{ label: "Não", value: "nao" }
					]
				},
				{
					name: "relacaoTrabalho2",
					label: "Relação de trabalho",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Formal", value: "formal" },
						{ label: "Informal", value: "informal" },
						{ label: "Autônomo", value: "autonomo" },
						{ label: "Outros", value: "outros" }
					],
					conditions: [{
						field: "atividadeRemunerada2",
						operator: "equals",
						value: "sim"
					}]
				},
				{
					name: "motivoNaoTrabalhar2",
					label: "Motivo de não trabalhar",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Aposentado", value: "aposentado" },
						{ label: "Pensionista", value: "pensionista" },
						{ label: "Desempregado", value: "desempregado" },
						{ label: "Estudante", value: "estudante" },
						{ label: "Outros", value: "outros" }
					],
					conditions: [{
						field: "atividadeRemunerada2",
						operator: "equals",
						value: "nao"
					}]
				},
				{
					name: "profissao2",
					label: "Profissão",
					type: "text" as const,
					required: false,
					conditions: [{
						field: "atividadeRemunerada2",
						operator: "equals",
						value: "sim"
					}]
				}
			]
		},
		{
			id: "Declaracoes",
			title: "DECLARAÇÕES",
			fields: [
				{
					name: "local",
					label: "Local",
					type: "text" as const,
					required: false
				},
				{
					name: "data",
					label: "Data",
					type: "text" as const,
					required: false
				},
				{
					name: "assinaturaOcupante",
					label: "Assinatura do ocupante",
					type: "text" as const,
					required: false
				}
			]
		},
		{
			id: "Dados de Controle",
			title: "DADOS DE CONTROLE",
			fields: [
				{
					name: "cadastrador",
					label: "Cadastrador",
					type: "text" as const,
					required: false
				}
			]
		},
		{
			id: "Registro de Visitas",
			title: "REGISTRO DE VISITAS",
			fields: [
				{
					name: "primeiraVisita",
					label: "1ª Visita (Data)",
					type: "text" as const,
					required: false
				},
				{
					name: "primeiraConcluida",
					label: "Concluída",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "primeiraIncompleta",
					label: "Incompleta",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "segundaVisita",
					label: "2ª Visita (Data)",
					type: "text" as const,
					required: false
				},
				{
					name: "segundaConcluida",
					label: "Concluída",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "segundaIncompleta",
					label: "Incompleta",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "segundaMoradorAusente",
					label: "Morador ausente",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "terceiraVisita",
					label: "3ª Visita (Data)",
					type: "text" as const,
					required: false
				},
				{
					name: "terceiraConcluida",
					label: "Concluída",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "terceiraMoradorAusente",
					label: "Morador ausente",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "terceiraRecusa",
					label: "Recusa",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "entrevistado",
					label: "Entrevistado",
					type: "text" as const,
					required: false
				},
				{
					name: "entrevistadoConcluida",
					label: "Concluída",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "entrevistadoRecusa",
					label: "Recusa",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "posicaoFamilia",
					label: "Posição na família/domicílio",
					type: "select" as const,
					required: false,
					options: [
						{ label: "Cônjuge", value: "conjuge" },
						{ label: "Filho", value: "filho" },
						{ label: "Irmão", value: "irmao" },
						{ label: "Outros", value: "outros" }
					]
				},
				{
					name: "observacoes",
					label: "Observações",
					type: "text" as const,
					required: false
				}
			]
		},
		{
			id: "Documentacao Recolhida",
			title: "DOCUMENTAÇÃO RECOLHIDA",
			fields: [
				{
					name: "copiasResponsavel1Label",
					label: "Cópias recolhidas do 1º Responsável",
					type: "label" as const,
					required: false
				},
				{
					name: "copiasRG1",
					label: "RG",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasCPF1",
					label: "CPF",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasCertidaoNascimento1",
					label: "Certidão de Nascimento",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasCertidaoCasamentoObito1",
					label: "Certidão de Casamento/Óbito",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasOutro1",
					label: "Outro",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasResponsavel2Label",
					label: "Cópias recolhidas do 2º Responsável",
					type: "label" as const,
					required: false
				},
				{
					name: "copiasRG2",
					label: "RG",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasCPF2",
					label: "CPF",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasCertidaoNascimento2",
					label: "Certidão de Nascimento",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasCertidaoCasamentoObito2",
					label: "Certidão de Casamento/Óbito",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "copiasOutro2",
					label: "Outro",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "documentacaoImovelLabel",
					label: "Documentação do Imóvel",
					type: "label" as const,
					required: false
				},
				{
					name: "docImovelContratoVendaCompra",
					label: "Contrato de Venda e Compra",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelContratoDoacao",
					label: "Contrato de Doação",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelTPU",
					label: "TPU",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelCompromissoVendaCompra",
					label: "Compromisso de Venda e Compra",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelContratoLocacao",
					label: "Contrato de Locação",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelConcessaoUso",
					label: "Concessão de Uso",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelContratoCessaoDireitos",
					label: "Contrato de Cessão de Direitos",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelContratoComodato",
					label: "Contrato de Comodato",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelAutorizacaoUso",
					label: "Autorização de Uso",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelRecibosCompra",
					label: "Recibos de Compra",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "docImovelOutros",
					label: "Outros",
					type: "checkbox" as const,
					required: false,
					dependent: true
				},
				{
					name: "numeroMatricula",
					label: "Nº da Matrícula do Lote",
					type: "text" as const,
					required: false
				},
				{
					name: "sri",
					label: "SRI",
					type: "text" as const,
					required: false
				}
			]
		}
	]
};

/**
 * Get complete form sections with merged static and conditional fields
 * @param formValues Current form values
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
	// For now, we're just returning the base form structure
	// In the future, you can add conditional fields here based on form values
	return regFundiariaDefinition.sections;
} 