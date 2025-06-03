import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	getMergedFormSections
} from "@/components/forms/arrolamento/definitions/docs.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { estados as fetchEstados, getCidadesOptions } from '../api_estadosCidades';
import { validarData } from "@/components/forms/arrolamento/helpers/docs.helper";

interface DocsFormProps {
	id?: string;
	sectionIndex?: number;
	familyIndex: number;
}

const DocsForm = ({ sectionIndex: sectionNumber, familyIndex }: DocsFormProps) => {
	const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);
	const [estadoOptions, setEstadoOptions] = useState<{ label: string; value: string }[]>([]);
	const [cidadeOptions, setCidadeOptions] = useState<{ label: string; value: string }[]>([]);

	const form = useFormContext();

	// Observar todos os valores da família
	const formValues = form.watch(`families[${familyIndex}]`) || {};
	const ufSelecionada = form.watch(`families[${familyIndex}].uf`);
	const dataExpedicaoRg = form.watch(`families[${familyIndex}].dataExpedicaoRg`);
	// Pegar estrutura dos campos dinâmicos
	let formSections = getMergedFormSections(formValues);

	useEffect(() => {
		validarData(dataExpedicaoRg, familyIndex, "dataExpedicaoRg", form.setValue);
	}, [dataExpedicaoRg, familyIndex, form.setValue]);

	// Validação da data de expedição (mantida como estava)
	useEffect(() => {
		const rawDate = formValues.dataExpedicaoRg;
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
			form.clearErrors(`families[${familyIndex}].dataExpedicaoRg`);
		}
	}, [formValues.dataExpedicaoRg]);

	// Atualiza UF
	useEffect(() => {
		fetchEstados()
			.then(list => {
				const options = list.map(e => ({ label: e.nome, value: e.sigla }));

				// Encontra São Paulo e remove da lista
				const spIndex = options.findIndex(e => e.label === 'São Paulo');
				if (spIndex > -1) {
					const [sp] = options.splice(spIndex, 1); // remove SP
					options.unshift(sp); // adiciona SP no começo
				}

				setEstadoOptions(options);
			})
			.catch(console.error);
	}, []);
	
	// Atualiza cidades ao mudar UF
	useEffect(() => {
		if (!ufSelecionada) {
			setCidadeOptions([]);
			return;
		}
		getCidadesOptions(ufSelecionada)
			.then(setCidadeOptions)
			.catch(console.error);
	}, [ufSelecionada]);

	// Mescla seções e preenche opções dinâmicas
	formSections = getMergedFormSections(formValues).map(section => ({
		...section,
		fields: section.fields.map(field => {
			// Preenche campos de estado (UF) com lista de estados
			if (field.name === 'uf' || field.name === 'estadoEmissaoRg') {
				return {
					...field,
					options: estadoOptions
				};
			}
			if (field.name === 'cidade') {
				return { ...field, options: cidadeOptions };
			}

			return field;
		})
	}));

	return (
		<div className="text-left">
			<Collapsible open={mostrarDocumentacao} onOpenChange={setMostrarDocumentacao}>
				<CollapsibleTrigger asChild>
					<div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
						<h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
							{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}
						</h4>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					{formSections.map((section, sectionIndex) => (
						<FormSectionRenderer
							key={section.id}
							section={section}
							formControl={form.control}
							getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 4}.${fieldIndex + 1}`}
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
