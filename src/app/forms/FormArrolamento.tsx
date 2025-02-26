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

// Define the form schema with Zod
const formSchema = z.object({
	questionario: z.string(),
	seiNumber: z.string().min(1, { message: "Nº SEI é obrigatório" }),
	interviewerName: z.string().min(1, { message: "Nome do entrevistador é obrigatório" }),
	documentField: z.string().min(1, { message: "Documento é obrigatório" }),
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
			documentField: "",
		},
	});

	// Handle form submission
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};

	// Define the form structure
	const formSections = [
		{
			id: "identificacao",
			title: "Identificação das Famílias",
			fields: [
				{ name: "questionario", label: "Questionário", readonly: true },
				{ name: "seiNumber", label: "Nº SEI" },
				{ name: "interviewerName", label: "Nome completo da(o) Entrevistador(a)" },
			]
		},
		{
			id: "documentacao",
			title: "Documentação",
			fields: [
				{ name: "documentField", label: "Documento" },
			]
		}
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
						<div key={section.id}>
							<div data-secao={section.id}></div>
							<h4 className="text-xl font-semibold mb-4">{sectionIndex + 1} - {section.title}</h4>
							<Separator className="mb-4" />
							<div className="grid grid-cols-1 gap-6">
								{section.fields.map((field, fieldIndex) => (
									<FormField
										key={field.name}
										control={form.control}
										name={field.name as keyof FormValues}
										render={({ field: formField }) => (
											<FormItem>
												<FormLabel>
													{getFieldNumber(sectionIndex, fieldIndex)}. {field.label} *
												</FormLabel>
												<FormControl>
													<Input
														{...formField}
														readOnly={field.readonly}
														className={field.readonly ? "bg-gray-100 cursor-not-allowed" : ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}
							</div>
						</div>
					))}

					<div data-secao="Características da Unidade"></div>
					<div data-secao="Deficiências"></div>

					<Button type="submit" className="mt-4">Salvar</Button>
				</form>
			</Form>
		</div>
	)
};

export default FormArrolamento;