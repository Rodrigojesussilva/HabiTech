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
import { SURVEY_RESOURCE_URL, CURRENT_API, API_BASE_URL } from "../../../service/constants";
import survey_resource from "../../../service/survey_resource.api"
import Swal from 'sweetalert2';
import { loadSelagemData, LoadSelagemDataParams } from './helpers/apiMapper';
import SelagemDebugPanel from '../../debug/SelagemDebugPanel';
import ApiConnectionTester from '../../debug/ApiConnectionTester';
import ApiStatusIndicator from '../../debug/ApiStatusIndicator';


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
	const [initialDate] = useState("")
	const [endDate] = useState("")
	// Acessa os valores dos campos
	const naoAplica = watch("naoAplica");  // Assumindo que 'naoAplica' é o campo que será monitorado

	useEffect(() => {
		// Verifica se o campo 'naoAplica' está marcado como verdadeiro
		if (naoAplica) {
			// Limpa o campo 'seiNumber' se a condição for atendida
			form.setValue("seiNumber", "");
		}
	}, [naoAplica, form]);
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
		return await survey_resource.GetSelagem(request, async (req: any) => {
			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
				if (value !== undefined && value !== "") {
					searchParams.append(key, String(value));
				}
			}

			const url = `${API_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
			const res = await fetch(url, {
				method: req.method,
				headers: {
					"Content-Type": "application/json",
					...(req.headers || {}),
				},
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(`HTTP ${res.status}: ${text}`);
			}

			return res.json();
		});
	};

	const ignoreNextCloseRef = useRef(false);

	const handleSelagemModalOpenChange = async (isOpen: boolean) => {
		if (isOpen) {
			setIsMetadataModalOpen(true); // deve existir este state
			return;
		}

		if (ignoreNextCloseRef.current) {
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

			console.log("Request para buscar selagem:", request);

			const response = await fetchSelagem(request);
			if (isGetSelagemResponse(response)) {
				const selagem = response.selagens?.[0];

				if (selagem) {
					console.log("Selagem encontrada:", selagem);

					localStorage.setItem("selagemId", selagem.id);
					localStorage.setItem("selagemCreated_by", selagem.created_by);

					setIsMetadataModalOpen(false);
					return; // sai da função aqui, não mostra alerta
				}
			}
		} catch (error) {
			console.error("Erro ao verificar selagem:", error);
		}

		// Se chegou aqui, não encontrou selagem — mostra alerta
		setIsMetadataModalOpen(false);

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
				ignoreNextCloseRef.current = true;
				window.location.href = "/";
			} else {
				setIsMetadataModalOpen(true);
			}
		});
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
			{/* API Status Indicator (fixed position) */}
			<ApiStatusIndicator />
			
			{/* Debug Panels (only in localhost) */}
			<ApiConnectionTester className="mb-4" />
			<SelagemDebugPanel className="mb-4" />
			
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					{/* Dialog for metadata fields */}

					<Dialog
						open={isMetadataModalOpen}
						onOpenChange={handleSelagemModalOpenChange}
					>

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
									console.log("🚀 Iniciando criação de nova selagem...");

									handleSetEndTime();
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

									if (!values.sealNumber || values.sealNumber.trim() === '') {
										console.warn("❌ Campo sealNumber vazio:", values.sealNumber);
										form.setError("sealNumber", {
											type: "manual",
											message: "O campo Número do Selo é obrigatório.",
										});
										hasError = true;
									} else {
										console.log("✅ Campo sealNumber OK:", values.sealNumber);
										form.clearErrors("sealNumber");
									}

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



									localStorage.setItem("seiNumberS", seiNumber);

									console.log("Valores armazenados no localStorage:");
									console.log("seiNumber:", localStorage.getItem("seiNumberS"));



									const dataToSend = {
										created_by: questionario,
										main_metadata: {
											numero_sei: values.naoAplica ? "N/A" : seiNumber,
											numero_selo: sealNumber,
											quantidade_familias: numberFamilies,
										},
										// authorization_token: "seu_token_aqui", // se usar token, inclua aqui
									};

									console.log("📤 Dados preparados para envio:", dataToSend);
									console.log("🌐 URL da API que será usada:", SURVEY_RESOURCE_URL);
									console.log("🔧 Configuração de ambiente:", {
										hostname: window.location.hostname,
										isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
										forceProduction: localStorage.getItem('FORCE_PRODUCTION'),
										currentAPI: CURRENT_API,
										surveyResourceUrl: SURVEY_RESOURCE_URL
									});

									try {
										console.log("🚀 Chamando survey_resource.CreateSelagem com URL:", SURVEY_RESOURCE_URL);
										const json = await survey_resource.CreateSelagem(SURVEY_RESOURCE_URL, dataToSend);
										console.log("✅ Resposta da API:", json);
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
										const errorStack = error instanceof Error ? error.stack : undefined;
										
										console.error("❌ Erro detalhado ao criar selagem:", {
											error: error,
											message: errorMessage,
											stack: errorStack,
											dataToSend: dataToSend,
											apiUrl: SURVEY_RESOURCE_URL
										});
										
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
									<span>Editando Selagem</span>
									{isLoadingData && <span className="text-sm text-blue-600 animate-pulse">(Carregando dados...)</span>}
									{loadedSelagemData && <span className="text-sm text-green-600">({selagemId})</span>}
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
				</form>

			</Form>
		</div >
	)
};

export default FormSelagem;