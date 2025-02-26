import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import IdentRespForm from "./IdentResp.form"
import FormSectionRenderer from "@/components/ui/FormSectionRenderer"

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

// Define possible field types
type FieldType = 'text' | 'select' | 'checkbox' | 'radio';

// Extend the field interface to include type and options
interface FormField {
	name: string;
	label: string;
	type: FieldType;
	readonly?: boolean;
	options?: { label: string; value: string }[];
}

// Define the section type
type FormSection = {
	id: string;
	title: string;
	fields: FormField[];
};

// Create a FormFieldRenderer component
const FormFieldRenderer = ({ 
	field, 
	fieldNumber, 
	formField 
}: { 
	field: FormField; 
	fieldNumber: string; 
	formField: any; 
}) => {
	switch (field.type) {
		case 'text':
			return (
				<FormItem>
					<FormLabel>{fieldNumber}. {field.label} *</FormLabel>
					<FormControl>
						<Input
							{...formField}
							readOnly={field.readonly}
							className={field.readonly ? "bg-gray-100 cursor-not-allowed" : ""}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			);

		case 'select':
			return (
				<FormItem>
					<FormLabel>{fieldNumber}. {field.label} *</FormLabel>
					<Select 
						onValueChange={formField.onChange} 
						defaultValue={formField.value}
					>
						<SelectTrigger>
							<SelectValue placeholder={`Selecione ${field.label}`} />
						</SelectTrigger>
						<SelectContent>
							{field.options?.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			);

		case 'checkbox':
			return (
				<FormItem className="flex flex-row items-start space-x-3 space-y-0">
					<FormControl>
						<Checkbox
							checked={formField.value}
							onCheckedChange={formField.onChange}
						/>
					</FormControl>
					<FormLabel>{fieldNumber}. {field.label} *</FormLabel>
					<FormMessage />
				</FormItem>
			);

		case 'radio':
			return (
				<FormItem>
					<FormLabel>{fieldNumber}. {field.label} *</FormLabel>
					<FormControl>
						<RadioGroup
							onValueChange={formField.onChange}
							defaultValue={formField.value}
						>
							{field.options?.map((option) => (
								<div key={option.value} className="flex items-center space-x-2">
									<RadioGroupItem value={option.value} />
									<FormLabel>{option.label}</FormLabel>
								</div>
							))}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			);

		default:
			return null;
	}
};

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

	// Handle form submission for IdentRespForm
	const handleIdentRespSubmit = (data: any) => {
		console.log("IdentRespForm data:", data);
	};

	// Define the form structure
	const formSections: FormSection[] = [
		{
			id: "identificacao",
			title: "Identificação das Famílias",
			fields: [
				{ 
					name: "seiNumber", 
					label: "Nº SEI", 
					type: "text" 
				},
				{ 
					name: "questionario", 
					label: "Questionário", 
					type: "text",
					readonly: true 
				},
				
				{ 
					name: "interviewerName", 
					label: "Nome completo da(o) Entrevistador(a)", 
					type: "text" 
				},
				{
					name: "interviewDate",
					label: "Data da Entrevista",
					type: "text",
					readonly: true
				},
				{
					name: "startTime",
					label: "Início",
					type: "text",
					readonly: true
				},
				{
					name: "endTime",
					label: "Término",
					type: "text",
					readonly: true
				},
				{
					name: "timeElapsed",
					label: "Tempo da Entrevista",
					type: "text",
					readonly: true
				},
				{
					name: "sealNumber",
					label: "Digite o número do selo",
					type: "text"
				},
				{
					name: "numberFamilies",
					label: "Quantas familias nesse formulário?",
					type: "text"
				},
				{
					name: "firstVisit",
					label: "Data da Primeira visita",
					type: "text",
					readonly: true
				},
				{
					name: "secondVisit",
					label: "Data da Segunda visita",
					type: "text",
					readonly: true
				},
				{
					name: "thirdVisit",
					label: "Data da Terceira visita",
					type: "text",
					readonly: true
				}
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
					<IdentRespForm onSubmit={handleIdentRespSubmit} />
				</form>
			</Form>
		</div>
	)
};

export default FormArrolamento;