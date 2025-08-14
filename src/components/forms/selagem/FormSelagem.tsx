import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import { getDefaultValuesFromSchema } from "@/utils/formUtils";

import {
	Form,
} from "@/components/ui/form"

import { useEffect, useState, useRef } from "react";
import { useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
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
import { SURVEY_RESOURCE_URL, SURVEY_RESOURCE_BASE_URL } from "../../../service/constants";
import survey_resource from "../../../service/survey_resource.api"
import Swal from 'sweetalert2';
import { loadSelagemData  } from './helpers/apiMapper';



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
	sealNumber: z.string().max(9, { message: "Máximo de 9 caracteres" }).optional(),
	numberFamilies: z.number().min(0),
	firstVisitStart: z.string(),
	firstVisitEnd: z.string(),
	secondVisit: z.string(),
	thirdVisit: z.string(),
	families: z.array(familySchema),
	visitNumber: z.string().optional(),
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
	viewMode?: boolean;
}

const FormSelagem = ({
	ref,
	defaultValues,
	onSubmit,
	isMetadataModalOpen,
	setIsMetadataModalOpen,
	activeFamilyIndex,
	viewMode = false
}: FormArrolamentoProps) => {
	const { id: selagemId } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const isEditMode = Boolean(selagemId)
	const [isLoadingData, setIsLoadingData] = useState(false)
	const [loadedSelagemData, setLoadedSelagemData] = useState<any>(null)
	const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false)
	const [finalizing, setFinalizing] = useState(false)
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
	const [saving, setSaving] = useState(false)
	void setSaving;
	// CONTROLE SIMPLES DA TABELA: Determina se está em modo visualização
	const isViewMode = viewMode || loadedSelagemData?.status === 'finalizado' || loadedSelagemData?.readonly === true
	
	const interviewerNameFromStorage = 'Piloto Instrumentos';

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
			firstVisitStart: isEditMode ? "" : new Date().toLocaleString('pt-BR', {
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
			visitNumber: "",
		},
	});
	const formValues = form.getValues(); // Isso retorna todos os valores do formulário.	

	// Calcula automaticamente o número de selagem a partir dos campos da família ativa
	useEffect(() => {
		const subscription: any = (form as any).watch((allValues: any) => {
			try {
				const families = allValues?.families || [];
				const current = families?.[activeFamilyIndex] || {};
				// Seja fiel ao valor exibido no componente: usar exatamente families[...].numeroSelo
				const composed = (current?.numeroSelo ?? "").toString();
				const currentSeal = form.getValues("sealNumber") || "";
				if (composed !== currentSeal) {
					// Limpa o campo antes de atualizar para evitar concatenação visual
					form.setValue("sealNumber", "", { shouldDirty: true, shouldValidate: false });
					form.setValue("sealNumber", composed, { shouldDirty: true, shouldValidate: false });
				}
			} catch {}
		});
		return () => {
			if (typeof subscription === 'function') subscription();
			else if (subscription && typeof subscription.unsubscribe === 'function') subscription.unsubscribe();
		};
	}, [form, activeFamilyIndex]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { setValue, watch } = useForm();
	void setValue;
	const [initialDate] = useState("")
	const [endDate] = useState("")
	
	// Log para debugar valores das datas
	console.log("📅 [FormSelagem] Valores de data inicializados:", {
		initialDate: initialDate,
		endDate: endDate,
		initialDate_empty: initialDate === "",
		endDate_empty: endDate === ""
	});
	// Acessa os valores dos campos
	const naoAplica = watch("naoAplica");  // Assumindo que 'naoAplica' é o campo que será monitorado

	useEffect(() => {
		// Verifica se o campo 'naoAplica' está marcado como verdadeiro
		if (naoAplica) {
			// Limpa o campo 'seiNumber' se a condição for atendida
			form.setValue("seiNumber", "");
		}
	}, [naoAplica, form]);

	// In create route, clear any stale selagem context to force POST
	useEffect(() => {
		if (!selagemId) {
			localStorage.removeItem('selagemId')
			localStorage.removeItem('selagemCreated_by')
			localStorage.removeItem('seiNumberS')
			setLoadedSelagemData(null)
		}
	}, [selagemId])

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
			
			loadSelagemData({
				selagemId,
				setIsLoadingData,
				setLoadedSelagemData,
				form,
				interviewerNameFromStorage
			})
		}
	}, [isEditMode, selagemId, loadedSelagemData, form, interviewerNameFromStorage]);

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
	void handleSetEndTime;
	// Lidar com o envio do formulário para FormArrolamento
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};	

	function isGetSelagemResponse(response: any): response is { selagens: any[] } {
		return response && Array.isArray(response.selagens);
	}

	const fetchSelagem = async (request: any) => {
		console.log("🔍 [fetchSelagem] Iniciando busca com request:", request);
		
		return await survey_resource.GetSelagem(request, async (req: any) => {
			const searchParams = new URLSearchParams();
			
			// Log dos parâmetros de query antes do processamento
			console.log("📋 [fetchSelagem] Query parameters recebidos:", req.query_parameters);
			
			for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
				if (value !== undefined && value !== "") {
					searchParams.append(key, String(value));
					console.log(`✅ [fetchSelagem] Adicionando parâmetro: ${key} = ${value}`);
				} else {
					console.log(`⚠️  [fetchSelagem] Ignorando parâmetro vazio/undefined: ${key} = ${value}`);
				}
			}

			const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
			
			// Log detalhado da requisição
			console.log("🌐 [fetchSelagem] URL final:", url);
			console.log("🔧 [fetchSelagem] Método:", req.method);
			console.log("📤 [fetchSelagem] Headers:", {
				"Content-Type": "application/json",
				...(req.headers || {}),
			});
			console.log("📊 [fetchSelagem] SURVEY_RESOURCE_BASE_URL:", SURVEY_RESOURCE_BASE_URL);
			
			try {
				const res = await fetch(url, {
					method: req.method,
					headers: {
						"Content-Type": "application/json",
						...(req.headers || {}),
					},
				});

				// Log do status da resposta
				console.log("📥 [fetchSelagem] Status da resposta:", res.status);
				console.log("📥 [fetchSelagem] Status text:", res.statusText);
				console.log("📥 [fetchSelagem] Headers da resposta:", Object.fromEntries(res.headers.entries()));

				if (!res.ok) {
					const text = await res.text();
					console.error("❌ [fetchSelagem] Erro HTTP:", {
						status: res.status,
						statusText: res.statusText,
						body: text,
						url: url
					});
					throw new Error(`HTTP ${res.status}: ${text}`);
				}

				const jsonResponse = await res.json();
				console.log("✅ [fetchSelagem] Resposta JSON:", jsonResponse);
				
				// Log específico sobre selagens encontradas
				if (jsonResponse?.selagens) {
					console.log(`📊 [fetchSelagem] Total de selagens encontradas: ${jsonResponse.selagens.length}`);
					if (jsonResponse.selagens.length > 0) {
						console.log("📋 [fetchSelagem] Primeira selagem:", jsonResponse.selagens[0]);
					} else {
						console.warn("⚠️  [fetchSelagem] Nenhuma selagem encontrada no resultado");
					}
				} else {
					console.warn("⚠️  [fetchSelagem] Resposta não contém array 'selagens'");
				}
				
							return jsonResponse;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
			console.error("💥 [fetchSelagem] Erro durante fetch:", {
				error: errorMessage,
				url: url,
				request: req
			});
				throw error;
			}
		});
	};

	const ignoreNextCloseRef = useRef(false);

	const handleSelagemModalOpenChange = async (isOpen: boolean) => {
		console.log('[Selagem][Meta] onOpenChange triggered', { isOpen })
		if (isOpen) {
			setIsMetadataModalOpen(true); // deve existir este state
			console.log('[Selagem][Meta] Modal opening; leaving open=true')
			return;
		}

		if (ignoreNextCloseRef.current) {
			console.log('[Selagem][Meta] ignoreNextCloseRef=true; closing without prompt')
			ignoreNextCloseRef.current = false;
			setIsMetadataModalOpen(false);
			return;
		}

		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}

		try {
			const seiFromStorageRaw = localStorage.getItem("seiNumberS"); // nota: uso de seiNumberS aqui
			const numero_sei = Number(seiFromStorageRaw);

			const request = {
				numero_sei,
				initial_date: initialDate,
				end_date: endDate,
			};

			console.log('[Selagem][Meta] Attempting to close; checking existing record via GET', { request })

			console.log("🎯 [handleSelagemModalOpenChange] Request para buscar selagem:", request);
			console.log("📊 [handleSelagemModalOpenChange] Detalhes do request:", {
				numero_sei: numero_sei,
				numero_sei_type: typeof numero_sei,
				initial_date: initialDate,
				initial_date_type: typeof initialDate,
				end_date: endDate,
				end_date_type: typeof endDate,
				seiFromStorageRaw: seiFromStorageRaw
			});

			const response = await fetchSelagem(request);
			console.log("📨 [handleSelagemModalOpenChange] Response completa:", response);
			
			if (isGetSelagemResponse(response)) {
				console.log("✅ [handleSelagemModalOpenChange] Response é válida (contém array selagens)");
				const selagem = response.selagens?.[0];

				if (selagem) {
					console.log("🎉 [handleSelagemModalOpenChange] Selagem encontrada:", selagem);
					console.log("💾 [handleSelagemModalOpenChange] Salvando no localStorage:", {
						selagemId: selagem.id,
						selagemCreated_by: selagem.created_by
					});

					localStorage.setItem("selagemId", selagem.id);
					localStorage.setItem("selagemCreated_by", selagem.created_by);

					setIsMetadataModalOpen(false);
					console.log('[Selagem][Meta] Existing record found; modal closed without prompt')
					return; // sai da função aqui, não mostra alerta
				} else {
					console.warn("⚠️  [handleSelagemModalOpenChange] Array selagens está vazio ou primeira selagem é null/undefined");
				}
			} else {
				console.error("❌ [handleSelagemModalOpenChange] Response não é válida (não passa no isGetSelagemResponse):", {
					response: response,
					hasSelagens: (response as any)?.selagens !== undefined,
					selagensIsArray: Array.isArray((response as any)?.selagens)
				});
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
			const errorStack = error instanceof Error ? error.stack : undefined;
			const seiFromStorageRaw = localStorage.getItem("seiNumberS");
			const numero_sei = Number(seiFromStorageRaw);
			console.error("💥 [handleSelagemModalOpenChange] Erro ao verificar selagem:", {
				error: errorMessage,
				stack: errorStack,
				request: {
					numero_sei,
					initial_date: initialDate,
					end_date: endDate,
				}
			});
		}

		// Se chegou aqui, não encontrou selagem — mostra alerta
		setIsMetadataModalOpen(false);
		console.log('[Selagem][Meta] No existing record; showing confirm prompt to enforce fill')

		Swal.fire({
			position: "top-end",
			title: "Deseja realmente sair?",
			text: "Os dados preenchidos serão perdidos.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sim, sair",
			cancelButtonText: "Não, continuar preenchendo",
		}).then((result) => {
			if (result.isConfirmed) {
				console.log('[Selagem][Meta] User confirmed exit; redirecting and suppressing next close')
				ignoreNextCloseRef.current = true;
				window.location.href = "/";
			} else {
				console.log('[Selagem][Meta] User canceled exit; re-opening modal')
				setIsMetadataModalOpen(true);
			}
		});
	};

	const handleFinalizeVisit = async () => {
		const effectiveSelagemId = selagemId || loadedSelagemData?.id || localStorage.getItem('selagemId') || ''
		if (!effectiveSelagemId) {
			Swal.fire({ icon: 'error', title: 'Registro sem ID', text: 'Não foi possível identificar o ID da selagem para finalizar. Salve os metadados primeiro.' })
			return
		}
		try {
			setFinalizing(true)
			const token = localStorage.getItem('authToken') || ''
			const createdByFromStorage = localStorage.getItem('userEmail') || ''
			const createdBy = createdByFromStorage || loadedSelagemData?.created_by || interviewerNameFromStorage

			if (!createdBy) {
				Swal.fire({ icon: 'error', title: 'Usuário não identificado', text: 'Não foi possível identificar o usuário criador (created_by). Faça login novamente.' })
				setFinalizing(false)
				return
			}

			// Preenche a data/hora de término no formulário
			const endAt = formatDate()
			form.setValue('firstVisitEnd', endAt)
			form.setValue('endTime', endAt)

			// Coleta status atual se existir no form, senão usa 'Concluida'
			let statusFromForm: string | undefined
			try {
				const firstFamily: any = (form.getValues() as any)?.families?.[0] || {}
				statusFromForm = firstFamily?.status || firstFamily?.statusNotas?.status
			} catch {}

			const payload = {
				id: String(effectiveSelagemId),
				created_by: createdBy,
				main_metadata: {},
				identificacao_espaco_habitado: {},
				identificacao_unidade: {},
				situacao_uso_unidade: {},
				caracteristicas_unidade: {},
				caracteristicas_infra_urbana: {},
				outras_informacoes: {},
				status_notas: {
					status: statusFromForm || 'Concluida',
					justificativa: '',
					nome_supervisor: '',
					observacao: ''
				},
				authorization_token: token,
			}

			await survey_resource.UpdateSelagem(payload as any, async (req: any) => {
				const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
				// Monta headers explicitamente para evitar erro de tipagem e garantir Authorization
				const headersToSend: Record<string, string> = {
					'Content-Type': 'application/json',
				}
				const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
				if (tokenFromReq) {
					headersToSend['Authorization'] = `Bearer ${tokenFromReq}`
				}
				const res = await fetch(url, {
					method: req.method,
					headers: headersToSend,
					body: JSON.stringify(req.body || {}),
				})

				if (!res.ok) {
					const text = await res.text()
					throw new Error(`HTTP ${res.status}: ${text}`)
				}

				return res.json()
			})

			setIsFinalizeModalOpen(false)
			Swal.fire({ icon: 'success', title: 'Visita finalizada!', timer: 1400, showConfirmButton: false })
			setLoadedSelagemData((prev: any) => ({ ...(prev || {}), id: effectiveSelagemId, status: 'finalizado', readonly: true }))
			navigate('/lista-selagens')
		} catch (error) {
			console.error('Erro ao finalizar visita:', error)
			Swal.fire({ icon: 'error', title: 'Erro ao finalizar visita', text: 'Tente novamente.' })
		} finally {
			setFinalizing(false)
		}
	}

	const handleSaveVisit = async () => {
		setIsSaveModalOpen(false)
		navigate('/lista-selagens')
	}

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
					name: "visitNumber",
					label: "Visita Nº",
					type: "text",
					readonly: true,
					required: false,
					sidebarform: true,
					showinmodal: false,
					sidebarlabel: "Visita",
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
					showinmodal: false
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
			{/* Modal de confirmação */}
			<Dialog open={isFinalizeModalOpen} onOpenChange={setIsFinalizeModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Finalizar visita?</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja finalizar esta visita? Após finalizar, os campos ficarão bloqueados.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setIsFinalizeModalOpen(false)} disabled={finalizing}>Cancelar</Button>
						<Button onClick={handleFinalizeVisit} disabled={finalizing} className="bg-green-600 hover:bg-green-700">
							{finalizing ? 'Finalizando...' : 'Finalizar Visita'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Modal de salvar */}
			<Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Salvar alterações?</DialogTitle>
						<DialogDescription>
							Deseja salvar as alterações desta visita?
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setIsSaveModalOpen(false)} disabled={saving}>Cancelar</Button>
						<Button onClick={handleSaveVisit} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
							{saving ? 'Salvando...' : 'Salvar'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					{/* Dialog for metadata fields */}

					<Dialog
						open={isMetadataModalOpen}
						onOpenChange={handleSelagemModalOpenChange}
					>

						<DialogContent
							className={`max-h-[90vh] overflow-y-auto ${isViewMode ? 'bg-gray-50' : ''}`}
						>

							<DialogHeader>
																				<DialogTitle>
													{isViewMode ? `👁️ Visualizando Selagem ${loadedSelagemData?.survey_id ?? form.getValues('seiNumber') ?? ''}` : 
													 isEditMode ? `✏️ Editando Selagem ${loadedSelagemData?.survey_id ?? form.getValues('seiNumber') ?? ''}` : "➕ Nova Selagem"}
												</DialogTitle>
								<DialogDescription>
									{isViewMode ? "Visualização somente leitura" :
									 isEditMode 
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
												return { ...field, readonly: isViewMode || field.readonly };
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
							{/* IMPLEMENTAÇÃO SIMPLES DA TABELA DE CONTROLE */}
							{isViewMode ? (
								// Modo VISUALIZAÇÃO: Apenas fecha o modal
								<Button
									type="button"
									onClick={() => setIsMetadataModalOpen(false)}
									className="mt-4"
									variant="secondary"
								>
									Fechar
								</Button>
							) : (
								// Modo NOVO/EDIÇÃO: Lógica completa de criação/patch
								<Button
									type="button"
									onClick={async () => {
																							console.log("🚀 Iniciando criação/edição de selagem...");

													//setIsMetadataModalOpen(false);

										const { questionario, seiNumber, sealNumber, numberFamilies } = form.getValues();
										console.log("📋 Valores do formulário:", { questionario, seiNumber, sealNumber, numberFamilies });

									const values = form.getValues(); // pegar os valores do formulário
									let hasError = false;

									// Validação individual com destaque dos campos
									console.log("🔍 Iniciando validação dos campos...");

									if (!values.questionario || values.questionario.trim() === '') {
										console.warn("❌ Campo questionario vazio:", values.questionario);
										form.setError("questionario", {
											type: "manual",
											message: "O campo Questionário é obrigatório.",
										});
										hasError = true;
									} else {
										console.log("✅ Campo questionario OK:", values.questionario);
										form.clearErrors("questionario");
									}

									// Só valida SEI se não estiver marcado como "não se aplica"
									if (!values.naoAplica && (!values.seiNumber || values.seiNumber.trim() === '')) {
										console.warn("❌ Campo seiNumber vazio (e não é N/A):", values.seiNumber);
										form.setError("seiNumber", {
											type: "manual",
											message: "O campo Número SEI é obrigatório.",
										});
										hasError = true;
									} else {
										console.log("✅ Campo seiNumber OK (ou N/A):", values.seiNumber);
										form.clearErrors("seiNumber");
									}

									// Removida validação obrigatória de sealNumber

									if (!values.numberFamilies || values.numberFamilies <= 0) {
										console.warn("❌ Campo numberFamilies inválido:", values.numberFamilies);
										form.setError("numberFamilies", {
											type: "manual",
											message: "O campo Número de Famílias deve ser maior que 0.",
										});
										hasError = true;
									} else {
										console.log("✅ Campo numberFamilies OK:", values.numberFamilies);
										form.clearErrors("numberFamilies");
									}

									// Exibe o alerta se algum erro foi encontrado
									if (hasError) {
										console.warn("❌ Validação falhou - campos obrigatórios não preenchidos");
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

									console.log("✅ Validação passou - preparando dados para envio...");

									localStorage.setItem("seiNumberS", String(seiNumber));									
									console.log("📋 Modo de operação:", isEditMode ? "EDIÇÃO (PATCH)" : "CRIAÇÃO (POST)");

									// LÓGICA CONDICIONAL: POST vs PATCH baseada na tabela de controle
									if (isEditMode && selagemId) {
										// MODO EDIÇÃO: Atualizar metadados usando PATCH direto (mesmo padrão dos outros componentes)
										const mainMetadataFormData = {
											created_by: (localStorage.getItem('userEmail') || questionario),
											main_metadata: {
												numero_sei: values.naoAplica ? "N/A" : seiNumber,
												numero_sei_nao_aplicavel: Boolean(values.naoAplica),
											}
										};

										// Se tem sealNumber, também atualizar identificacao_espaco_habitado
										const espacoHabitadoFormData = sealNumber ? {
											created_by: (localStorage.getItem('userEmail') || questionario),
											identificacao_espaco_habitado: {
												numero_selo: sealNumber,
											}
										} : null;

										console.log("📤 Dados para PATCH main_metadata:", mainMetadataFormData);
										if (espacoHabitadoFormData) {
											console.log("📤 Dados para PATCH identificacao_espaco_habitado:", espacoHabitadoFormData);
										}

										try {
											// PATCH 1: Atualizar main_metadata
											console.log("🔄 Atualizando main_metadata para selagem:", selagemId);
											const path = `/v1/selagens/${selagemId}`;
											const url = `${SURVEY_RESOURCE_BASE_URL}${path}`;

											const response1 = await fetch(url, {
												method: "PATCH",
												headers: {
													"Content-Type": "application/json",
												},
												body: JSON.stringify(mainMetadataFormData),
											});

											if (!response1.ok) {
												const errorText = await response1.text();
												console.error("❌ Erro PATCH main_metadata:", response1.status, errorText);
												throw new Error(`Erro na requisição main_metadata: ${response1.status} - ${errorText}`);
											}

											// PATCH 2: Atualizar numero_selo se necessário
											if (espacoHabitadoFormData) {
												console.log("🔄 Atualizando numero_selo...");
												const response2 = await fetch(url, {
													method: "PATCH",
													headers: {
														"Content-Type": "application/json",
													},
													body: JSON.stringify(espacoHabitadoFormData),
												});

												if (!response2.ok) {
													const errorText = await response2.text();
													console.error("❌ Erro PATCH identificacao_espaco_habitado:", response2.status, errorText);
													throw new Error(`Erro na requisição numero_selo: ${response2.status} - ${errorText}`);
												}
											}

											console.log("✅ Selagem atualizada com sucesso");
											setIsMetadataModalOpen(false);
											Swal.fire({
												position: "top-end",
												icon: "success",
												html: `<div class="text-lg text-center break-words w-full -translate-y-2">
													Selagem atualizada com sucesso
												</div>`,
												showConfirmButton: false,
												timer: 1500,
												customClass: {
													popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
												},
											});

										} catch (error) {
											const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
											console.error("❌ Erro ao atualizar selagem:", error);
											
											Swal.fire({
												icon: "error",
												title: "Erro ao atualizar selagem",
												html: `
													<div class="text-lg text-center break-words w-full -translate-y-2">
													Erro ao atualizar os dados
													</div>
													<div class="text-sm text-center break-words w-full mt-2">
													${errorMessage}<br/>
													Veja o console para mais detalhes.
													</div>
												`,
												showConfirmButton: true,
												confirmButtonText: "Ok",
												customClass: {
													popup: "w-[300px] h-[200px] flex flex-col justify-start items-center",
												},
											});
										}
									} else {
										// MODO CRIAÇÃO: Usar POST para criar nova selagem (lógica original)
																			const dataToSend = {
										created_by: (localStorage.getItem('userEmail') || questionario),
										main_metadata: {
												numero_sei: values.naoAplica ? "N/A" : seiNumber,
												numero_selo: sealNumber,
												quantidade_familias: numberFamilies,
											},
											// authorization_token: "seu_token_aqui",
										};

										console.log("📤 Dados para POST (criação):", dataToSend);
										console.log("🌐 URL da API:", SURVEY_RESOURCE_URL);

										try {
											console.log("🚀 Chamando survey_resource.CreateSelagem");
											const json = await survey_resource.CreateSelagem(SURVEY_RESOURCE_BASE_URL, dataToSend);
											console.log("✅ Selagem criada com sucesso:", json);
											if (json?.selagem?.id) {
												setLoadedSelagemData(json.selagem)
												localStorage.setItem('selagemId', json.selagem.id)
												if (json.selagem.visit_count !== undefined) {
													form.setValue('visitNumber', String(json.selagem.visit_count))
												}
											}
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
											const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
											console.error("❌ Erro ao criar selagem:", error);
											
											Swal.fire({
												icon: "error",
												title: "Erro ao criar selagem",
												html: `
													<div class="text-lg text-center break-words w-full -translate-y-2">
													Erro ao enviar os dados
													</div>
													<div class="text-sm text-center break-words w-full mt-2">
													${errorMessage}<br/>
													Veja o console para mais detalhes.
													</div>
												`,
												showConfirmButton: true,
												confirmButtonText: "Ok",
												customClass: {
													popup: "w-[300px] h-[200px] flex flex-col justify-start items-center",
												},
											});
										}
									}
									}}
									className="mt-4"
								>
									{isEditMode ? "Atualizar Selagem" : "Abrir Visita"}
								</Button>
							)}

						</DialogContent>
					</Dialog>

					<div className="flex flex-row justify-between gap-2">
						<div className="text-left text-lg font-bold flex items-center gap-2">
							{isEditMode ? (
								<>
									<span>Editando Selagem</span>
									{isLoadingData && <span className="text-sm text-blue-600 animate-pulse">(Carregando dados...)</span>}
									{loadedSelagemData && <span className="text-sm text-green-600">({loadedSelagemData.survey_id ?? form.getValues('seiNumber') ?? ''})</span>}
								</>
							) : (
								<span>Nova Selagem</span>
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

					{/* Botões de ação no final do formulário */}
					<div className="flex justify-end mt-6 gap-2">
						<Button
							variant="default"
							onClick={(e) => { e.preventDefault(); setIsSaveModalOpen(true) }}
							disabled={isViewMode}
							className="bg-blue-600 hover:bg-blue-700"
						>
							Salvar
						</Button>
						<Button
							variant="default"
							onClick={(e) => { e.preventDefault(); setIsFinalizeModalOpen(true) }}
							disabled={isViewMode}
							className="bg-green-600 hover:bg-green-700"
						>
							Finalizar Visita
						</Button>
					</div>
				</form>

			</Form>
		</div >
	)
};

export default FormSelagem;