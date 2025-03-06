import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import {
	Form,
} from "@/components/ui/form"

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
}

const FormArrolamento = ({ ref, defaultValues, onSubmit }: FormArrolamentoProps) => {
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

	// Handle form submission for FormArrolamento
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};


	// Define the form structure using FormFieldType for each field
	const formSections: FormSection[] = [
		{
			id: "identificacao",
			title: "Identificação das Famílias",
			fields: [
				{ 
					name: "seiNumber", 
					label: "Nº SEI", 
					type: "text",
					required: true
				} as FormFieldType,
				{ 
					name: "questionario", 
					label: "Questionário", 
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				
				{ 
					name: "interviewerName", 
					label: "Nome completo da(o) Entrevistador(a)", 
					type: "text",
					required: true
				} as FormFieldType,
				{
					name: "interviewDate",
					label: "Data da Entrevista",
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				{
					name: "startTime",
					label: "Início",
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				{
					name: "endTime",
					label: "Término",
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				{
					name: "timeElapsed",
					label: "Tempo da Entrevista",
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				{
					name: "sealNumber",
					label: "Digite o número do selo",
					type: "text",
					required: true
				} as FormFieldType,
				{
					name: "numberFamilies",
					label: "Quantas familias nesse formulário?",
					type: "text",
					required: true
				} as FormFieldType,
				{
					name: "firstVisit",
					label: "Data da Primeira visita",
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				{
					name: "secondVisit",
					label: "Data da Segunda visita",
					type: "text",
					readonly: true,
					required: true
				} as FormFieldType,
				{
					name: "thirdVisit",
					label: "Data da Terceira visita",
					type: "text",
					readonly: true,
					required: true
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
					{formSections.map((section, sectionIndex) => (
						<div key={section.id} data-secao={section.id} data-label={section.title}>
							<FormSectionRenderer
								section={section}
								formControl={form.control}
								getFieldNumber={getFieldNumber}
								sectionIndex={sectionIndex}
							/>
						</div>
					))}
					<IdentRespForm />
				</form>
			</Form>
		</div>
	)
};

export default FormArrolamento;