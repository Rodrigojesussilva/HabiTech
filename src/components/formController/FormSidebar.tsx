import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { useFormMetadata } from '@/hooks/useFormMetadata';


interface FormSidebarProps {
	formRef: React.RefObject<HTMLDivElement | null>;
	children?: React.ReactNode;
	handleFamilyIndexChange: (index: number) => void;
	activeFamilyIndex: number;
	isMetadataModalOpen: boolean;
	setIsMetadataModalOpen: (open: boolean) => void;
	mostrarSecoes: boolean;
}

export default function FormSidebar({ formRef, handleFamilyIndexChange, activeFamilyIndex, isMetadataModalOpen, setIsMetadataModalOpen, mostrarSecoes }: FormSidebarProps) {
	const { form, metadata } = useFormMetadata();
	const [nomeForm, setNomeForm] = useState("");
	const [formDomSections, setFormDomSections] = useState<{
		id: string;
		label: string
	}[]>([]);
	const [activeSection, setActiveSection] = useState<string | null>(null);
	// Estado para forçar re-render quando o form mudar (ex.: form.reset)
	const [formVersion, setFormVersion] = useState(0);
	console.log("formVersion", formVersion);
	// Assinar mudanças do formulário para re-renderizar valores do sidebar
	useEffect(() => {
		if (!form) return;
		const subscription: any = (form as any).watch(() => {
			setFormVersion((v) => v + 1);
		});
		return () => {
			if (typeof subscription === 'function') {
				subscription();
			} else if (subscription && typeof subscription.unsubscribe === 'function') {
				subscription.unsubscribe();
			}
		};
	}, [form]);
	

	// Quando o formulário for montado, ele vai nos dizer quais seções existem
	useEffect(() => {
		const form = formRef?.current || null;
		console.log(nomeForm);
		
		if (form) {
			const nomeForm = form.getAttribute("nome-form");
			setNomeForm(nomeForm || "");

			// Get sections only from the active family
			const activeFamily = form.querySelector(`[data-family-index="${activeFamilyIndex}"]`) as HTMLElement;
			const detectedDomSections =
				activeFamily ?
					Array.from(activeFamily.querySelectorAll("[data-secao]") as NodeListOf<HTMLElement>)
					: [];

			console.log(detectedDomSections);
			setFormDomSections(detectedDomSections.map((el: HTMLElement) => ({
				id: el.getAttribute("data-secao") || "",
				label: el.dataset.label || "",
			})));

			if (detectedDomSections.length > 0 && !activeSection) {
				setActiveSection(detectedDomSections[0].id);
			}
		}
	}, [formRef, activeSection, activeFamilyIndex, isMetadataModalOpen, mostrarSecoes]);


	function handleSectionClick(secaoId: string) {
		setActiveSection(secaoId);

		// Scroll to section
		const form = formRef?.current || null;
		if (form) {
			const sectionElement = form.querySelector(`[data-family-index="${activeFamilyIndex}"]`)?.querySelector(`[data-secao="${secaoId}"]`);
			if (sectionElement) {
				sectionElement.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}
	return (
		
		
		<Card className="hidden lg:block md:block min-w-[250px] max-w-[350px] w-auto h-[calc(100vh-6rem)] sticky self-start top-20 px-2 m-4 overflow-y-auto">
			<h4 className="text-primary text-sm pt-4 pl-2 pb-2  font-bold text-left"> Dados de controle</h4>
			{metadata && form && (
				<div className="mb-2 px-4">
					<div className="grid grid-cols-2 text-left">
						{metadata.fields.filter((field) => field.sidebarform).map((field) => (
							<div
								key={field.name}
								className=" items-center justify-between p-1  cursor-pointer hover:bg-gray-100"
								onClick={() => {
									// When a field is clicked, open the metadata modal
									if (form) {
										setIsMetadataModalOpen(true);
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
			{formDomSections.length > 0 && (
				<>
					<div className="w-full border-gray-200 my-2 border-t-2"></div>
					{/* Ocultar controles de navegação de família para formulário de Selagem */}
					{nomeForm !== "Selagem" && (
						<div className="flex items-center justify-between px-4 mb-4">
							<span className="font-medium text-sm">Família:</span>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleFamilyIndexChange(Math.max(0, activeFamilyIndex - 1))}
									disabled={activeFamilyIndex <= 0}
									className="px-2 py-1"
								>
									&lt;&lt;
								</Button>
								<span className="text-sm font-medium">
									{activeFamilyIndex + 1}/{form?.getValues("numberFamilies") || 1}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleFamilyIndexChange(Math.min((form?.getValues("numberFamilies") || 1) - 1, activeFamilyIndex + 1))}
									disabled={activeFamilyIndex >= (form?.getValues("numberFamilies") || 1) - 1}
									className="px-2 py-1"
								>
									&gt;&gt;
								</Button>
							</div>
						</div>
					)}

					<div className="flex flex-col w-[95%] space-x-4 p-0">
						{formDomSections.map((el: { id: string; label: string }, index: number) => (
							<Button
								key={el.id}
								className={`flex flex-row group ml-4 cursor-pointer shadow-none mb-0 mt-0 w-full bg-transparent hover:bg-secondary hover:text-secundary-foreground   ${activeSection === el.id ? 'bg-secondary text-secundary-foreground' : 'text-secundary-foreground'} mb-0`}
								onClick={() => handleSectionClick(el.id)}
							>
								<div className="w-full flex flex-row">
									
									<span className="text-xs ml-2 text-left truncate">{index + 1}. {el.id} </span>
								</div>

							</Button>
						))}
					</div>
				</>
			)}
		</Card>
	)
}