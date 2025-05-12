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
	formatarData
} from "@/components/forms/arrolamento/helpers/docs.helper";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";


interface DocsFormProps {
	sectionIndex?: number;
	familyIndex: number;
}

const DocsForm = ({ sectionIndex: sectionNumber, familyIndex }: DocsFormProps) => {
	const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);
	const [ok, setOk] = useState(false);

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

	useEffect(() => {
		const rawDate = formValues.dataExpedicaoRg;

		// Verifica se a data foi completamente preenchida
		if (rawDate && rawDate.length === 10) {
			const [day, month, year] = rawDate.split('/');
			const date = new Date(`${year}-${month}-${day}`);
			const today = new Date();

			if (!isNaN(date.getTime())) {
				let diffInYears = today.getFullYear() - date.getFullYear();
				const monthDiff = today.getMonth() - date.getMonth();
				const dayDiff = today.getDate() - date.getDate();

				if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
					diffInYears--;
				}

				if (diffInYears >= 10) {
					form.setError(`families[${familyIndex}].dataExpedicaoRg`, {
						type: "manual",
						message: "A data de expedição tem mais de 10 anos.",
					});
				} else {
					form.clearErrors(`families[${familyIndex}].dataExpedicaoRg`);
				}
			}
		} else {
			// Limpa o erro enquanto a data ainda está sendo digitada
			form.clearErrors(`families[${familyIndex}].dataExpedicaoRg`);
		}
	}, [formValues.dataExpedicaoRg]);

	// Apenas aplica a máscara de data ao digitar
	useEffect(() => {
		const rawDate = formValues.dataExpedicaoRg;
		const formattedDate = formatarData(rawDate);

		// Atualiza o valor no formulário apenas se a formatação mudar algo
		if (rawDate !== formattedDate) {
			form.setValue(`families[${familyIndex}].dataExpedicaoRg`, formattedDate);
		}
	}, [formValues.dataExpedicaoRg, form, familyIndex]);
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

				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default DocsForm; 