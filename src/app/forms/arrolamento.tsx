import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
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
		},
	});

	// Handle form submission
	const handleSubmit = (data: FormValues) => {
		if (onSubmit) {
			onSubmit(data);
		}
		console.log(data);
	};

	return (
		<div ref={ref} className="text-left" nome-form="Arrolamento" descr-form="Este formulário tem como objetivo coletar informações dos moradores em situação precária">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<div data-secao="Identificação do proprietário"></div>
					<h4 className="text-xl font-semibold mb-4">1 - Identificação das Famílias</h4>
					<Separator className="mb-4" />
					<div className="grid grid-cols-1 gap-6">
						{/* Questionário Field */}
						<FormField
							control={form.control}
							name="questionario"
							render={({ field }) => (
								<FormItem>
									<FormLabel>1.1. Questionário *</FormLabel>
									<FormControl>
										<Input
											{...field}
											readOnly
											className="bg-gray-100 cursor-not-allowed"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Nº SEI Field */}
						<FormField
							control={form.control}
							name="seiNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>1.2. Nº SEI *</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Nome do Entrevistador Field */}
						<FormField
							control={form.control}
							name="interviewerName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>1.3.Nome completo da(o) Entrevistador(a) *</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				
					<div data-secao="Documentação"></div>
					<div data-secao="Características da Unidade"></div>
					<div data-secao="Deficiências"></div>

					<Button type="submit" className="mt-4">Salvar</Button>
				</form>
			</Form>
		</div>
	)
};

export default FormArrolamento;