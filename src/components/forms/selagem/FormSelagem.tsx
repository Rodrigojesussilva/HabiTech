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
import { useParams, useNavigate } from "@/lib/router-compat";
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
import FormCompletionProgress from "@/components/forms/FormCompletionProgress";
import FormPageHeader from "@/components/forms/FormPageHeader";
import { createSelagemSurveyId } from '@/service/demo-record-id'



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
	naoAplica: z.boolean().optional(),
	interviewerName: z.string().min(1, { message: "Nome do entrevistador é obrigatório" }),
	interviewDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	timeElapsed: z.string(),
	visitDurationHours: z.string(),
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

interface FormSelagemProps {
	ref: Ref<HTMLDivElement>;
	defaultValues?: Partial<FormValues>;
	onSubmit?: (data: FormValues) => void;
	isMetadataModalOpen: boolean;
	setIsMetadataModalOpen: (open: boolean) => void;
	activeFamilyIndex: number;
	viewMode?: boolean;
	isMobile?: boolean;
}

const FormSelagem = ({
	ref,
	defaultValues,
	onSubmit,
	isMetadataModalOpen,
	setIsMetadataModalOpen,
	activeFamilyIndex,
	viewMode = false,
	isMobile = false
}: FormSelagemProps) => {
	const { id: selagemId } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const isEditMode = Boolean(selagemId)
	const [newSelagemSurveyId] = useState(() => selagemId ? '' : createSelagemSurveyId())
	const [isLoadingData, setIsLoadingData] = useState(false)
	const [loadedSelagemData, setLoadedSelagemData] = useState<any>(null)
	const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false)
	const [finalizing, setFinalizing] = useState(false)
	// CONTROLE SIMPLES DA TABELA: Determina se está em modo visualização
	const currentUserEmail = localStorage.getItem('userEmail') || ''
	const canUserEditRecord = loadedSelagemData?.created_by === currentUserEmail
	const isViewMode = viewMode || loadedSelagemData?.readonly === true || (isEditMode && !canUserEditRecord)
	console.log(isMobile);
	const [interviewerNameFromStorage] = useState(() => localStorage.getItem('userName') || (localStorage.getItem('userEmail') || '')
		.split('@')[0]
		.replace(/[._-]+/g, ' ')
		.replace(/\b\w/g, (letter) => letter.toLocaleUpperCase('pt-BR')));
	const createDefaults: Partial<FormValues> = {
		questionario: newSelagemSurveyId,
		seiNumber: '',
		naoAplica: false,
		interviewerName: interviewerNameFromStorage,
		interviewDate: '',
		startTime: '',
		endTime: '',
		timeElapsed: '',
		visitDurationHours: '',
		sealNumber: '',
		firstVisitStart: new Date().toLocaleString('pt-BR', {
			day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
		}).replace(',', ' -'),
		firstVisitEnd: '',
		secondVisit: '',
		thirdVisit: '',
		visitNumber: '',
		numberFamilies: 1,
		families: [{}],
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: isEditMode ? defaultValues : createDefaults,
	});
	const progressValues = useWatch({ control: form.control });
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
			localStorage.removeItem('seiNumber')
			localStorage.removeItem('sealNumber')
			localStorage.removeItem('numberFamilies')
			localStorage.removeItem('questionario')
			setLoadedSelagemData(null)
			form.reset(createDefaults)
		}
	}, [selagemId, form, newSelagemSurveyId, interviewerNameFromStorage])

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
		let isCurrent = true
		if (isEditMode && selagemId && !loadedSelagemData) {
			console.log("🔄 Modo edição detectado, carregando dados da selagem:", selagemId)
			
			loadSelagemData({
				selagemId,
				setIsLoadingData,
				setLoadedSelagemData,
				form,
				interviewerNameFromStorage,
				isCurrent: () => isCurrent,
			})
		}
		return () => { isCurrent = false }
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
	// Watch the entire families array to drive conditional section visibility
	const familiesWatch = useWatch({
		control: form.control,
		name: "families",
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

	// Parser para datas no formato "dd/mm/aaaa - HH:MM"
	const parsePtBrDateTime = (value: string): Date | null => {
		if (!value || typeof value !== 'string') return null;
		const parts = value.split(' -');
		if (parts.length !== 2) return null;
		const [datePart, timePart] = parts.map((s) => s.trim());
		const datePieces = datePart.split('/').map((s) => Number(s));
		if (datePieces.length !== 3) return null;
		const [day, month, year] = datePieces; // month 1-12
		const timePieces = timePart.split(':').map((s) => Number(s));
		if (timePieces.length < 2) return null;
		const [hour, minute] = timePieces;
		const d = new Date(year, (month || 1) - 1, day || 1, hour || 0, minute || 0, 0, 0);
		return isNaN(d.getTime()) ? null : d;
	};

	// Calcula e atualiza o campo visitDurationHours conforme regras (aberta/fechada)
	useEffect(() => {
		const computeAndSetDuration = () => {
			try {
				const startStr = form.getValues('firstVisitStart');
				const endStr = form.getValues('firstVisitEnd');
				const start = parsePtBrDateTime(startStr);
				if (!start) {
					form.setValue('visitDurationHours', '');
					return;
				}
				const end = endStr ? parsePtBrDateTime(endStr) : new Date();
				if (!end) {
					form.setValue('visitDurationHours', '');
					return;
				}
				let diffMs = end.getTime() - start.getTime();
				if (diffMs < 0) diffMs = 0;
				const totalMinutes = Math.floor(diffMs / (1000 * 60));
				const hh = Math.floor(totalMinutes / 60);
				const mm = totalMinutes % 60;
				const formatted = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
				form.setValue('visitDurationHours', formatted, { shouldDirty: false, shouldValidate: false });
			} catch {}
		};

		// Recalcular ao abrir, ao mudar início/fim e a cada minuto (para visitas em aberto)
		const subscription: any = (form as any).watch((_: any, info: any) => {
			if (!info || !info.name) return;
			if (info.name === 'firstVisitStart' || info.name === 'firstVisitEnd') {
				computeAndSetDuration();
			}
		});
		computeAndSetDuration();
		const intervalId = setInterval(computeAndSetDuration, 60000);
		return () => {
			if (typeof subscription === 'function') subscription();
			else if (subscription && typeof subscription.unsubscribe === 'function') subscription.unsubscribe();
			clearInterval(intervalId);
		};
	}, [form]);

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
	const handleSelagemModalOpenChange = (isOpen: boolean) => {
		if (isOpen) {
			setIsMetadataModalOpen(true);
			return;
		}
		if (isEditMode || isViewMode) {
			setIsMetadataModalOpen(false);
			return;
		}
		setIsMetadataModalOpen(false);
		navigate('/lista-selagens');
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
			console.log("🔍 [handleFinalizeVisit] Status atual:", statusFromForm);
			const payload = {
				id: String(effectiveSelagemId),
				created_by: createdBy,
				authorization_token: token,
				completed: true,
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
			setLoadedSelagemData((prev: any) => ({ ...(prev || {}), id: effectiveSelagemId, completed: true, completed_at: new Date().toISOString(), readonly: true }))
			navigate('/lista-selagens')
		} catch (error) {
			console.error('Erro ao finalizar visita:', error)
			Swal.fire({ icon: 'error', title: 'Erro ao finalizar visita', text: 'Tente novamente.' })
		} finally {
			setFinalizing(false)
		}
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
					name: "visitDurationHours",
					label: "Tempo em horas",
					type: "text",
					readonly: true,
					required: false,
					sidebarform: true,
					showinmodal: false,
					sidebarlabel: "Duração (h)"
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
							Tem certeza que deseja finalizar esta visita?
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

									if (!values.interviewerName?.trim()) {
										form.setError("interviewerName", {
											type: "manual",
											message: "O nome do entrevistador é obrigatório.",
										});
										hasError = true;
									} else {
										form.clearErrors("interviewerName");
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
									
									// LÓGICA CONDICIONAL: POST vs PATCH baseada no ID efetivo (corrigido para evitar duplicatas)
									const effectiveSelagemId = selagemId || loadedSelagemData?.id || localStorage.getItem('selagemId') || ''
									console.log("🔍 Verificando ID efetivo para decidir operação:", {
										selagemId,
										loadedSelagemDataId: loadedSelagemData?.id,
										localStorageId: localStorage.getItem('selagemId'),
										effectiveSelagemId
									});
									
									console.log("📋 Modo de operação:", effectiveSelagemId ? "EDIÇÃO (PATCH)" : "CRIAÇÃO (POST)");

									if (effectiveSelagemId) {
										// MODO EDIÇÃO/ATUALIZAÇÃO: Atualizar metadados usando PATCH com ID efetivo
										console.log("📝 MODO EDIÇÃO - Atualizando registro existente:", effectiveSelagemId);
										
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
											console.log("🔄 Atualizando main_metadata para selagem:", effectiveSelagemId);
											const path = `/v1/selagens/${effectiveSelagemId}`;
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
										// MODO CRIAÇÃO: Usar POST para criar nova selagem
										console.log("➕ MODO CRIAÇÃO - Criando novo registro");
																			const dataToSend = {
							survey_id: questionario,
										created_by: (localStorage.getItem('userEmail') || questionario),
																main_metadata: {
								numero_sei: values.naoAplica ? "N/A" : seiNumber,
								numero_sei_nao_aplicavel: Boolean(values.naoAplica),
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
												console.log("💾 Registro criado com sucesso - ID salvo:", json.selagem.id);
												if (json.selagem.visit_count !== undefined) {
													form.setValue('visitNumber', String(json.selagem.visit_count))
												}
												const surveyId = json?.selagem?.survey_id || json?.survey_id || json?.selagem?.id || '';
												if (surveyId) {
													form.setValue('questionario', surveyId);
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
									{(selagemId || loadedSelagemData?.id || localStorage.getItem('selagemId')) ? "Atualizar Selagem" : "Abrir Visita"}
								</Button>
							)}

						</DialogContent>
					</Dialog>

					<FormPageHeader
						title={isEditMode ? "Editando Selagem" : "Selagem"}
						description="Identificação e caracterização dos espaços habitados, unidades e condições de ocupação."
						status={
							<>
								{isLoadingData && <span className="text-sm font-normal text-blue-600 animate-pulse">(Carregando dados...)</span>}
								{loadedSelagemData && <span className="text-sm font-normal text-green-600">({loadedSelagemData.survey_id ?? form.getValues('seiNumber') ?? ''})</span>}
							</>
						}
					>
						<FormCompletionProgress schema={formSchema} values={progressValues} />
					</FormPageHeader>
					{/* Always render the IdentRespForm */}
					{familyFields.map((field, index) => (
						<div key={field.id} data-family-index={index} className={`${activeFamilyIndex === index ? 'block' : 'hidden'}`}>
							<IdentEspacoHabitado sectionIndex={0} familyIndex={index} />
							<InfoContatoForm sectionIndex={1} familyIndex={index} />
							<SituUsoUniForm sectionIndex={2} familyIndex={index} />
							{/* Hide sections 4 and 5 when the situation indicates terrain */}
							{(() => {
								const situacaoAtual = familiesWatch?.[index]?.situacaoUsoUnidade;
								const ocultarSecoes4e5 = situacaoAtual === 'TerrenoCercado' || situacaoAtual === 'TerrenoSemCercamento';
								return !ocultarSecoes4e5 ? (
									<>
										<CaractUnidadeForm sectionIndex={3} familyIndex={index} />
										<CaracInfraUrbUnidForm sectionIndex={4} familyIndex={index} />
									</>
								) : null;
							})()}
							<OutrasInfoRelevantesForm sectionIndex={5} familyIndex={index} />
							<StatusNotasForm sectionIndex={6} familyIndex={index} />
							<AnexosForm sectionIndex={7} familyIndex={index} />
						</div>
					))}

					{/* Botões de ação no final do formulário */}
					<div className="flex justify-end mt-6 gap-2">
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
