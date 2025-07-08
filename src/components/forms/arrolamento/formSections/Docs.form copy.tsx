import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	getMergedFormSections
} from "@/components/forms/arrolamento/definitions/docs.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { estados as fetchEstados, getCidadesOptions } from '../api_estadosCidades';
import { validarData, DataValidade } from "@/components/forms/arrolamento/helpers/docs.helper";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { mask, unMask } from 'remask';
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
	const dataValidadePassaporte = form.watch(`families[${familyIndex}].dataValidadePassaporte`);

	// Pegar estrutura dos campos dinâmicos
	let formSections = getMergedFormSections(formValues);

	useEffect(() => {
		validarData(dataExpedicaoRg, familyIndex, "dataExpedicaoRg", form.setValue);
	}, [dataExpedicaoRg, familyIndex, form.setValue]);

	useEffect(() => {
		DataValidade(dataValidadePassaporte, familyIndex, "dataValidadePassaporte", form.setValue);
	}, [dataValidadePassaporte, familyIndex, form.setValue]);

	// Validação da data de expedição
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

	useEffect(() => {
		const pathCpf = `families[${familyIndex}].cpf`;
		const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;
		const pathExpedicao = `families[${familyIndex}].dataExpedicaoRg`;
		const pathFonteCpf = `families[${familyIndex}].fonteCpf`;

		const fonteCpf = form.getValues(pathFonteCpf);

		// 🔥 Se NÃO for CIN, limpa os erros do CPF e sai do efeito
		if (fonteCpf !== 'cin') {
			form.clearErrors(pathCpf);
			return;
		}

		// 🔥 Só executa a lógica abaixo se a fonte CPF for 'cin'
		const cpfRaw = form.getValues(pathCpf);
		const nascimentoRaw = form.getValues(pathNascimento);
		const expedicaoRaw = form.getValues(pathExpedicao);

		form.clearErrors(pathCpf);

		if (cpfRaw) {
			const onlyNumbers = unMask(cpfRaw);
			const maskedCpf = mask(onlyNumbers, ['999.999.999-99']);
			form.setValue(pathCpf, maskedCpf, { shouldValidate: false });

			if (!cpfValidator.isValid(onlyNumbers)) {
				form.setError(pathCpf, {
					type: 'manual',
					message: 'CPF inválido.',
				});
				return;
			}

			if (nascimentoRaw?.length === 10 && expedicaoRaw?.length === 10) {
				const [bd, bm, by] = nascimentoRaw.split('/');
				const [ed, em, ey] = expedicaoRaw.split('/');

				const birthDate = new Date(`${by}-${bm}-${bd}`);
				const expedicaoDate = new Date(`${ey}-${em}-${ed}`);
				const today = new Date();

				if (!isNaN(birthDate.getTime()) && !isNaN(expedicaoDate.getTime())) {
					let age = today.getFullYear() - birthDate.getFullYear();
					const monthDiff = today.getMonth() - birthDate.getMonth();

					if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
						age--;
					}

					let validadeAnos: number | 'permanente' = 10;
					if (age <= 11) validadeAnos = 5;
					else if (age >= 60) validadeAnos = 'permanente';

					if (validadeAnos === 'permanente') {
						form.setError(pathCpf, {
							type: 'manual',
							message: 'Documento permanente (idoso). Sem necessidade de renovação.',
						});
					} else {
						const validadeDate = new Date(expedicaoDate);
						validadeDate.setFullYear(validadeDate.getFullYear() + validadeAnos);

						if (validadeDate < today) {
							form.setError(pathCpf, {
								type: 'manual',
								message: `O documento está vencido. Válido por ${validadeAnos} anos a partir da expedição.`,
							});
						}
					}
				}
			}
		}

	}, [
		form.watch(`families[${familyIndex}].cpf`),
		form.watch(`families[${familyIndex}].dataNascimentoResp`),
		form.watch(`families[${familyIndex}].dataExpedicaoRg`),
		form.watch(`families[${familyIndex}].fonteCpf`), // 👈 Observa também mudanças na fonte
	]);

	// Validação da validade do passaporte para maiores de 18 anos ou emanciapados
	useEffect(() => {
		const idadeRaw = formValues.idadeResp;
		const idade = Number(idadeRaw);
		const rawDate = formValues.dataValidadePassaporte;
		const pessoaEmancipada = formValues.pessoaEmancipada;

		// Limpa erro no início
		form.clearErrors(`families[${familyIndex}].dataValidadePassaporte`);

		// 1. Verifica se idade foi informada
		if (!idadeRaw || isNaN(idade)) {
			form.setError(`families[${familyIndex}].dataValidadePassaporte`, {
				type: "manual",
				message: "Informe a idade da pessoa responsável.",
			});
			return;
		}

		// 2. Se idade for 16 ou 17, verifica se emancipação foi informada
		if ((idade === 16 || idade === 17) && (pessoaEmancipada === undefined || pessoaEmancipada === "")) {
			form.setError(`families[${familyIndex}].dataValidadePassaporte`, {
				type: "manual",
				message: "Informe se a pessoa é emancipada.",
			});
			return;
		}

		// 3. Regras de quem deve validar a validade do passaporte
		const isEmancipado = pessoaEmancipada === "sim" || pessoaEmancipada === true || pessoaEmancipada === "true";
		const deveValidar = idade >= 18 || ((idade === 16 || idade === 17) && isEmancipado);

		// 4. Se deve validar, verifica se data está válida
		if (deveValidar) {
			if (!rawDate || rawDate.length !== 10) {
				form.setError(`families[${familyIndex}].dataValidadePassaporte`, {
					type: "manual",
					message: "Informe uma data de validade válida no formato DD/MM/AAAA.",
				});
				return;
			}

			const [day, month, year] = rawDate.split('/');
			const validadeDate = new Date(`${year}-${month}-${day}`);
			const today = new Date();

			if (isNaN(validadeDate.getTime())) {
				form.setError(`families[${familyIndex}].dataValidadePassaporte`, {
					type: "manual",
					message: "Data de validade do passaporte inválida.",
				});
				return;
			}

			const dezAnosAtras = new Date();
			dezAnosAtras.setFullYear(today.getFullYear() - 10);

			if (validadeDate <= dezAnosAtras) {
				form.setError(`families[${familyIndex}].dataValidadePassaporte`, {
					type: "manual",
					message: "A validade do passaporte ultrapassa 10 anos, o que não é permitido para maiores de 18 anos ou menores emancipados.",
				});
			}
		}
	}, [
		formValues.idadeResp,
		formValues.dataValidadePassaporte,
		formValues.pessoaEmancipada
	]);


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
