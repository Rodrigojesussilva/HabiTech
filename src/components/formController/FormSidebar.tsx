import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SquareCheckBig, Square } from "lucide-react"
import { useState, useEffect } from "react";
import { useFormMetadata } from '@/hooks/useFormMetadata';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormSectionRenderer from "./FormSectionRenderer";

interface FormSidebarProps {
	formRef: React.RefObject<HTMLDivElement | null>;
	children?: React.ReactNode;
}

export default function FormSidebar({ formRef }: FormSidebarProps) {
	const { form, metadata } = useFormMetadata();
	const [metaDadosForm, setMetaDadosForm] = useState<{
		nomeForm: string;
		descrForm: string;
		nomeSecao: { id: string; label: string }[]
	}>
		({
			nomeForm: "",
			descrForm: "",
			nomeSecao: [],
		});
	const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);
	const [secoesConcluidas, setSecoesConcluidas] = useState<string[]>([]);

	// Quando o formulário for montado, ele vai nos dizer quais seções existem
	useEffect(() => {
		const form = formRef?.current || null;
		if (form) {
			const nomeForm = form.getAttribute("nome-form");
			const descrForm = form.getAttribute("descr-form");
			const secoesDetectadas = Array.from(form.querySelectorAll("[data-secao]") as NodeListOf<HTMLElement>)
				.map((el: HTMLElement) => ({
					id: el.getAttribute("data-secao") || "",
					label: el.dataset.label || "",
				}));

			setMetaDadosForm({
				nomeForm: nomeForm || "",
				descrForm: descrForm || "",
				nomeSecao: secoesDetectadas
			});

			if (secoesDetectadas.length > 0 && !secaoAtiva) {
				setSecaoAtiva(secoesDetectadas[0].id);
			}
		}
	}, [formRef, secaoAtiva]);

	function sectIsChecked(secao: string): boolean {
		return secoesConcluidas.includes(secao);
	}

	function handleSectionClick(secaoId: string) {
		setSecaoAtiva(secaoId);

		// Scroll to section
		const form = formRef?.current || null;
		if (form) {
			const sectionElement = form.querySelector(`[data-secao="${secaoId}"]`);
			if (sectionElement) {
				sectionElement.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}

	const getFieldNumber = (sectionIndex: number, fieldIndex: number) => {
		return null;
	};

	return (
		<Card className="hidden lg:block md:block w-1/4 h-4/5 fixed pl-4 pr-4 m-4 overflow-y-auto">
			<h1 className="text-primary text-lg p-4 mt-6 mb-2 font-bold text-left"> {metaDadosForm.nomeForm}</h1>
			{metadata && form && (
				<div className="mb-8 px-4">
					<div className="grid grid-cols-2 text-left">
						{metadata.fields.filter((field) => field.sidebarform).map((field) => (
							<div 
								key={field.name} 
								className=" items-center justify-between p-1  cursor-pointer hover:bg-gray-100"
								onClick={() => {
									// When a field is clicked, open the metadata modal
									if (form) {
										// Set the current field in focus before opening the modal
										const { setIsMetadataModalOpen } = form.getValues();
										if (typeof setIsMetadataModalOpen === 'function') {
											setIsMetadataModalOpen(true);
										}
									}
								}}
							>
								<div className="flex flex-col">
									<span className="font-medium text-sm">{field.sidebarlabel || field.label || field.name}</span>
									<span className="text-xs text-gray-600">{form.getValues(field.name) || '-'}</span>
								</div>

							</div>
						))}
						

					</div>
				</div>
			)}
			{metaDadosForm.nomeSecao.length > 0 && (
				<div className="flex flex-col w-[95%] space-x-4">
					{metaDadosForm.nomeSecao.map((el: { id: string; label: string }, index: number) => (
						<Button
							key={el.id}
							className={`flex flex-row group ml-4 w-full hover:bg-primary hover:text-primary-foreground text-primary ${secaoAtiva === el.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'} mb-4`}
							onClick={() => handleSectionClick(el.id)}
						>
							<div className="w-full flex flex-row">
								{sectIsChecked(el.id) ? (
									<SquareCheckBig className="h-6 w-6 text-left text-primary group-hover:text-primary-foreground"></SquareCheckBig>
								)
									:
									<Square className="h-6 w-6 text-left text-primary/70 group-hover:text-primary-foreground"></Square>
								}
								<span className="text-xs ml-2 text-left truncate">{index + 1}. {el.id} </span>
							</div>

						</Button>
					))}
				</div>
			)}
		</Card>
	)
}