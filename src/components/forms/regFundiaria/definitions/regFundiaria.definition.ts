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
	tipoDeficiencia: z.array(z.string()).optional(),
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

	// DECLARAÇÕES
	local: z.string().optional(),
	data: z.string().optional(),
	assinaturaOcupante: z.string().optional(),

	// DADOS DE CONTROLE
	cadastrador: z.string().optional(),

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
	copiasRecolhidas1: z.array(z.string()).optional(),
	copiasRecolhidas2: z.array(z.string()).optional(),
	documentacaoImovel: z.array(z.string()).optional(),
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