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
import { caracInfraUrbUnidSchema } from "@/components/forms/selagem/definitions/caracInfraUrbUnid.definition";
import { outrasInfoRelevantesSchema } from "@/components/forms/selagem/definitions/outrasInfoRelevantes.definition";
import { statusNotasSchema } from "@/components/forms/selagem/definitions/statusNotas.definition";
import { anexosSchema } from "@/components/forms/selagem/definitions/anexos.definition";

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
								<DialogTitle>Selagem</DialogTitle>
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
								onClick={() => {
									handleSetEndTime(); // Atualiza o valor de firstVisitEnd antes de fechar
									setIsMetadataModalOpen(false);
								}}
								className="mt-4"
							>
								Concluir
							</Button>

						</DialogContent>
					</Dialog>

					<div className="flex flex-row justify-between gap-2">
						<div className="text-left text-lg font-bold">
							Selagem
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
				<div className="w-full border-t border-gray-300 my-4"></div>
				<div className="mt-4 w-full flex justify-start">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
                            onClick={() => {
                                console.log("Botão clicado!");
                            }}
                        >
                            Encerrar formulário
                        </button>
                    </div>
			</Form>
		</div >
	)
};

export default FormSelagem;