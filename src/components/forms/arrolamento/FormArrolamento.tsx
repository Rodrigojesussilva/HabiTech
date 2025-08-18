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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormMetadata } from '@/hooks/useFormMetadata';
import { useParams, useNavigate } from "react-router-dom";
import useViewMode from '@/hooks/useViewMode';

import IdentRespForm from "./formSections/IdentResp.form"
import InfoContatoForm from "./formSections/InfoContato.form"
import SituUsoUniForm from "./formSections/SituUsoUni.form"
import DocsForm from "./formSections/Docs.form"
import IdentEtiRacGeneForm from "./formSections/IdentEticRacGene.form"
import NupcidadeForm from "./formSections/Nupcidade.form"
import FormSectionRenderer from "@/components/formController/FormSectionRenderer"
import PessoaDefForm from "./formSections/PessoaDef.form"
import InfoFamiliaForm from "./formSections/InfoFamilia.form"
import OutrasInfosForm from "./formSections/OutrasInfos.form"
import StatusNotasForm from "./formSections/StatusNotas.form"
import AnexosForm from "./formSections/anexos.form"

// Import the types from formUtils with a clear alias
import { FormField as FormFieldType, FormSection } from "@/utils/formUtils";
import { identRespSchema } from "@/components/forms/arrolamento/definitions/identResp.definition";
import { infoContatoSchema } from "@/components/forms/arrolamento/definitions/infoContato.definition";
import { situUsoUniSchema } from "@/components/forms/arrolamento/definitions/situUsoUni.definition";
import { docsSchema } from "@/components/forms/arrolamento/definitions/docs.definition";
import { identEticRacGeneSchema } from "@/components/forms/arrolamento/definitions/identEticRacGene.definition";
import { nupcidadeSchema } from "@/components/forms/arrolamento/definitions/nupcidade.definition";
import { pessoaDefSchema } from "@/components/forms/arrolamento/definitions/pessoaDef.definition";
import { infoFamiliaSchema } from "@/components/forms/arrolamento/definitions/infoFamilia.definition";
import { outrasInfosSchema } from "@/components/forms/arrolamento/definitions/outrasInfos.definition";
import { statusNotasSchema } from "@/components/forms/arrolamento/definitions/statusNotas.definition";
import { anexosSchema } from "@/components/forms/arrolamento/definitions/anexos.definition";
import { SURVEY_RESOURCE_URL } from "../../../service/constants";
import survey_resource from "../../../service/survey_resource.api"
import Swal from 'sweetalert2'
import { mapArrolamentoToFormData } from './helpers/apiMapper'
import { useRef } from 'react'
// Define the schema for a single family, integrating IdentResp schema
const familySchema = z.object({
	...identRespSchema.shape,
	...infoContatoSchema.shape,
	...situUsoUniSchema.shape,
	...docsSchema.shape,
	...identEticRacGeneSchema.shape,
	...nupcidadeSchema.shape,
	...pessoaDefSchema.shape,
	...infoFamiliaSchema.shape,
	...outrasInfosSchema.shape,
	...statusNotasSchema.shape,
	...anexosSchema.shape,
});
// Define the form schema with Zod
const formSchema = z.object({
	questionario: z.string(),
	seiNumber: z.string().min(1, { message: "Nº SEI é obrigatório" }),
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
 	visitNumber: z.string().optional(),
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
	mostrarSecoes: boolean;
	onChangeMostrarSecoes: (value: boolean) => void;
	isMobile?: boolean;
}

const FormArrolamento = ({
	ref,
	defaultValues,
	onSubmit,
	isMetadataModalOpen,
	setIsMetadataModalOpen,
	activeFamilyIndex,
	mostrarSecoes,
	onChangeMostrarSecoes,
	isMobile = false
}: FormArrolamentoProps) => {
 	const navigate = useNavigate();
 	const params = useParams();
 		const isViewMode = useViewMode();
	const isEditMode = Boolean(params.id);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [loadedArrolamentoData, setLoadedArrolamentoData] = useState<any>(null);
	const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
	const [finalizing, setFinalizing] = useState(false);
	const [saving, setSaving] = useState(false);
	const serverMainMetadataRef = useRef<any>(null);
   const ignoreNextCloseRef = useRef(false);
	
	const interviewerNameFromStorage = 'Piloto Instrumentos';
	// Initialize the form with react-hook-form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			questionario: "SEHAB-123",
			seiNumber: "",
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
 			visitNumber: "",
			families: [{}],
		},
	});



	const { setForm, setMetadata } = useFormMetadata();
	// removed unused initialDate/endDate



 		// In create route, clear any stale arrolamento context to force POST
	useEffect(() => {
		if (!params.id) {
			localStorage.removeItem('arrolamentoId')
			localStorage.removeItem('arrolamentoCreated_by')
			localStorage.removeItem('seiNumber')
			localStorage.removeItem('sealNumber')
			localStorage.removeItem('numberFamilies')
			localStorage.setItem('arrolamentoCompleted', 'false')
			setLoadedArrolamentoData(null)
		}
	}, [params.id])

	// Share the form and metadata once on mount
	useEffect(() => {
		setForm(form);
		setMetadata(metaDataSections[0]);

		return () => {
			setForm(null);
			setMetadata(null);
		};
	}, []);
	// Limpar erros automaticamente ao digitar nos campos obrigatórios
	useEffect(() => {
		const subscription = form.watch((values, { name }) => {
			if (!name) return;

			if (["questionario", "seiNumber", "sealNumber", "numberFamilies"].includes(name)) {
				const value = values[name as keyof typeof values];
				if (
					value &&
					Object.prototype.hasOwnProperty.call(form.formState.errors, name)
				) {
					form.clearErrors(name as keyof FormValues);
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [form]);


	const { fields: familyFields, append, remove } = useFieldArray({
		control: form.control,
		name: "families",
	});

	// Watch for changes to numberFamilies
	const numberFamilies = useWatch({
		control: form.control,
		name: "numberFamilies",
	});

	// Merge all schemas to create a complete default family entry
	const defaultFamilyEntry = {

		...getDefaultValuesFromSchema(identRespSchema),
		...getDefaultValuesFromSchema(docsSchema),
		...getDefaultValuesFromSchema(infoContatoSchema),
		...getDefaultValuesFromSchema(situUsoUniSchema),
		...getDefaultValuesFromSchema(identEticRacGeneSchema),
		...getDefaultValuesFromSchema(nupcidadeSchema),
		...getDefaultValuesFromSchema(pessoaDefSchema),
		...getDefaultValuesFromSchema(infoFamiliaSchema),
		...getDefaultValuesFromSchema(outrasInfosSchema),
		...getDefaultValuesFromSchema(statusNotasSchema),
		...getDefaultValuesFromSchema(anexosSchema),

	} as const;

	useEffect(() => {
		const currentLength = familyFields.length;
		const targetLength = numberFamilies || 0;

		console.log('[Arrolamento][Families] size change requested', { currentLength, targetLength })

		if (targetLength > currentLength) {
			// Add new entries
			const newEntriesCount = targetLength - currentLength
			console.log('[Arrolamento][Families] appending entries', { count: newEntriesCount })
			for (let idx = 0; idx < newEntriesCount; idx++) {
				// Use a fresh object per entry to avoid shared references
				const entry = JSON.parse(JSON.stringify(defaultFamilyEntry));
				console.log('[Arrolamento][Families] append at', { index: currentLength + idx })
				append(entry)
			}
		} else if (targetLength < currentLength) {
			// Remove excess entries
			console.log('[Arrolamento][Families] removing entries', { from: targetLength, to: currentLength - 1 })
			for (let i = currentLength - 1; i >= targetLength; i--) {
				console.log('[Arrolamento][Families] remove at', { index: i })
				remove(i);
			}
		}
	}, [numberFamilies, familyFields.length, append, remove]);

 	// Load record by id to show survey_id and visit_count
 	useEffect(() => {
 		const load = async () => {
 			if (!params.id) return;
 			setIsLoadingData(true);
 			try {
 				const token = localStorage.getItem('authToken') || ''
 				console.log('[Arrolamento][Load] starting GET by id', { id: params.id, tokenPresent: !!token })
 				const response = await survey_resource.GetArrolamento({ id: params.id, authorization_token: token }, async (req: any) => {
 					const searchParams = new URLSearchParams()
 					for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
 						if (value !== undefined && value !== "") {
 							searchParams.append(key, String(value))
 						}
 					}
 					const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
 					const headers: Record<string, string> = { "Content-Type": "application/json" }
 					const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
 					if (tokenFromReq) headers['Authorization'] = `Bearer ${tokenFromReq}`
 					console.log('[Arrolamento][Load] GET request', { url, headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined } })
 					const res = await fetch(url, { method: req.method, headers })
 					const text = await res.text()
 					let json: any = null; try { json = text ? JSON.parse(text) : null } catch {}
 					console.log('[Arrolamento][Load] GET response', { status: res.status, ok: res.ok, body: json ?? text })
 					if (!res.ok) throw new Error(text)
 					return json
 				})
 				const arrs = (response as any)?.arrolamentos || []
 				const item = arrs[0]
 								if (item) {
					console.log('[Arrolamento][Load] GET success:', item)
					const mapped = mapArrolamentoToFormData(item, interviewerNameFromStorage)
					serverMainMetadataRef.current = item?.survey?.main_metadata || null
 					console.log('[Arrolamento][Load] mapped form data:', mapped)
 					console.log('[Arrolamento][Load] mapped families length:', Array.isArray(mapped.families) ? mapped.families.length : 0)
 					if (Array.isArray(mapped.families)) {
 						mapped.families.forEach((fam: any, idx: number) => {
 							console.log('[Arrolamento][Load] family snapshot', idx + 1, {
 								contato: {
 									telefone1: fam.telefone1,
 									telefone2: fam.telefone2,
 									telefone3: fam.telefone3,
 									telefone4: fam.telefone4,
 								},
 								ident: {
 									nomeCompletoResp: fam.nomeCompletoResp,
 									dataNascimentoResp: fam.dataNascimentoResp,
 									responsavel: fam.responsavel,
 									relacaoResponsavel: fam.relacaoResponsavel,
 								}
 							})
 						})
 					}
 					console.log('[Arrolamento][Load] resetting form with mapped data')
 					form.reset(mapped)
 					const after = form.getValues()
 					console.log('[Arrolamento][Load] form values after reset (snapshot):', {
 						questionario: after.questionario,
 						seiNumber: after.seiNumber,
 						familiesLen: Array.isArray(after.families) ? after.families.length : 0,
 						fam0: after.families?.[0]
 					})
 					setLoadedArrolamentoData(item)
 					localStorage.setItem('arrolamentoId', item.id)
 					localStorage.setItem('arrolamentoCreated_by', item.created_by || '')
 					const isCompleted = !!(item.completed || (item.status_notas && item.status_notas.status === 'Concluida'))
 					localStorage.setItem('arrolamentoCompleted', String(isCompleted))
 					form.setValue('visitNumber', item.visit_count != null ? String(item.visit_count) : '')
 					Swal.fire({ icon: 'success', title: 'Dados carregados', text: `Arrolamento: ${item.survey_id}`, timer: 1400, showConfirmButton: false })
 				}
 			} catch (e) {
 				console.warn('Falha ao carregar arrolamento para exibição do cabeçalho:', e)
 			} finally {
 				setIsLoadingData(false);
 			}
 		}
 		load()
 	}, [params.id, interviewerNameFromStorage])

	// Handle form submission for FormArrolamento
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};

 	const formatDate = (): string => {
 		const now = new Date();
 		return now.toLocaleString('pt-BR', {
 			day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
 		}).replace(',', ' -');
 	}

 	const handleFinalizeVisit = async () => {
 		const effectiveId = params.id || loadedArrolamentoData?.id || localStorage.getItem('arrolamentoId') || ''
 		if (!effectiveId) {
 			Swal.fire({ icon: 'error', title: 'Registro sem ID', text: 'Não foi possível identificar o ID para finalizar. Salve os metadados primeiro.' })
 			return
 		}
 		try {
 			setFinalizing(true)
 			const token = localStorage.getItem('authToken') || ''
 			const createdBy = localStorage.getItem('userEmail') || loadedArrolamentoData?.created_by || localStorage.getItem('arrolamentoCreated_by') || ''
 			if (!createdBy) {
 				Swal.fire({ icon: 'error', title: 'Usuário não identificado', text: 'Não foi possível identificar o usuário criador (created_by). Faça login novamente.' })
 				setFinalizing(false)
 				return
 			}
 			const endAt = formatDate()
 			form.setValue('firstVisitEnd', endAt)
 			form.setValue('endTime', endAt)

 			const payload = {
 				id: String(effectiveId),
 				created_by: createdBy,
 				main_metadata: {},
 				outras_informacoes: {},
 				status_notas: {
 					status: 'Concluida', justificativa: '', nome_supervisor: '', observacao: ''
 				},
 				authorization_token: token,
 			}

 			await survey_resource.UpdateArrolamento(payload as any, async (req: any) => {
 				const url = `${SURVEY_RESOURCE_URL}${req.path}`
 				const headersToSend: Record<string, string> = { 'Content-Type': 'application/json' }
 				const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
 				if (tokenFromReq) headersToSend['Authorization'] = `Bearer ${tokenFromReq}`
 				const res = await fetch(url, { method: req.method, headers: headersToSend, body: JSON.stringify(req.body || {}) })
 				if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
 				return res.json()
 			})

 			setIsFinalizeModalOpen(false)
 			Swal.fire({ icon: 'success', title: 'Visita finalizada!', timer: 1400, showConfirmButton: false })
 			navigate('/lista-arrolamentos')
 		} catch (error) {
 			console.error('Erro ao finalizar visita:', error)
 			Swal.fire({ icon: 'error', title: 'Erro ao finalizar visita', text: 'Tente novamente.' })
 		} finally {
 			setFinalizing(false)
 		}
 	}

 	const handleSaveVisit = async () => {
    try {
      setSaving(true)
      // Apenas fecha o modal de salvar; os PATCHs são automáticos por campo
      setIsSaveModalOpen(false)
      Swal.fire({
        position: 'top-end', icon: 'success', title: 'Alterações salvas', showConfirmButton: false, timer: 1200
      })
    } finally {
      setSaving(false)
    }
  }

	// Modal de metadados: handler simples
	const handleMetadataModalOpenChange = async (isOpen: boolean) => {
        console.log('[Arrolamento][Meta] onOpenChange triggered', { isOpen })
        if (isOpen) {
            setIsMetadataModalOpen(true);
            console.log('[Arrolamento][Meta] Modal opening; leaving open=true')
            return;
        }

        if (ignoreNextCloseRef.current) {
            console.log('[Arrolamento][Meta] ignoreNextCloseRef=true; closing without prompt')
            ignoreNextCloseRef.current = false;
            setIsMetadataModalOpen(false);
            return;
        }

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        try {
            const seiFromStorageRaw = localStorage.getItem('seiNumber') || '';
            const numero_sei = Number(seiFromStorageRaw);
            const request = { numero_sei, authorization_token: localStorage.getItem('authToken') || '' } as any;
            console.log('[Arrolamento][Meta] Attempting to close; checking existing record via GET', { request })

            const response = await survey_resource.GetArrolamento(request, async (req: any) => {
                const searchParams = new URLSearchParams();
                for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
                    if (value !== undefined && value !== "") searchParams.append(key, String(value));
                }
                const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
                const headers: Record<string, string> = { "Content-Type": "application/json", ...(req.headers || {}) };
                const res = await fetch(url, { method: req.method, headers });
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            });

            const arrolamento = (response as any)?.arrolamentos?.[0] || null;
            if (arrolamento) {
                console.log('[Arrolamento][Meta] Existing record found; saving id & created_by to localStorage and closing')
                localStorage.setItem('arrolamentoId', arrolamento.id || '');
                localStorage.setItem('arrolamentoCreated_by', arrolamento.created_by || '');
                setIsMetadataModalOpen(false);
                return;
            }
        } catch (error) {
            // loga e segue para alerta
            console.warn('[Arrolamento][Meta] Falha ao verificar arrolamento ao fechar modal:', error);
        }

        setIsMetadataModalOpen(false);
        console.log('[Arrolamento][Meta] No existing record; showing confirm prompt to enforce fill')
        Swal.fire({
            position: 'top-end',
            title: 'Deseja realmente sair?',
            text: 'Os dados preenchidos serão perdidos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Não, continuar preenchendo',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('[Arrolamento][Meta] User confirmed exit; redirecting and suppressing next close')
                ignoreNextCloseRef.current = true;
                window.location.href = '/';
            } else {
                console.log('[Arrolamento][Meta] User canceled exit; re-opening modal')
                setIsMetadataModalOpen(true);
            }
        });
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
				sidebarlabel: "Visita Nº",
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
				sidebarform: true,
				sidebarlabel: "Quantidade de Famílias",
				showinmodal: true,
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

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
	onChangeMostrarSecoes(e.target.value === 'sim');
};

