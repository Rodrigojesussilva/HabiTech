import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SquareCheckBig, Square } from "lucide-react"
import { useState, useEffect } from "react";
import { useFormMetadata } from '@/hooks/useFormMetadata';


interface FormSidebarProps {
	formRef: React.RefObject<HTMLDivElement | null>;
	children?: React.ReactNode;
	handleFamilyIndexChange: (index: number) => void;
	activeFamilyIndex: number;
	isMetadataModalOpen: boolean;
	setIsMetadataModalOpen: (open: boolean) => void;
}

export default function FormSidebar({ formRef, handleFamilyIndexChange, activeFamilyIndex, isMetadataModalOpen, setIsMetadataModalOpen }: FormSidebarProps) {
	const { form, metadata } = useFormMetadata();
	const [nomeForm, setNomeForm] = useState("");
	const [formDomSections, setFormDomSections] = useState<{
		id: string;
		label: string
	}[]>([]);
	const [activeSection, setActiveSection] = useState<string | null>(null);
	const [secoesConcluidas, setSecoesConcluidas] = useState<string[]>([]);

	// Quando o formulário for montado, ele vai nos dizer quais seções existem
	useEffect(() => {
		const form = formRef?.current || null;
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
	}, [formRef, activeSection, activeFamilyIndex, isMetadataModalOpen]);

	function sectIsChecked(secao: string): boolean {
		return secoesConcluidas.includes(secao);
	}

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

	const getFieldNumber = (sectionIndex: number, fieldIndex: number) => {
		return null;
	};

	return (
		<Card className="hidden lg:block md:block w-1/4 h-4/5 fixed pl-4 pr-4 m-4 overflow-y-auto">
			<h1 className="text-primary text-lg p-4 mt-6 mb-2 font-bold text-left"> {nomeForm}</h1>
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
					<div className="w-full border-gray-200 my-4 border-t-2"></div>
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

					<div className="flex flex-col w-[95%] space-x-4">
						{formDomSections.map((el: { id: string; label: string }, index: number) => (
							<Button
								key={el.id}
								className={`flex flex-row group ml-4 w-full hover:bg-primary hover:text-primary-foreground text-primary ${activeSection === el.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'} mb-4`}
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
				</>
			)}
		</Card>
	)
}