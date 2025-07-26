import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import { getDefaultValuesFromSchema } from "@/utils/formUtils";

import {
	Form,
} from "@/components/ui/form"
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormMetadata } from '@/hooks/useFormMetadata';

import IdentEspacoHabitado from "./formSections/IdentEspacoHabitado.form"
import InfoContatoForm from "./formSections/IdentUnidade.form"
import SituUsoUniForm from "./formSections/SituUsoUni.form"
import CaractUnidadeForm from "./formSections/CaractUnidade.form"
import CaracInfraUrbUnidForm from "./formSections/CaracInfraUrbUnid.form"
import OutrasInfoRelevantesForm from "./formSections/OutrasInfoRelevantes.form"
import FormSectionRenderer from "@/components/formController/FormSectionRenderer"
import StatusNotasForm from "./formSections/StatusNotas.form"
import AnexosForm from "./formSections/anexos.form"

// Import the types from formUtils with a clear alias
import { FormField as FormFieldType, FormSection } from "@/utils/formUtils";
import { identEspacoHabitadoSchema } from "@/components/forms/selagem/definitions/identEspacoHabitado.definition";
import { identUnidadeSchema } from "@/components/forms/selagem/definitions/identUnidade.definition";
import { situUsoUniSchema } from "@/components/forms/selagem/definitions/situUsoUni.definition";
import { caractUnidadeSchema } from "@/components/forms/selagem/definitions/caractUnidade.definition";
import { caracInfraUrbUnidSchema } from "@/components/forms/selagem/definitions/CaracInfraUrbUnid.definition";
import { outrasInfoRelevantesSchema } from "@/components/forms/selagem/definitions/outrasInfoRelevantes.definition";
import { statusNotasSchema } from "@/components/forms/selagem/definitions/statusNotas.definition";
import { anexosSchema } from "@/components/forms/selagem/definitions/anexos.definition";
import { API_BASE_URL } from "../../../service/constants";
import survey_resource from "../../../service/survey_resource.api"
import Swal from 'sweetalert2';


// Define the schema for a single family, integrating IdentResp schema
const familySchema = z.object({
	...identEspacoHabitadoSchema.shape,
	...identUnidadeSchema.shape,
	...situUsoUniSchema.shape,
	...caractUnidadeSchema.shape,
	...caracInfraUrbUnidSchema.shape,
	...outrasInfoRelevantesSchema.shape,
	...statusNotasSchema.shape,
	...anexosSchema.shape,

});
// Define the form schema with Zod
const formSchema = z.object({
	questionario: z.string(),
	seiNumber: z.string().min(1, { message: "Nº SEI é obrigatório" }),
	naoAplica: z.string(),
	interviewerName: z.string().min(1, { message: "Nome do entrevistador é obrigatório" }),
	interviewDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	timeElapsed: z.string(),
	sealNumber: z.string().max(9, { message: "Máximo de 9 caracteres" }),
	numberFamilies: z.number().min(0),
	firstVisitStart: z.string(),
	firstVisitEnd: z.string(),
	secondVisit: z.string(),
	thirdVisit: z.string(),
	families: z.array(familySchema),
});

// Define the form data type from the schema
type FormValues = z.infer<typeof formSchema>;

interface FormArrolamentoProps {
	ref: Ref<HTMLDivElement>;
	defaultValues?: Partial<FormValues>;
	onSubmit?: (data: FormValues) => void;
	isMetadataModalOpen: boolean;
	setIsMetadataModalOpen: (open: boolean) => void;
	activeFamilyIndex: number;
}