return (

	<div ref={ref} className={`text-left ${isMobile ? 'pb-20' : ''}`} nome-form="Arrolamento" descr-form="Este formulário tem como objetivo coletar informações dos moradores em situação precária">
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				{/* Dialog for metadata fields */}

				<Dialog
					open={isMetadataModalOpen}
					onOpenChange={handleMetadataModalOpenChange}
				>

					<DialogContent
						className="max-h-[90vh] overflow-y-auto "
					>

						<DialogHeader>
							<DialogTitle>
								{isViewMode ? `👁️ Visualizando Arrolamento ${loadedArrolamentoData?.survey_id ?? form.getValues('seiNumber') ?? ''}` : 
								 isEditMode ? `✏️ Editando Arrolamento ${loadedArrolamentoData?.survey_id ?? form.getValues('seiNumber') ?? ''}` : "➕ Novo Arrolamento"}
							</DialogTitle>

							<DialogDescription>
								{isViewMode ? "Visualização somente leitura" :
								 isEditMode 
									? `Modifique os dados do arrolamento existente${loadedArrolamentoData ? ' (dados carregados)' : ' (carregando...)'}`
									: "Preencha os campos abaixo:"
								}
							</DialogDescription>
						</DialogHeader>

						{/* Render metaDataSections inside the Dialog */}
						{metaDataSections.map((section, sectionIndex) => (
							<div key={section.id} data-secao={section.id} data-label={section.title}>
								<FormSectionRenderer
									section={section}
									formControl={form.control}
									getFieldNumber={getFieldNumber}
									sectionIndex={sectionIndex}
									handleModalFields={true}
									showSectionLabel={false}
								/>
							</div>
						))}

						<Button
							type="button"
							onClick={async () => {
								const { questionario, seiNumber, sealNumber, numberFamilies } = form.getValues();

								const values = form.getValues();
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


								localStorage.setItem("questionario", questionario);
								localStorage.setItem("seiNumber", seiNumber);
								localStorage.setItem("sealNumber", sealNumber);
								localStorage.setItem("numberFamilies", numberFamilies.toString());

								console.log("Valores armazenados no localStorage:");
								console.log("questionario:", localStorage.getItem("questionario"));
								console.log("seiNumber:", localStorage.getItem("seiNumber"));
								console.log("sealNumber:", localStorage.getItem("sealNumber"));
								console.log("numberFamilies:", localStorage.getItem("numberFamilies"));

								const dataToSend = {
									created_by: (localStorage.getItem('userEmail') || questionario),
									main_metadata: {
										numero_sei: seiNumber,
										numero_selo: sealNumber,
										quantidade_familias: numberFamilies,
									},
									authorization_token: localStorage.getItem('authToken') || ''
								};

								try {
									const existingId = params.id || loadedArrolamentoData?.id || ''
									if (!existingId) {
										// Criar (POST)
									const json = await survey_resource.CreateArrolamento(SURVEY_RESOURCE_URL, dataToSend);
									console.log("[Arrolamento][Create] Resposta da API:", json);
									const newId = (json && (json.arrolamento?.id || json.id)) || ''
									const newSurveyId = (json && (json.arrolamento?.survey_id || json.survey_id)) || ''
									const newCreatedBy = (json && (json.arrolamento?.created_by || json.created_by)) || (localStorage.getItem('userEmail') || questionario)
										const newMainMetadata = (json && (json.arrolamento?.survey?.main_metadata || json.survey?.main_metadata)) || dataToSend.main_metadata
									if (newId) {
										localStorage.setItem('arrolamentoId', newId)
										localStorage.setItem('arrolamentoCreated_by', newCreatedBy || '')
										localStorage.setItem('arrolamentoCompleted', 'false')
										setLoadedArrolamentoData({ id: newId, survey_id: newSurveyId, created_by: newCreatedBy, visit_count: 1, completed: false })
											serverMainMetadataRef.current = newMainMetadata || null
										console.log('[Arrolamento][Create] Contexto salvo para PATCH imediato', { newId, newSurveyId, newCreatedBy })
									} else {
										console.warn('[Arrolamento][Create] Não foi possível determinar o id do novo arrolamento a partir da resposta.')
									}
									} else {
 										// Atualizar (PATCH/PUT) main_metadata (quantidade_familias e números)
 										const token = localStorage.getItem('authToken') || ''
 										const createdBy = localStorage.getItem('userEmail') || dataToSend.created_by
 										const currentFamilies = Array.isArray(form.getValues('families')) ? form.getValues('families').length : 0
 										const newFamilies = Number(dataToSend.main_metadata.quantidade_familias)
 										console.log('[Arrolamento][Meta] families count check', { currentFamilies, newFamilies })
 										if (newFamilies < currentFamilies) {
 											Swal.fire({ icon: 'warning', title: 'Número de famílias inválido', text: `O valor (${newFamilies}) é menor que o número de famílias já preenchidas (${currentFamilies}). Ajuste para um valor maior ou igual.`, timer: 2500 })
 											return
 										}
 										// Reconciliar estado do servidor para evitar erros de índice
 										// 1) GET atual do servidor
 										const server = await survey_resource.GetArrolamento({ id: String(existingId), authorization_token: token }, async (req: any) => {
 											const searchParams = new URLSearchParams()
 											for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
 												if (value !== undefined && value !== "") searchParams.append(key, String(value))
 											}
 											const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
 											const headers: Record<string, string> = { "Content-Type": "application/json", ...(req.headers || {}) }
 											const res = await fetch(url, { method: req.method, headers })
 											if (!res.ok) throw new Error(await res.text())
 											return res.json()
 										})
 										const servItem = Array.isArray((server as any)?.arrolamentos) ? (server as any).arrolamentos[0] : null
 										const servMeta = servItem?.survey?.main_metadata || {}
 										const servQF = Number(servMeta?.quantidade_familias || 0)
 										const servForms = Array.isArray(servItem?.survey?.forms) ? servItem.survey.forms : []
 										const servFormsLen = servForms.length
 										console.log('[Arrolamento][Meta] Server state before change', { servQF, servFormsLen })

 										// 3) Atualizar quantidade via PATCH apenas no main_metadata (sem enviar forms)
 										if (newFamilies > servQF) {
 											const patchQtyPayload = {
 												id: String(existingId),
 												created_by: createdBy,
 												main_metadata: {
 													numero_sei: dataToSend.main_metadata.numero_sei,
 													numero_selo: dataToSend.main_metadata.numero_selo,
 													quantidade_familias: newFamilies,
 												},
 												authorization_token: token,
 											}
 											console.log('[Arrolamento][Meta] PATCH main_metadata (increase families) payload', JSON.parse(JSON.stringify(patchQtyPayload)))
 											await survey_resource.PatchArrolamento(patchQtyPayload as any, async (req: any) => {
 												const url = `${SURVEY_RESOURCE_URL}${req.path}`
 												const headers: Record<string, string> = { 'Content-Type': 'application/json' }
 												const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
 												if (tokenFromReq) headers['Authorization'] = `Bearer ${tokenFromReq}`
 												const requestBody = JSON.stringify(req.body || {})
 												console.log('[Arrolamento][Meta] PATCH request (increase families)', { url, headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined }, body: (()=>{ try{return JSON.parse(requestBody)}catch{return requestBody}})() })
 												const res = await fetch(url, { method: req.method, headers, body: requestBody })
 												const text = await res.text()
 												console.log('[Arrolamento][Meta] PATCH response (increase families)', { status: res.status, ok: res.ok, body: (()=>{ try{return JSON.parse(text)}catch{return text}})() })
 												if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
 												return JSON.parse(text)
 											})
 										} else if (newFamilies === servQF) {
 											// Só atualizar SEI/SELO se necessário
 											console.log('[Arrolamento][Meta] Apenas atualização de SEI/SELO sem mudança de quantidade')
 											const patchPayload = {
 												id: String(existingId),
 												created_by: createdBy,
 												main_metadata: {
 													numero_sei: dataToSend.main_metadata.numero_sei,
 													numero_selo: dataToSend.main_metadata.numero_selo,
 													quantidade_familias: newFamilies,
 												},
 												authorization_token: token,
 											}
 											await survey_resource.PatchArrolamento(patchPayload as any, async (req: any) => {
 												const url = `${SURVEY_RESOURCE_URL}${req.path}`
 												const headers: Record<string, string> = { 'Content-Type': 'application/json' }
 												const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
 												if (tokenFromReq) headers['Authorization'] = `Bearer ${tokenFromReq}`
 												const res = await fetch(url, { method: req.method, headers, body: JSON.stringify(req.body || {}) })
 												const text = await res.text()
 												console.log('[Arrolamento][Meta] PATCH response (no-qty-change)', { status: res.status, ok: res.ok, body: (()=>{ try{return JSON.parse(text)}catch{return text}})() })
 												if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
 												return JSON.parse(text)
 											})
 										}

 										// Atualiza baseline local do servidor para o novo estado
 										serverMainMetadataRef.current = { ...dataToSend.main_metadata }
									}

									setIsMetadataModalOpen(false);
									Swal.fire({ position: 'top-end', icon: 'success', title: 'Arrolamento cadastrado com sucesso', showConfirmButton: false, timer: 1500 })

								} catch (error) {
									console.error("Erro ao enviar os dados:", error);
									Swal.fire({
										icon: "error",
										html: `<div class="text-lg text-center break-words w-full -translate-y-2">
												Erro ao enviar os dados<br/>
												<span class="text-sm">Veja o console para mais detalhes.</span>
												</div>`,
										showConfirmButton: true,
										customClass: {
											popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
										},
									});
								}
						}}
						className="mt-4"
					>
						Salvar
						</Button>

					</DialogContent>
				</Dialog>

				<div className="flex flex-row justify-between gap-2">
					<div className="text-left text-lg font-bold flex items-center gap-2">
						{isEditMode ? (
							<>
								<span>Editando Arrolamento</span>
								{isLoadingData && <span className="text-sm text-blue-600 animate-pulse">(Carregando dados...)</span>}
								{loadedArrolamentoData && <span className="text-sm text-green-600">({loadedArrolamentoData.survey_id ?? form.getValues('seiNumber') ?? ''})</span>}
							</>
						) : (
							<span>Novo Arrolamento</span>
						)}
					</div>

					<div className="text-right flex flex-row gap-2">
						<h3>Preenchimento:</h3>
						<p className="text-primary">
							{isEditMode && loadedArrolamentoData ? "Dados carregados" : "0%"}
						</p>
					</div>
				</div>
				<div className="w-full border-t border-gray-300 my-4"></div>
				{/* Always render the IdentRespForm */}
				{familyFields.map((field, index) => (
					<div key={field.id} data-family-index={index} className={`${activeFamilyIndex === index ? 'block' : 'hidden'}`}>
						<IdentRespForm
							sectionIndex={0}
							familyIndex={index}
							onChangeMostrarSecoes={handleSelectChange}
							isActive={activeFamilyIndex === index}
						/>
						<InfoContatoForm sectionIndex={1} familyIndex={index} isActive={activeFamilyIndex === index} />
						{mostrarSecoes && (
							<>
								<SituUsoUniForm sectionIndex={2} familyIndex={index} isActive={activeFamilyIndex === index} />
								<DocsForm sectionIndex={3} familyIndex={index} isActive={activeFamilyIndex === index} />
								<IdentEtiRacGeneForm sectionIndex={4} familyIndex={index} isActive={activeFamilyIndex === index} />
								<NupcidadeForm sectionIndex={5} familyIndex={index} isActive={activeFamilyIndex === index} />
								<PessoaDefForm sectionIndex={6} familyIndex={index} isActive={activeFamilyIndex === index} />
								<InfoFamiliaForm sectionIndex={7} familyIndex={index} isActive={activeFamilyIndex === index} />
							</>
						)}

						<OutrasInfosForm sectionIndex={8} familyIndex={index} isActive={activeFamilyIndex === index} />
						<StatusNotasForm sectionIndex={9} familyIndex={index} isActive={activeFamilyIndex === index} />
						<AnexosForm sectionIndex={10} familyIndex={index} />

					</div>
				))}

 								{/* Botões finais */}
				<div className={`flex flex-row justify-end gap-2 mt-6 ${isMobile ? 'mb-20' : ''}`}>
 					<Button type="button" variant="outline" disabled={isViewMode || saving} onClick={() => setIsSaveModalOpen(true)}>
 						{saving ? 'Salvando...' : 'Salvar'}
 					</Button>
 					<Button type="button" className="bg-green-600 hover:bg-green-700" disabled={isViewMode || finalizing} onClick={() => setIsFinalizeModalOpen(true)}>
 						{finalizing ? 'Finalizando...' : 'Finalizar Visita'}
 					</Button>
 				</div>

 				{/* Modal de confirmação de finalização - padrão Selagem */}
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

 				{/* Modal de salvar - padrão Selagem */}
 				<Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
 					<DialogContent>
 						<DialogHeader>
 							<DialogTitle>Salvar</DialogTitle>
 							<DialogDescription>
 								Pressione salvar para fechar.
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
			</form>
		</Form>
	</div >
)
};

export default FormArrolamento;