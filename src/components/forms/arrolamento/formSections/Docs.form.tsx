import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	getMergedFormSections
} from "@/components/forms/arrolamento/definitions/docs.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { estados as fetchEstados, getCidadesOptions } from '../../../cidades_estados/api_estadosCidades';
import { validarData, DataValidade } from '../helpers/docs.helper';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { mask, unMask } from 'remask';
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import useViewMode from '@/hooks/useViewMode'
import { estados } from '@/components/cidades_estados/estados';
import { cidadesLocais } from '@/components/cidades_estados/cidade'; // cidades.ts gerado
interface DocsFormProps {
	id?: string;
	sectionIndex?: number;
	familyIndex: number;
	isActive?: boolean;
}

const DocsForm = ({ sectionIndex: sectionNumber, familyIndex, isActive = true }: DocsFormProps) => {

	const isViewMode = useViewMode();
	const isCompletedNow = () => localStorage.getItem('arrolamentoCompleted') === 'true';
	const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);
	const [estadoOptions, setEstadoOptions] = useState<{ label: string; value: string }[]>([]);
	const [cidadeOptions, setCidadeOptions] = useState<{ label: string; value: string }[]>([]);
	const [initialDate] = useState("")
	const [endDate] = useState("")
	const form = useFormContext();
	const hasSectionBeenOpenedRef = useRef(false);
	const firstBlurSkippedRef = useRef(false);


	// Observar todos os valores da família
	const formValues = form.watch(`families[${familyIndex}]`) || {};
	const ufSelecionada = form.watch(`families[${familyIndex}].uf`);
	const dataExpedicaoRg = form.watch(`families[${familyIndex}].dataExpedicaoRg`);
	const dataExpedicaoRnm = form.watch(`families[${familyIndex}].dataExpedicaoRnm`);
	const dataExpedicaoCrnm = form.watch(`families[${familyIndex}].dataExpedicaoCrnm`);
	const dataExpedicaoCin = form.watch(`families[${familyIndex}].dataExpedicaoCIN`);
	const dataExpedicaoPassaporte = form.watch(`families[${familyIndex}].dataExpedicaoPassaporte`);
	const Cidade = form.watch(`families[${familyIndex}].cidade`);
	const Cpf = form.watch(`families[${familyIndex}].cpf`);
	const Documentacao = form.watch(`families[${familyIndex}].documentacao`);
	const estadoEmissaoRG = form.watch(`families[${familyIndex}].estadoEmissaoRg`);
	const fonteCpf = form.watch(`families[${familyIndex}].fonteCpf`);
	const numeroCrnm = form.watch(`families[${familyIndex}].numeroCrnm`);
	const numeroPassaporte = form.watch(`families[${familyIndex}].numeroPassaporte`);
	const numeroProtoccolo = form.watch(`families[${familyIndex}].numeroProtocolo`);
	const numeroRnm = form.watch(`families[${familyIndex}].numeroRnm`);
	const orgaoExpedidor = form.watch(`families[${familyIndex}].orgaoExpedidor`);
	const paisOrigem = form.watch(`families[${familyIndex}].paisOrigem`);
	const Rg = form.watch(`families[${familyIndex}].rg`);
	const StatusCrnm = form.watch(`families[${familyIndex}].statusCrnm`);
	const StatusRmn = form.watch(`families[${familyIndex}].statusRnm`);
	const Uf = form.watch(`families[${familyIndex}].uf`);
	const possuiCin = form.watch(`families[${familyIndex}].possui_cin`);
	const Cin = form.watch(`families[${familyIndex}].cin`);
	const triggeredByBlurRef = useRef(false);


	// Pegar estrutura dos campos dinâmicos
	let formSections = getMergedFormSections(formValues);

	const previousPaisOrigemRef = useRef(paisOrigem);
	const previousPossuiCinRef = useRef(possuiCin);
	const previousDocumentacaoRef = useRef(Documentacao);


	const prevValuesRef = useRef<Record<string, any>>({
		cidade: Cidade,
		cpf: Cpf,
		data_emissao_rg: dataExpedicaoRg,
		data_expedicao_cin: dataExpedicaoCin,
		data_expedicao_crnm: dataExpedicaoCrnm,
		data_expedicao_passaporte: dataExpedicaoPassaporte,
		data_expedicao_rnm: dataExpedicaoRnm,
		documentacao: Documentacao,
		estado_emissao_rg: estadoEmissaoRG,
		fonte_cpf: fonteCpf,
		numero_cin: Cin,
		numero_crnm: numeroCrnm,
		numero_passaporte: numeroPassaporte,
		numero_protocolo: numeroProtoccolo,
		numero_rnm: numeroRnm,
		orgao_expedidor: orgaoExpedidor,
		pais_origem: paisOrigem,
		possui_cin: possuiCin,
		rg: Rg,
		status_crnm: StatusCrnm,
		status_rnm: StatusRmn,
		uf: Uf,
	});

	useEffect(() => {
		const documentacaoAtual = Documentacao;
		const documentacaoAnterior = previousDocumentacaoRef.current;

		// Limpa os campos se Documentacao estiver vazio ou mudou
		if (!documentacaoAtual || documentacaoAtual !== documentacaoAnterior) {
			form.setValue(`families[${familyIndex}].numeroProtocolo`, "");
			form.setValue(`families[${familyIndex}].numeroRnm`, "");
			form.setValue(`families[${familyIndex}].statusRnm`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoRnm`, "");
			form.setValue(`families[${familyIndex}].numeroCrnm`, "");
			form.setValue(`families[${familyIndex}].statusCrnm`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoCrnm`, "");
			form.setValue(`families[${familyIndex}].numeroPassaporte`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoPassaporte`, "");
		}

		// Atualiza o valor anterior
		previousDocumentacaoRef.current = documentacaoAtual;

	}, [Documentacao, familyIndex]);

	useEffect(() => {
		const possuiCinAtual = possuiCin;
		const possuiCinAnterior = previousPossuiCinRef.current;

		// Limpa os campos se `possuiCin` estiver vazio ou mudou de valor
		if (!possuiCinAtual || possuiCinAtual !== possuiCinAnterior) {
			form.setValue(`families[${familyIndex}].rg`, "");
			form.setValue(`families[${familyIndex}].orgaoExpedidor`, "");
			form.setValue(`families[${familyIndex}].contato_proprietario`, "");
			form.setValue(`families[${familyIndex}].estadoEmissaoRg`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoRg`, "");
			form.setValue(`families[${familyIndex}].cpf`, "");
			form.setValue(`families[${familyIndex}].fonteCpf`, "");
			form.setValue(`families[${familyIndex}].cin`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoCIN`, "");
		}

		// Atualiza o valor anterior
		previousPossuiCinRef.current = possuiCinAtual;

	}, [possuiCin, familyIndex]);

	useEffect(() => {
		const paisOrigemAtual = paisOrigem;
		const paisOrigemAnterior = previousPaisOrigemRef.current;

		// Limpa os campos se paisOrigem estiver vazio ou tiver mudado
		if (!paisOrigemAtual || paisOrigemAtual !== paisOrigemAnterior) {
			form.setValue(`families[${familyIndex}].uf`, "");
			form.setValue(`families[${familyIndex}].cidade`, "");
			form.setValue(`families[${familyIndex}].rg`, "");
			form.setValue(`families[${familyIndex}].orgaoExpedidor`, "");
			form.setValue(`families[${familyIndex}].contato_proprietario`, "");
			form.setValue(`families[${familyIndex}].estadoEmissaoRg`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoRg`, "");
			form.setValue(`families[${familyIndex}].cpf`, "");
			form.setValue(`families[${familyIndex}].fonteCpf`, "");
			form.setValue(`families[${familyIndex}].documentacao`, "");
			form.setValue(`families[${familyIndex}].possui_cin`, "");
			form.setValue(`families[${familyIndex}].cin`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoCIN`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoRnm`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoCrnm`, "");
			form.setValue(`families[${familyIndex}].dataExpedicaoPassaporte`, "");
			form.setValue(`families[${familyIndex}].numeroCrnm`, "");
			form.setValue(`families[${familyIndex}].numeroPassaporte`, "");
			form.setValue(`families[${familyIndex}].numeroProtocolo`, "");
			form.setValue(`families[${familyIndex}].numeroRnm`, "");
			form.setValue(`families[${familyIndex}].statusCrnm`, "");
			form.setValue(`families[${familyIndex}].statusRnm`, "");
		}

		previousPaisOrigemRef.current = paisOrigemAtual;

	}, [paisOrigem, familyIndex]);

	useEffect(() => {
		validarData(dataExpedicaoRg, familyIndex, "dataExpedicaoRg", form.setValue);
	}, [dataExpedicaoRg, familyIndex, form.setValue]);

	useEffect(() => {
		validarData(dataExpedicaoRg, familyIndex, "dataExpedicaoRg", form.setValue);
	}, [dataExpedicaoRg, familyIndex, form.setValue]);

	useEffect(() => {
		validarData(dataExpedicaoRnm, familyIndex, "dataExpedicaoRnm", form.setValue);
	}, [dataExpedicaoRnm, familyIndex, form.setValue]);

	useEffect(() => {
		validarData(dataExpedicaoCrnm, familyIndex, "dataExpedicaoCrnm", form.setValue);
	}, [dataExpedicaoCrnm, familyIndex, form.setValue]);

	useEffect(() => {
		validarData(dataExpedicaoCin, familyIndex, "dataExpedicaoCIN", form.setValue);
	}, [dataExpedicaoCin, familyIndex, form.setValue]);

	useEffect(() => {
		DataValidade(dataExpedicaoPassaporte, familyIndex, "dataExpedicaoPassaporte", form.setValue);
	}, [dataExpedicaoPassaporte, familyIndex, form.setValue]);

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


	useEffect(() => {
		const pathCin = `families[${familyIndex}].cin`;
		const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;
		const pathExpedicao = `families[${familyIndex}].dataExpedicaoCIN`;

		const cinRaw = form.getValues(pathCin);
		const nascimentoRaw = form.getValues(pathNascimento);
		const expedicaoRaw = form.getValues(pathExpedicao);

		form.clearErrors(pathCin);

		if (cinRaw) {
			const onlyNumbers = unMask(cinRaw);
			const maskedCin = mask(onlyNumbers, ['999.999.999-99']);
			form.setValue(pathCin, maskedCin, { shouldValidate: false });

			if (!cpfValidator.isValid(onlyNumbers)) {
				form.setError(pathCin, {
					type: 'manual',
					message: 'CIN inválido.',
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
						form.setError(pathCin, {
							type: 'manual',
							message: 'Documento permanente (idoso). Sem necessidade de renovação.',
						});
					} else {
						const validadeDate = new Date(expedicaoDate);
						validadeDate.setFullYear(validadeDate.getFullYear() + validadeAnos);

						if (validadeDate < today) {
							form.setError(pathCin, {
								type: 'manual',
								message: `O documento está vencido. Válido por ${validadeAnos} anos a partir da expedição.`,
							});
						}
					}
				}
			}
		}
	}, [
		form.watch(`families[${familyIndex}].cin`),
		form.watch(`families[${familyIndex}].dataNascimentoResp`),
		form.watch(`families[${familyIndex}].dataExpedicaoCIN`)
	]);

	// Validação da validade do passaporte para maiores de 18 anos ou emanciapados
	useEffect(() => {
		const idadeRaw = formValues.idadeResp;
		const idade = Number(idadeRaw);
		const rawDate = formValues.dataExpedicaoPassaporte;
		const pessoaEmancipada = formValues.pessoaEmancipada;

		// Limpa erro no início
		form.clearErrors(`families[${familyIndex}].dataExpedicaoPassaporte`);

		// 1. Verifica se idade foi informada
		if (!idadeRaw || isNaN(idade)) {
			form.setError(`families[${familyIndex}].dataExpedicaoPassaporte`, {
				type: "manual",
				message: "Informe a idade da pessoa responsável.",
			});
			return;
		}

		// 2. Se idade for 16 ou 17, verifica se emancipação foi informada
		if ((idade === 16 || idade === 17) && (pessoaEmancipada === undefined || pessoaEmancipada === "")) {
			form.setError(`families[${familyIndex}].dataExpedicaoPassaporte`, {
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
				form.setError(`families[${familyIndex}].dataExpedicaoPassaporte`, {
					type: "manual",
					message: "Informe uma data de validade válida no formato DD/MM/AAAA.",
				});
				return;
			}

			const [day, month, year] = rawDate.split('/');
			const validadeDate = new Date(`${year}-${month}-${day}`);
			const today = new Date();

			if (isNaN(validadeDate.getTime())) {
				form.setError(`families[${familyIndex}].dataExpedicaoPassaporte`, {
					type: "manual",
					message: "Data de validade do passaporte inválida.",
				});
				return;
			}

			const dezAnosAtras = new Date();
			dezAnosAtras.setFullYear(today.getFullYear() - 10);

			if (validadeDate <= dezAnosAtras) {
				form.setError(`families[${familyIndex}].dataExpedicaoPassaporte`, {
					type: "manual",
					message: "A validade do passaporte ultrapassa 10 anos, o que não é permitido para maiores de 18 anos ou menores emancipados.",
				});
			}
		}
	}, [
		formValues.idadeResp,
		formValues.dataExpedicaoPassaporte,
		formValues.pessoaEmancipada
	]);

	function isGetArrolamentoResponse(
		response: any
	): response is { arrolamentos: any[] } {
		return response && Array.isArray(response.arrolamentos)
	};

	const fetchData = async () => {
		console.log('[Arrolamento][Docs] fetchData:start', { isViewMode, isCompletedNow: isCompletedNow() })
		if (isViewMode || isCompletedNow()) return; // evitar PATCH em visualização
		const idLS = localStorage.getItem('arrolamentoId')
		if (idLS) {
			console.log('[Arrolamento][Docs] fetchData: usando fallback localStorage para PATCH imediato', { idLS })
			await handleDocumentacaoResponse({ arrolamentos: [] })
			return
		}
		const seiFromStorageRaw = localStorage.getItem("seiNumber");
		const seiFromStorage = seiFromStorageRaw;
		console.log('[Arrolamento][Docs] fetchData: composing GET by SEI', { seiFromStorage, initialDate, endDate })

		try {
			const request = {
				numero_sei: seiFromStorage,
				initial_date: initialDate,
				end_date: endDate,
			};

			const response = await fetchArrolamento(request);


			if (isGetArrolamentoResponse(response)) {
				console.log('[Arrolamento][Docs] fetchData: GET success, passing to handler', { hasArrolamentos: Array.isArray((response as any).arrolamentos), len: (response as any).arrolamentos?.length })
				await handleDocumentacaoResponse(response);
			}

		} catch (error) {
			console.error("Erro ao buscar arrolamentos:", error);
			showErrorMessage("Erro ao buscar dados do arrolamento");
		}
	};

	const showErrorMessage = (message: string) => {
		Swal.fire({
			icon: "error",
			html: `<div class="text-lg text-center break-words w-full -translate-y-2">${message}<br/><span class="text-sm">Veja o console para mais detalhes.</span></div>`,
			showConfirmButton: true,
			customClass: {
				popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
			},
		});
	};

	const fetchArrolamento = async (request: any) => {
		return await survey_resource.GetArrolamento(request, async (req: any) => {
			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
				if (value !== undefined && value !== "") {
					searchParams.append(key, String(value));
				}
			}

			const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
			const res = await fetch(url, {
				method: req.method,
				headers: {
					"Content-Type": "application/json",
					...(req.headers || {}),
				},
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(`HTTP ${res.status}: ${text}`);
			}

			return res.json();
		});
	};

	const handleDocumentacaoResponse = async (response: any) => {
		if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Docs] View/Completed: PATCH bloqueado'); return; }
		const arrolamento = response.arrolamentos?.[0] || null;
		const fallbackId = localStorage.getItem('arrolamentoId') || ''
		const fallbackCreatedBy = localStorage.getItem('arrolamentoCreated_by') || ''
		const target = arrolamento || (fallbackId ? { id: fallbackId, created_by: fallbackCreatedBy } : null)
		console.log('[Arrolamento][Docs] handleResponse:target', { hasArrolamento: !!arrolamento, fallbackId, created_by: (target as any)?.created_by })
		if (target) {
			if (!arrolamento) console.log('[Arrolamento][Docs] PATCH: usando contexto localStorage id=', fallbackId)
			const arrolamentoId = (target as any).id;
			const criadoPor = (target as any).created_by;

			localStorage.setItem("arrolamentoId", arrolamentoId);
			localStorage.setItem("arrolamentoCreated_by", criadoPor);

			const formatarDataParaBR = (data: string): string => {
				if (!data) return "";
				const [ano, mes, dia] = data.split("-");
				return `${dia}/${mes}/${ano}`;
			};

			const documentacaoPayload = {
				created_by: criadoPor,
				form: {
					family_index: familyIndex + 1,
					documentacao: {
						cidade: Cidade,
						cpf: Cpf,
						data_emissao_rg: formatarDataParaBR(dataExpedicaoRg),
						data_expedicao_cin: formatarDataParaBR(dataExpedicaoCin),
						data_expedicao_crnm: formatarDataParaBR(dataExpedicaoCrnm),
						data_expedicao_passaporte: formatarDataParaBR(dataExpedicaoPassaporte),
						data_expedicao_rnm: formatarDataParaBR(dataExpedicaoRnm),
						documentacao: Documentacao,
						estado_emissao_rg: estadoEmissaoRG,
						fonte_cpf: fonteCpf,
						numero_cin: Cin,
						numero_crnm: numeroCrnm,
						numero_passaporte: numeroPassaporte,
						numero_protocolo: numeroProtoccolo,
						numero_rnm: numeroRnm,
						orgao_expedidor: orgaoExpedidor,
						pais_origem: paisOrigem,
						possui_cin: possuiCin == "sim",
						rg: Rg,
						status_crnm: StatusCrnm,
						status_rnm: StatusRmn,
						uf: Uf,
					},
				},
			};

			try {
				console.log('[Arrolamento][Docs] PATCH prepared (final):', { family_index: familyIndex + 1, payload: documentacaoPayload });
				const token = localStorage.getItem('authToken') || ''
				await survey_resource.SendFormToArrolamentoDoc(SURVEY_RESOURCE_URL, arrolamentoId, documentacaoPayload, token);
				console.log('[Arrolamento][Docs] PATCH ok')
			} catch (error) {
				console.error("Erro ao enviar documentação:", error);
				if (!isViewMode && !isCompletedNow()) showErrorMessage("Erro ao enviar os dados de documentação");
			}
		}
	};

	const hasArrolamento = async (request: any): Promise<boolean> => {
		try {
			const idLS = localStorage.getItem('arrolamentoId')
			if (idLS) { console.log('[Arrolamento][Docs] hasArrolamento: usando contexto localStorage id=', idLS); return true }
			const response = await fetchArrolamento(request);

			const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);

			return !isEmpty;
		} catch (error) {
			console.error("Erro ao verificar arrolamentos:", error);
			return false;
		}
	};

	useEffect(() => {
		if (!isActive || isViewMode || isCompletedNow()) return; // não registrar listeners em visualização ou família inativa
		const handleBlur = async () => {
			console.log('[Arrolamento][Docs] blur:start', { familyIndex, opened: hasSectionBeenOpenedRef.current })
			// Evita PATCH antes do usuário abrir a seção ao menos uma vez
			if (!hasSectionBeenOpenedRef.current) {
				return;
			}
			const activeFieldName = document.activeElement?.getAttribute("name");

			const fields = {
				["documentacao.cidade"]: Cidade,
				["documentacao.cpf"]: Cpf,
				["documentacao.data_emissao_rg"]: dataExpedicaoRg,
				["documentacao.data_expedicao_cin"]: dataExpedicaoCin,
				["documentacao.data_expedicao_crnm"]: dataExpedicaoCrnm,
				["documentacao.data_expedicao_passaporte"]: dataExpedicaoPassaporte,
				["documentacao.data_expedicao_rnm"]: dataExpedicaoRnm,
				["documentacao.documentacao"]: Documentacao,
				["documentacao.estado_emissao_rg"]: estadoEmissaoRG,
				["documentacao.fonte_cpf"]: fonteCpf,
				["documentacao.numero_cin"]: Cin, // boolean
				["documentacao.numero_crnm"]: numeroCrnm,
				["documentacao.numero_passaporte"]: numeroPassaporte,
				["documentacao.numero_protocolo"]: numeroProtoccolo,
				["documentacao.numero_rnm"]: numeroRnm,
				["documentacao.orgao_expedidor"]: orgaoExpedidor,
				["documentacao.pais_origem"]: paisOrigem,
				["documentacao.possui_cin"]: possuiCin, // boolean
				["documentacao.rg"]: Rg,
				["documentacao.status_rnm"]: StatusRmn,
				["documentacao.status_crnm"]: StatusCrnm,
				["documentacao.uf"]: Uf,
			};

			let shouldFetch = false;

			for (const [fieldName, currentValue] of Object.entries(fields)) {
				const shortName = fieldName.split(".").pop() || "";
				const prevValue = prevValuesRef.current[shortName];

				if (currentValue !== prevValue && activeFieldName !== fieldName) {
					shouldFetch = true;
					prevValuesRef.current[shortName] = currentValue;
				}
			}

			console.log('[Arrolamento][Docs] blur:diff', { shouldFetch, activeFieldName })

			if (!firstBlurSkippedRef.current && !shouldFetch) {
				firstBlurSkippedRef.current = true;
				return;
			}

			if (shouldFetch) {
				const seiNumber = localStorage.getItem("seiNumber");
				const request = {
					numero_sei: seiNumber,
					initial_date: initialDate,
					end_date: endDate,
				};

				const hasData = await hasArrolamento(request);

				if (!hasData) {
					console.log("Nenhum Arrolamento Cadastrado");
					return;
				}

				triggeredByBlurRef.current = true;
				console.log('[Arrolamento][Docs] blur:will PATCH via fetchData', { familyIndex })
				fetchData(); // função de envio do formulário/documentação
			}
		};

		window.addEventListener("blur", handleBlur, true);
		return () => {
			window.removeEventListener("blur", handleBlur, true);
		};
	}, [
		isActive,
		isViewMode,
		Cidade,
		Cpf,
		dataExpedicaoRg,
		dataExpedicaoCin,
		dataExpedicaoCrnm,
		dataExpedicaoPassaporte,
		dataExpedicaoRnm,
		Documentacao,
		estadoEmissaoRG,
		fonteCpf,
		Cin,
		numeroCrnm,
		numeroPassaporte,
		numeroProtoccolo,
		numeroRnm,
		orgaoExpedidor,
		paisOrigem,
		possuiCin,
		Rg,
		StatusRmn,
		StatusCrnm,
		Uf,
	]);
	
	// Atualiza UF
	useEffect(() => {
		fetchEstados()
			.then(list => {
				const options = list.map(e => ({ label: e.nome, value: e.sigla }));

				// Prioriza SP
				const spIndex = options.findIndex(e => e.label === 'São Paulo');
				if (spIndex > -1) {
					const [sp] = options.splice(spIndex, 1);
					options.unshift(sp);
				}

				setEstadoOptions(options);
			})
			.catch(error => {
				console.error('Erro ao buscar estados da API, usando dados locais:', error);

				// Fallback: usa arquivo local
				const options = estados.map(e => ({ label: e.label, value: e.value }));

				const spIndex = options.findIndex(e => e.label === 'São Paulo');
				if (spIndex > -1) {
					const [sp] = options.splice(spIndex, 1);
					options.unshift(sp);
				}

				setEstadoOptions(options);
			});
	}, []);
	
	// Atualiza cidades ao mudar UF
	useEffect(() => {
		if (!ufSelecionada) {
			setCidadeOptions([]);
			return;
		}

		getCidadesOptions(ufSelecionada)
			.then(cidades => {
				if (ufSelecionada === 'SP') {
					const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
					if (spIndex > -1) {
						const [spCity] = cidades.splice(spIndex, 1);
						cidades.unshift(spCity);
					}
				}

				setCidadeOptions(cidades);
			})
			.catch(error => {
				console.error(`Erro ao buscar cidades da UF ${ufSelecionada}, usando dados locais:`, error);

				if (ufSelecionada in cidadesLocais) {
					const cidadesLocaisDaUf = cidadesLocais[ufSelecionada as keyof typeof cidadesLocais];

					setCidadeOptions(cidadesLocaisDaUf);
				} else {
					setCidadeOptions([]);
				}
			});
	}, [ufSelecionada]);

	useEffect(() => {
		const pathCpf = `families[${familyIndex}].cpf`;
		const cpfRaw = form.getValues(pathCpf);

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
			}
		}
	}, [form.watch(`families[${familyIndex}].cpf`)]);

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
			<Collapsible
				open={mostrarDocumentacao}
				onOpenChange={(open) => {
					setMostrarDocumentacao(open);
					if (open) {
						hasSectionBeenOpenedRef.current = true;
						firstBlurSkippedRef.current = false;
					}
				}}
			>
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
