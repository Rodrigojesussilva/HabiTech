import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import { getDefaultValuesFromSchema } from "@/utils/formUtils";

import {
	Form,
} from "@/components/ui/form"
import { useEffect, useRef } from "react";
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
import { API_BASE_URL } from "../../../service/constants";
import survey_resource from "../../../service/survey_resource.api"
import Swal from 'sweetalert2'
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
}

const FormArrolamento = ({
	ref,
	defaultValues,
	onSubmit,
	isMetadataModalOpen,
	setIsMetadataModalOpen,
	activeFamilyIndex,
	mostrarSecoes,
	onChangeMostrarSecoes
}: FormArrolamentoProps) => {
	// Initialize the form with react-hook-form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			questionario: "SEHAB-123",
			seiNumber: "",
			interviewerName: "",
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

	// Handle form submission for FormArrolamento
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};

	const ignoreNextCloseRef = useRef(false);

	const handleMetadataModalOpenChange = (isOpen: boolean) => {
		if (isOpen) {
			setIsMetadataModalOpen(true);
			return;
		}

		if (ignoreNextCloseRef.current) {
			ignoreNextCloseRef.current = false;
			setIsMetadataModalOpen(false);
			return;
		}

		// Fecha o modal imediatamente
		setIsMetadataModalOpen(false);

		// Remove o foco para o alert ganhar o foco corretamente
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}

		// Exibe o alerta após fechar o modal
		Swal.fire({
			position: 'top-end', // canto superior direito
			title: "Deseja realmente sair?",
			text: "Os dados preenchidos serão perdidos.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sim, sair",
			cancelButtonText: "Não, continuar preenchendo",
		}).then((result) => {
			if (result.isConfirmed) {
				ignoreNextCloseRef.current = true; // Permite o próximo fechamento
				// Redireciona para home
				window.location.href = "/";
			} else {
				// Reabre o modal para continuar preenchendo
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
					sidebarform: false,
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
					required: true,
					sidebarform: false,
					showinmodal: false
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

		<div ref={ref} className="text-left" nome-form="Arrolamento" descr-form="Este formulário tem como objetivo coletar informações dos moradores em situação precária">
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
								<DialogTitle>Arrolamento</DialogTitle>

								<DialogDescription>
									Preencha os campos abaixo:
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
										created_by: questionario,
										main_metadata: {
											numero_sei: seiNumber,
											numero_selo: sealNumber,
											quantidade_familias: numberFamilies,
										},
									};

									try {
										const json = await survey_resource.CreateArrolamento(API_BASE_URL, dataToSend);
										console.log("Resposta da API:", json);
										setIsMetadataModalOpen(false);
										Swal.fire({
											position: "top-end",
											icon: "success",
											html: `<div class="text-lg text-center break-words w-full -translate-y-2">
													Arrolamento cadastrado com sucesso
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
								Concluir
							</Button>

						</DialogContent>
					</Dialog>

					<div className="flex flex-row justify-between gap-2">
						<div className="text-left text-lg font-bold">
							Arrolamento
						</div>

						<div className="text-right flex flex-row gap-2">
							<h3>Preenchimento:</h3>
							<p className="text-primary">
								0%
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
							/>
							<InfoContatoForm sectionIndex={1} familyIndex={index} />
							{mostrarSecoes && (
								<>
									<SituUsoUniForm sectionIndex={2} familyIndex={index} />
									<DocsForm sectionIndex={3} familyIndex={index} />
									<IdentEtiRacGeneForm sectionIndex={4} familyIndex={index} />
									<NupcidadeForm sectionIndex={5} familyIndex={index} />
									<PessoaDefForm sectionIndex={6} familyIndex={index} />
									<InfoFamiliaForm sectionIndex={7} familyIndex={index} />
								</>
							)}

							<OutrasInfosForm sectionIndex={8} familyIndex={index} />
							<StatusNotasForm sectionIndex={9} familyIndex={index} />
							<AnexosForm sectionIndex={10} familyIndex={index} />

						</div>
					))}
				</form>
			</Form>
		</div >
	)
};

export default FormArrolamento;