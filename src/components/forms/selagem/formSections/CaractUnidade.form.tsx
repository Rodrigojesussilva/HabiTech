import { useState } from "react";

import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	getMergedFormSections,
} from "@/components/forms/selagem/definitions/caractUnidade.definition";

import FormSectionRenderer from "@/components/formController/FormSectionRenderer";


interface CaractUnidadeFormProps {
	sectionIndex?: number;
	familyIndex: number;
}

const CaractUnidadeForm = ({ sectionIndex: sectionNumber, familyIndex }: CaractUnidadeFormProps) => {
	const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);

	//const [ok, setOk] = useState(false);
	const ok = false;

	const form = useFormContext();
	const formValues = form.watch(`families[${familyIndex}]`) || {};

	const [formSections] = useState(getMergedFormSections(formValues));
	
	return (
		<div className="text-left">
			<Collapsible open={mostrarDocumentacao} onOpenChange={setMostrarDocumentacao}>
				<CollapsibleTrigger asChild>
					<div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
						<h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
							{`Seção ${sectionNumber ? sectionNumber + 1 : 3} - ${formSections[0].title}${ok ? " ✅" : ""}`}
						</h4>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					{formSections.map((section, sectionIndex) => (
						<FormSectionRenderer
							key={section.id}
							section={section}
							formControl={form.control}
							getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 3}.${fieldIndex + 1}`}
							sectionIndex={sectionIndex}
							formValues={formValues}
							showSectionLabel={false}
							familyIndex={familyIndex}

						/>
					))}
					
					<div className="mt-4 w-full flex justify-start">
						<button
							type="button"
							className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
							onClick={() => {
								console.log("Botão clicado!");
							}}
						>
							Salvar
						</button>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default CaractUnidadeForm; 