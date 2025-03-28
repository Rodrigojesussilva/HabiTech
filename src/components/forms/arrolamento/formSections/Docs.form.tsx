import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	getMergedFormSections,
} from "@/components/forms/arrolamento/definitions/docs.definition";
import {
	getCountryOptions,
	getStateOptions,
	getCityOptions,
} from "@/components/forms/arrolamento/helpers/docs.helper";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";


interface DocsFormProps {
	sectionIndex?: number;
	familyIndex: number;
}

const DocsForm = ({ sectionIndex: sectionNumber, familyIndex }: DocsFormProps) => {
	const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);
	

	const form = useFormContext();
	const formValues = form.watch(`families[${familyIndex}]`) || {};

	const [formSections, setFormSections] = useState(getMergedFormSections(formValues));

	useEffect(() => {


		const updatedSectionsWithoutOptions = getMergedFormSections(formValues);
	
		const updatedSections = updatedSectionsWithoutOptions.map(section => {			
			const updatedFields = section.fields.map(field => {
		
				let updatedField = field;
				
				if (field.name === "paisOrigem") {
					updatedField = { ...field, options: getCountryOptions() };
					console.log("Updated paisOrigem field with countryOptions");
				} else if (field.name === "uf") {
					updatedField = { ...field, options: getStateOptions() };
					console.log("Updated uf field with state options");
				} else if (field.name === "cidade" && formValues.uf) {
					updatedField = { ...field, options: getCityOptions(formValues.uf) };
					console.log("Updated cidade field with city options for", formValues.uf);
				} else if (field.name === "estadoEmissaoRg") {
					updatedField = { ...field, options: getStateOptions() };
					console.log("Updated estadoEmissaoRg field with state options");
				}
				
				return updatedField;
			});
			
			return { ...section, fields: updatedFields };
		});
		setFormSections(updatedSections);
	}, [formValues.paisOrigem, formValues.uf]);




	return (
		<div className="text-left">
			<Collapsible open={mostrarDocumentacao} onOpenChange={setMostrarDocumentacao}>
				<CollapsibleTrigger asChild>
					<div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
						<h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
							{`Seção ${sectionNumber ? sectionNumber + 1 : 3} - ${formSections[0].title}`}
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

				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default DocsForm; 