const FormSelagem = ({
	ref,
	defaultValues,
	onSubmit,
	isMetadataModalOpen,
	setIsMetadataModalOpen,
	activeFamilyIndex
}: FormArrolamentoProps) => {
	const { id: selagemId } = useParams<{ id: string }>()
	const isEditMode = Boolean(selagemId)
	const [isLoadingData, setIsLoadingData] = useState(false)
	const [loadedSelagemData, setLoadedSelagemData] = useState<any>(null)
	
	const interviewerNameFromStorage = localStorage.getItem('userEmail') || '';

	// Mock de dados para teste quando a API não estiver disponível
	const getMockSelagemData = (id: string) => {
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

	// Função para buscar dados da selagem na API
	const loadSelagemData = async () => {
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

					const url = `${API_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
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
				const mappedData = mapSelagemToFormData(selagemData)
				console.log("🗂️ Dados mapeados para o formulário (8/8 schemas):", mappedData)
				
				// Preencher o formulário com os dados carregados
				form.reset(mappedData)
				
				Swal.fire({
					icon: 'success',
					title: 'Dados Carregados!',
					text: `Selagem ${selagemId} carregada com sucesso`,
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
					
					const mappedData = mapSelagemToFormData(selagemData)
					console.log("🗂️ Dados mockados mapeados (8/8 schemas):", mappedData)
					
					form.reset(mappedData)
					
					Swal.fire({
						icon: 'info',
						title: 'Dados Mock Carregados!',
						text: `Selagem ${selagemId} carregada com dados de teste (API indisponível)`,
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

	// Função para mapear dados da API para o formato do formulário
	const mapSelagemToFormData = (selagemData: any): Partial<FormValues> => {
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
			questionario: "SEHAB-123",
			seiNumber: mainMetadata.numero_sei || "",
			naoAplica: mainMetadata.numero_sei_nao_aplicavel ? "true" : "",
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
				usoUnidade: situUso.uso || "",
				qualUso: situUso.qual_uso || "",
				quaisTipos: situUso.tipos_uso || "",
				nome_responsavel: situUso.nome_responsavel || "",
				telefone_responsavel: situUso.telefone_responsavel || "",
				responsavel_nao_identificado: situUso.responsavel_identificado || false,
				uso_terreno: situUso.uso_terreno || "",
				
				// Características Unidade (schema: caractUnidadeSchema)
				numeroComodos: caractUnidade.numero_comodos || "",
				numeroPavimento: caractUnidade.numero_pavimentos || "",
				numeroSanitario: caractUnidade.numero_sanitarios || "",
				
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

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			questionario: "SEHAB-123",
			seiNumber: "",
			naoAplica: "",
			interviewerName: interviewerNameFromStorage,
			interviewDate: "",
			startTime: "",
			endTime: "",
			timeElapsed: "",
			sealNumber: "",
			numberFamilies: 1,
			firstVisitStart: new Date().toLocaleString('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}).replace(',', ' -'),
			firstVisitEnd: "",
			secondVisit: "",
			thirdVisit: "",
			families: [{}],
		},
	});
	const formValues = form.getValues(); // Isso retorna todos os valores do formulário.	
	const { setValue, watch } = useForm();
	// Acessa os valores dos campos
	const naoAplica = watch("naoAplica");  // Assumindo que 'naoAplica' é o campo que será monitorado

	useEffect(() => {
		// Verifica se o campo 'naoAplica' está marcado como verdadeiro
		if (naoAplica) {
			// Limpa o campo 'seiNumber' se a condição for atendida
			setValue("seiNumber", "");
		}
	}, [naoAplica, setValue]);
	const { setForm, setMetadata } = useFormMetadata();
	// Share the form and metadata once on mount
	useEffect(() => {
		setForm(form);
		setMetadata(metaDataSections[0]);

		return () => {
			setForm(null);
			setMetadata(null);
		};
	}, []);

	// useEffect para carregar dados quando em modo edição
	useEffect(() => {
		if (isEditMode && selagemId && !loadedSelagemData) {
			console.log("🔄 Modo edição detectado, carregando dados da selagem:", selagemId)
			loadSelagemData()
		}
	}, [isEditMode, selagemId, loadedSelagemData]);

	const { fields: familyFields, append, remove } = useFieldArray({
		control: form.control,
		name: "families",
	});

	// Watch for changes to numberFamilies
	const numberFamilies = useWatch({
		control: form.control,
		name: "numberFamilies",
	});
	const disableSeiNumber = useWatch({
		control: form.control,
		name: "naoAplica",
	});
	// Merge all schemas to create a complete default family entry
	const defaultFamilyEntry = {
		...getDefaultValuesFromSchema(identEspacoHabitadoSchema),
		...getDefaultValuesFromSchema(caractUnidadeSchema),
		...getDefaultValuesFromSchema(identUnidadeSchema),
		...getDefaultValuesFromSchema(situUsoUniSchema),
		...getDefaultValuesFromSchema(caracInfraUrbUnidSchema),
		...getDefaultValuesFromSchema(outrasInfoRelevantesSchema),
		...getDefaultValuesFromSchema(statusNotasSchema),
		...getDefaultValuesFromSchema(anexosSchema),

	} as const;

	useEffect(() => {
		const currentLength = familyFields.length;
		const targetLength = numberFamilies || 0;

		if (targetLength > currentLength) {
			// Add new entries
			const newEntries = Array(targetLength - currentLength).fill(defaultFamilyEntry);
			newEntries.forEach(entry => append(entry));
		} else if (targetLength < currentLength) {
			// Remove excess entries
			for (let i = currentLength - 1; i >= targetLength; i--) {
				remove(i);
			}
		}
	}, [numberFamilies, familyFields.length, append, remove]);
	// Dentro do seu componente
	useEffect(() => {
		if (form.watch("naoAplica")) {
			// Quando "naoAplica" estiver marcado como verdadeiro, limpar o campo "seiNumber"
			form.setValue("seiNumber", "");
		}
	}, [form.watch("naoAplica")]);

	const formatDate = () => {
		return new Date().toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).replace(',', ' -');
	};

	// Função para definir o valor de firstVisitEnd
	const handleSetEndTime = () => {
		const formattedDate = formatDate();
		form.setValue("firstVisitEnd", formattedDate);
	};
	// Lidar com o envio do formulário para FormArrolamento
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};

	// Define the form structure using FormFieldType for each field
	const metaDataSections: FormSection[] = [
		{
			id: "identificacao",
			title: "",
			fields: [

				{
					name: "questionario",
					label: "Formulário",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: true,
					sidebarlabel: "",
					showinmodal: true,
				} as FormFieldType,
				{
					name: "firstVisitStart",
					label: "Hora início - Primeira visita",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: true,
					showinmodal: false,
					sidebarlabel: "Início"
				} as FormFieldType,
				{
					name: "firstVisitEnd",
					label: "Hora término - Primeira visita",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: true,
					showinmodal: false,
					sidebarlabel: "Término"
				} as FormFieldType,
				{
					name: "seiNumber",
					label: "Número SEI",
					type: "text",
					required: true,
					sidebarform: true,
					showinmodal: true
				} as FormFieldType,
				{
					name: "naoAplica",
					label: "Não se aplica",
					type: "checkbox",
					required: true,
					sidebarform: false,
					showinmodal: true,
					disableField: "seiNumber",
					dependent: true
				} as FormFieldType,
				{
					name: "sealNumber",
					label: "Número Selo",
					type: "text",
					required: true,
					sidebarform: true,
					showinmodal: true
				} as FormFieldType,

				{
					name: "interviewerName",
					label: "Nome completo da(o) Entrevistador(a)",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: true,
					showinmodal: true
				} as FormFieldType,
				{
					name: "interviewDate",
					label: "Data da Entrevista",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: false,
					showinmodal: false
				} as FormFieldType,
				{
					name: "startTime",
					label: "Início",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: false,
					showinmodal: false
				} as FormFieldType,
				{
					name: "endTime",
					label: "Término",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: false,
					showinmodal: false
				} as FormFieldType,
				{
					name: "timeElapsed",
					label: "Tempo da Entrevista",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: false,
					showinmodal: false
				} as FormFieldType,

				{
					name: "numberFamilies",
					label: "Quantas familias nesse formulário?",
					type: "number",
					required: true,
					sidebarform: false,
					sidebarlabel: "Quantidade de Famílias",
					showinmodal: false,
					min: 1,
				} as FormFieldType,

				{
					name: "secondVisit",
					label: "Data da Segunda visita",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: false,
					sidebarlabel: "Visita: 2",
					showinmodal: false,
				} as FormFieldType,
				{
					name: "thirdVisit",
					label: "Data da Terceira visita",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: false,
					sidebarlabel: "Visita: 3",
					showinmodal: false,
				} as FormFieldType
			]
		},
	];
	// Function to generate section and field numbers based on position
	const getFieldNumber = (sectionIndex: number, fieldIndex: number) => {
		return `${sectionIndex + 1}.${fieldIndex + 1}`;
	};

	return (
		<div ref={ref} className="text-left" nome-form="Selagem" descr-form="Este formulário tem como objetivo coletar informações dos moradores em situação precária">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					{/* Dialog for metadata fields */}

					<Dialog open={isMetadataModalOpen} onOpenChange={setIsMetadataModalOpen}>

						<DialogContent
							className="max-h-[90vh] overflow-y-auto "
						>

							<DialogHeader>
								<DialogTitle>
									{isEditMode ? `✏️ Editando Selagem ${selagemId}` : "➕ Nova Selagem"}
								</DialogTitle>
								<DialogDescription>
									{isEditMode 
										? `Modifique os dados da selagem existente${loadedSelagemData ? ' (dados carregados)' : ' (carregando...)'}`
										: "Preencha os campos abaixo:"
									}
								</DialogDescription>
							</DialogHeader>

							{metaDataSections.map((section, sectionIndex) => (
								<div key={section.id} data-secao={section.id} data-label={section.title}>
									{/* Verificar se a seção contém o campo "Número SEI" e o estado de "Não se aplica" */}
									<FormSectionRenderer
										section={{
											...section,
											fields: section.fields.map(field => {
												return field;
											})
										}}
										formControl={form.control}
										getFieldNumber={getFieldNumber}
										sectionIndex={sectionIndex}
										handleModalFields={true}
										showSectionLabel={false}
										formValues={{ ...formValues, naoAplica: disableSeiNumber }}
									/>
								</div>
							))}
							<Button
								type="button"
								onClick={async () => {

									handleSetEndTime(); 
									//setIsMetadataModalOpen(false);

									const { questionario, seiNumber, sealNumber, numberFamilies } = form.getValues();

									const values = form.getValues(); // pegar os valores do formulário
									let hasError = false;

									// Validação individual com destaque dos campos
									if (!values.questionario) {
										form.setError("questionario", {
											type: "manual",
											message: "O campo Questionário é obrigatório.",
										});
										hasError = true;
									} else {
										form.clearErrors("questionario");
									}

									if (!values.seiNumber) {
										form.setError("seiNumber", {
											type: "manual",
											message: "O campo Número SEI é obrigatório.",
										});
										hasError = true;
									} else {
										form.clearErrors("seiNumber");
									}

									if (!values.sealNumber) {
										form.setError("sealNumber", {
											type: "manual",
											message: "O campo Número do Selo é obrigatório.",
										});
										hasError = true;
									} else {
										form.clearErrors("sealNumber");
									}

									if (!values.numberFamilies) {
										form.setError("numberFamilies", {
											type: "manual",
											message: "O campo Número de Famílias é obrigatório.",
										});
										hasError = true;
									} else {
										form.clearErrors("numberFamilies");
									}

									// Exibe o alerta se algum erro foi encontrado
									if (hasError) {
										Swal.fire({
											position: "top-end",
											icon: "warning",
											html: `<div class="text-lg text-center break-words w-full -translate-y-2">
													Preencha todos os campos obrigatórios
													</div>`,
											showConfirmButton: false,
											timer: 2000,
											customClass: {
												popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
											},
										});

										return;
									}


									// Monta o objeto conforme a estrutura esperada pela API de selagem
									const dataToSend = {
										created_by: questionario,
										main_metadata: {
											numero_sei: seiNumber,
											numero_selo: sealNumber,
											quantidade_familias: numberFamilies,
										},
										// authorization_token: "seu_token_aqui", // se usar token, inclua aqui
									};

									try {
										const json = await survey_resource.CreateSelagem(API_BASE_URL, dataToSend);
										console.log("Resposta da API:", json);
										setIsMetadataModalOpen(false);
										Swal.fire({
											position: "top-end",
											icon: "success",
											html: `<div class="text-lg text-center break-words w-full -translate-y-2">
										      Selagem cadastrada com sucesso
                                             </div>`,
											showConfirmButton: false,
											timer: 1500,
											customClass: {
												popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
											},
										});

									} catch (error) {
										console.error("Erro ao enviar os dados:", error);
										Swal.fire({
											icon: "error",
											html: `
												<div class="text-lg text-center break-words w-full -translate-y-2">
												Erro ao enviar os dados
												</div>
												<div class="text-sm text-center break-words w-full mt-2">
												Veja o console para mais detalhes.
												</div>
  `,
											showConfirmButton: true,
											confirmButtonText: "Ok",
											customClass: {
												popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
											},
										});

									}
								}}
								className="mt-4"
							>
								Concluir
							</Button>

						</DialogContent>
					</Dialog>

					<div className="flex flex-row justify-between gap-2">
						<div className="text-left text-lg font-bold flex items-center gap-2">
							{isEditMode ? (
								<>
									<span>✏️ Editando Selagem</span>
									{isLoadingData && <span className="text-sm text-blue-600 animate-pulse">(Carregando dados...)</span>}
									{loadedSelagemData && <span className="text-sm text-green-600">({selagemId})</span>}
								</>
							) : (
								<span>➕ Nova Selagem</span>
							)}
						</div>
						<div className="text-right flex flex-row gap-2">
							<h3>Preenchimento:</h3>
							<p className="text-primary">
								{isEditMode && loadedSelagemData ? "Dados carregados" : "0%"}
							</p>
						</div>
					</div>
					<div className="w-full border-t border-gray-300 my-4"></div>
					{/* Always render the IdentRespForm */}
					{familyFields.map((field, index) => (
						<div key={field.id} data-family-index={index} className={`${activeFamilyIndex === index ? 'block' : 'hidden'}`}>
							<IdentEspacoHabitado sectionIndex={0} familyIndex={index} />
							<InfoContatoForm sectionIndex={1} familyIndex={index} />
							<SituUsoUniForm sectionIndex={2} familyIndex={index} />
							<CaractUnidadeForm sectionIndex={3} familyIndex={index} />
							<CaracInfraUrbUnidForm sectionIndex={4} familyIndex={index} />
							<OutrasInfoRelevantesForm sectionIndex={5} familyIndex={index} />
							<StatusNotasForm sectionIndex={6} familyIndex={index} />
							<AnexosForm sectionIndex={7} familyIndex={index} />
						</div>
					))}
				</form>				

			</Form>
		</div >
	)
};

export default FormSelagem;