import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import {
	Form,
} from "@/components/ui/form"
import { useState, useEffect } from "react";
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
import FormSectionRenderer from "@/components/formController/FormSectionRenderer"

// Import the types from formUtils with a clear alias
import { FormField as FormFieldType, FormSection } from "@/utils/formUtils";

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
	firstVisit: z.string(),
	secondVisit: z.string(),
	thirdVisit: z.string(),
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

const FormArrolamento = ({
	ref,
	defaultValues,
	onSubmit,
	isMetadataModalOpen,
	setIsMetadataModalOpen,
	activeFamilyIndex
}: FormArrolamentoProps) => {
	// Initialize the form with react-hook-form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			questionario: "SEHAB-<123>",
			seiNumber: "",
			interviewerName: "",
			interviewDate: "",
			startTime: "",
			endTime: "",
			timeElapsed: "",
			sealNumber: "",
			numberFamilies: 0,
			firstVisit: "",
			secondVisit: "",
			thirdVisit: "",
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

	// Handle form submission for FormArrolamento
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
					name: "firstVisit",
					label: "Data da Primeira visita",
					type: "text",
					readonly: true,
					required: true,
					sidebarform: true,
					showinmodal: false,
					sidebarlabel: "Visita: 1"
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
					type: "text",
					required: true,
					sidebarform: true,
					sidebarlabel: "Quantidade de Famílias",
					showinmodal: true,
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
		<div ref={ref} className="text-left" nome-form="Arrolamento" descr-form="Este formulário tem como objetivo coletar informações dos moradores em situação precária">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					{/* Dialog for metadata fields */}

					<Dialog open={isMetadataModalOpen} onOpenChange={setIsMetadataModalOpen}>

						<DialogContent className="max-h-[90vh] overflow-y-auto">
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
								onClick={() => setIsMetadataModalOpen(false)}
								className="mt-4"
							>
								Concluir
							</Button>
						</DialogContent>
					</Dialog>


					{/* Always render the IdentRespForm */}
					{Array.from({ length: form.getValues("numberFamilies") }).map((_, index) => (
						<div key={index} data-family-index={index} className={`${activeFamilyIndex === index ? 'block' : 'hidden'}`}>
							<IdentRespForm sectionIndex={0} familyIndex={index} />
						</div>
					))}
				</form>
			</Form>
		</div>
	)
};

export default FormArrolamento;