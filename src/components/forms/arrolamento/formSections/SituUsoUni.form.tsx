import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections, situUsoUniDefinition
} from "@/components/forms/arrolamento/definitions/situUsoUni.definition";
import { ensureValidSelectValue, formatCurrency} from "@/components/forms/arrolamento/helpers/situUsoUni.helper";
// Import FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import useViewMode from '@/hooks/useViewMode'
interface SituUsoUniFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    isActive?: boolean;
}

const SituUsoUniForm = ({ sectionIndex: sectionNumber, familyIndex, isActive = true }: SituUsoUniFormProps) => {
    const isViewMode = useViewMode();
    const isCompletedNow = () => localStorage.getItem('arrolamentoCompleted') === 'true';
    const [mostrarSituacaoUso, setMostrarSituacaoUso] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const form = useFormContext();
    const triggeredByBlurRef = useRef(false);
    const hasSectionBeenOpenedRef = useRef(false);
    const firstBlurSkippedRef = useRef(false);

    const regimeOcupacao = form.watch(`families[${familyIndex}].regime_ocupacao`);
    const valorLocacao = form.watch(`families[${familyIndex}].valor_locacao`);
    const nsiValorLocacao = form.watch(`families[${familyIndex}].nsi_valor_locacao`);
    const contratoLocacao = form.watch(`families[${familyIndex}].contrato_locacao`);
    const nomeProprietario = form.watch(`families[${familyIndex}].nome_proprietario`);
    const contatoProprietario = form.watch(`families[${familyIndex}].contato_proprietario`);
    const nsiContatoProprietario = form.watch(`families[${familyIndex}].nsi_contato_proprietario`);
    // Própria
    const documentoComprovacao = form.watch(`families[${familyIndex}].documentoComprovacao`);
    const descricaoDocumento = form.watch(`families[${familyIndex}].descricaoDocumento`);

    // Cedida
    const nomeProprietarioCedida = form.watch(`families[${familyIndex}].nome_proprietario_cedida`);
    const telefoneProprietarioCedida = form.watch(`families[${familyIndex}].telefone_proprietario_cedida`);

    // Tempo de moradia
    const tempoMoradiaAnos = form.watch(`families[${familyIndex}].tempoMoradiaAnos`);
    const tempoMoradiaMeses = form.watch(`families[${familyIndex}].tempoMoradiaMeses`);
    const tempoMoradiaNaoSabe = form.watch(`families[${familyIndex}].tempoMoradiaNaoSabe`);
    const tempoMoradiaNaoSabe1 = form.watch(`families[${familyIndex}].tempoMoradiaNaoSabe1`);

    // Compartilhamento
    const cozinhaCompartilhada = form.watch(`families[${familyIndex}].cozinhaCompartilhada`);
    const banheiroCompartilhado = form.watch(`families[${familyIndex}].banheiroCompartilhado`);

    // Resíduos
    const separaResiduos = form.watch(`families[${familyIndex}].separaResiduos`);
    const destinoReciclavel = form.watch(`families[${familyIndex}].destinoReciclavel`);
    const outroDestinoReciclavel = form.watch(`families[${familyIndex}].outroDestinoReciclavel`);
    const destinoOrganico = form.watch(`families[${familyIndex}].destinoOrganico`);
    const outroDestinoOrganico = form.watch(`families[${familyIndex}].outroDestinoOrganico`);
    const destinoDomestico = form.watch(`families[${familyIndex}].destinoDomestico`);
    const outroDestinoDomestico = form.watch(`families[${familyIndex}].outroDestinoDomestico`);

    const prevValuesRef = useRef<Record<string, any>>({
        regime_ocupacao: regimeOcupacao,
        contato_proprietario: contatoProprietario,
        contrato_locacao: contratoLocacao,
        nome_proprietario: nomeProprietario,
        nsi_contato_proprietario: nsiContatoProprietario,
        nsi_valor_locacao: nsiValorLocacao,
        valor_locacao: valorLocacao,
    });

    // Get form values for conditional logic
    const formValues = (() => {
        try {
            return form.watch(`families[${familyIndex}]`) || {};
        } catch (err) {
            console.error("Erro ao acessar form values:", err);
            return {};
        }
    })();

    //auxilia a fetchData
    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos)
    };

    const fetchData = async () => {
        if (isViewMode || isCompletedNow()) return; // evitar PATCH em visualização ou concluído
        const idLS = localStorage.getItem('arrolamentoId')
        if (idLS) {
            console.log('[Arrolamento][SituacaoUso] fetchData: usando fallback localStorage para PATCH imediato')
            await handleSituacaoUsoResponse({ arrolamentos: [] })
            return
        }
        const seiFromStorageRaw = localStorage.getItem("seiNumber");
        const seiFromStorage = Number(seiFromStorageRaw);



        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchArrolamento(request);


            if (isGetArrolamentoResponse(response)) {
                await handleSituacaoUsoResponse(response);
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

    const handleSituacaoUsoResponse = async (response: any) => {
        if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][SituacaoUso] View/Completed: PATCH bloqueado'); return; }
        const arrolamento = response.arrolamentos?.[0] || null;
        const fallbackId = localStorage.getItem('arrolamentoId') || ''
        const fallbackCreatedBy = localStorage.getItem('arrolamentoCreated_by') || ''
        const target = arrolamento || (fallbackId ? { id: fallbackId, created_by: fallbackCreatedBy } : null)
        if (target) {
            if (!arrolamento) console.log('[Arrolamento][SituacaoUso] PATCH: usando contexto localStorage id=', fallbackId)
            const completedResp = !!(target?.completed || (target?.status_notas && (target as any).status_notas.status === 'Concluida'))
            if (completedResp) { console.log('[Arrolamento][SituacaoUso] Registro concluído. Abortando PATCH.'); return; }
            const arrolamentoId = (target as any).id;
            const criadoPor = (target as any).created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            // Limpa espaços e caracteres invisíveis
            const valorLocacaoNormalizado = valorLocacao?.replace(/\s/g, "");
            const valorLocacaoFinal = valorLocacaoNormalizado === "R$0,00" ? "" : valorLocacao;

            const situacaoUsoPayload = {
                created_by: criadoPor,
                form: {
                    family_index: familyIndex + 1,
                    situacao_uso: {
                        regime_ocupacao: regimeOcupacao,
                        contato_proprietario: contatoProprietario,
                        contrato_locacao: contratoLocacao,
                        nome_proprietario: nomeProprietario,
                        nsi_contato_proprietario: nsiContatoProprietario,
                        nsi_valor_locacao: nsiValorLocacao,
                        valor_locacao: valorLocacaoFinal,
                        banheiro_compartilhado: banheiroCompartilhado === "sim",
                        cozinha_compartilhada: cozinhaCompartilhada === "sim",
                        descricao_documento: descricaoDocumento,
                        destino_domestico: destinoDomestico,
                        destino_organico: destinoOrganico,
                        destino_reciclavel: destinoReciclavel,
                        documento_comprovacao: documentoComprovacao,
                        nome_proprietario_cedida: nomeProprietarioCedida,
                        outro_destino_domestico: outroDestinoDomestico,
                        outro_destino_organico: outroDestinoOrganico,
                        outro_destino_reciclavel: outroDestinoReciclavel,
                        separa_residuos: separaResiduos,
                        telefone_proprietario_cedida: telefoneProprietarioCedida,
                        tempo_moradia_anos: Number(tempoMoradiaAnos ?? 0),
                        tempo_moradia_meses: Number(tempoMoradiaMeses ?? 0),
                        tempo_moradia_naosabe: tempoMoradiaNaoSabe === "sim",
                        tempo_moradia_naosabe1: tempoMoradiaNaoSabe1 === "sim",

                    },
                },
            };

            try {
                console.log('[Arrolamento][SituacaoUso] PATCH prepared (final):', { family_index: familyIndex + 1, payload: situacaoUsoPayload });
                const token = localStorage.getItem('authToken') || ''
                await survey_resource.SendFormToArrolamentoSituacaoUso(SURVEY_RESOURCE_URL, arrolamentoId, situacaoUsoPayload, token);
            } catch (error) {
                console.error("Erro ao enviar situação de uso:", error);
                if (!isViewMode && !isCompletedNow()) showErrorMessage("Erro ao enviar os dados de situação de uso");
            }
        }
    };

    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const idLS = localStorage.getItem('arrolamentoId')
            if (idLS) { console.log('[Arrolamento][SituacaoUso] hasArrolamento: usando contexto localStorage id=', idLS); return true }
            const response = await fetchArrolamento(request);

            const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);

            return !isEmpty;
        } catch (error) {
            console.error("Erro ao verificar arrolamentos:", error);
            return false;
        }
    };

    /**
     useEffect(() => {
            const nsiValor = formValues.nsi_valor_locacao;
            const valorLocacao = formValues?.valor_locacao;
            const campoPath = `families[${familyIndex}].valor_locacao`;
            const current = form.getValues(campoPath);
    
            if (nsiValor) {
                if (current) {
                    form.setValue(campoPath, "");
                }
            } else if (valorLocacao !== undefined && valorLocacao !== null) {
                const formatted = formatCurrency(valorLocacao);
                if (formatted !== current) {
                    form.setValue(campoPath, formatted, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                }
            }
        }, [formValues.nsi_valor_locacao, formValues?.valor_locacao, familyIndex, form]);
      



         useEffect(() => {
        form.setValue(`families[${familyIndex}].valor_locacao`, "");
        form.setValue(`families[${familyIndex}].nsi_valor_locacao`, false);
        form.setValue(`families[${familyIndex}].contrato_locacao`, "");
        form.setValue(`families[${familyIndex}].nome_proprietario`, "");
        form.setValue(`families[${familyIndex}].contato_proprietario`, "");
        form.setValue(`families[${familyIndex}].nsi_contato_proprietario`, false);
        form.setValue(`families[${familyIndex}].documentoComprovacao`, "");
        form.setValue(`families[${familyIndex}].descricaoDocumento`, "");
        form.setValue(`families[${familyIndex}].separaResiduos`, "");


    }, [regimeOcupacao, familyIndex]);




     useEffect(() => {
        // Limpa os campos quando "separaResiduos" mudar
        form.setValue(`families[${familyIndex}].destinoReciclavel`, "");
        form.setValue(`families[${familyIndex}].outroDestinoReciclavel`, "");
        form.setValue(`families[${familyIndex}].destinoOrganico`, "");
        form.setValue(`families[${familyIndex}].outroDestinoOrganico`, "");
        form.setValue(`families[${familyIndex}].destinoDomestico`, "");
        form.setValue(`families[${familyIndex}].outroDestinoDomestico`, "");
    }, [separaResiduos, familyIndex]);







     useEffect(() => {
        const prev = prevValuesRef.current;

        // Exemplo: Se regime_ocupacao mudou, limpa vários campos
        if (prev.regime_ocupacao !== regimeOcupacao) {
            form.setValue(`families[${familyIndex}].valor_locacao`, "");
            form.setValue(`families[${familyIndex}].nsi_valor_locacao`, false);
            form.setValue(`families[${familyIndex}].contrato_locacao`, "");
            form.setValue(`families[${familyIndex}].nome_proprietario`, "");
            form.setValue(`families[${familyIndex}].contato_proprietario`, "");
            form.setValue(`families[${familyIndex}].nsi_contato_proprietario`, false);
            form.setValue(`families[${familyIndex}].documentoComprovacao`, "");
            form.setValue(`families[${familyIndex}].descricaoDocumento`, "");
            form.setValue(`families[${familyIndex}].nome_proprietario_cedida`, "");
            form.setValue(`families[${familyIndex}].telefone_proprietario_cedida`, "");
        }

        // Se nsi_valor_locacao mudou para true, limpa valor_locacao
        if (prev.nsi_valor_locacao !== nsiValorLocacao && nsiValorLocacao) {
            form.setValue(`families[${familyIndex}].valor_locacao`, "");
        }
        // Se nsi_valor_locacao mudou para false e valor_locacao tem valor, formata
        else if (
            prev.nsi_valor_locacao !== nsiValorLocacao &&
            !nsiValorLocacao &&
            valorLocacao !== undefined &&
            valorLocacao !== null
        ) {
            const formatted = formatCurrency(valorLocacao);
            const current = form.getValues(`families[${familyIndex}].valor_locacao`);
            if (formatted !== current) {
                form.setValue(`families[${familyIndex}].valor_locacao`, formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        }

        // Se nsi_contato_proprietario mudou para true, limpa contato_proprietario
        if (prev.nsi_contato_proprietario !== nsiContatoProprietario && nsiContatoProprietario) {
            form.setValue(`families[${familyIndex}].contato_proprietario`, "");
        }

        // Atualiza os valores anteriores
        prevValuesRef.current = {
            regime_ocupacao: regimeOcupacao,
            contato_proprietario: contatoProprietario,
            contrato_locacao: contratoLocacao,
            nome_proprietario: nomeProprietario,
            nsi_contato_proprietario: nsiContatoProprietario,
            nsi_valor_locacao: nsiValorLocacao,
            valor_locacao: valorLocacao,
        };
    }, [
        regimeOcupacao,
        contatoProprietario,
        contratoLocacao,
        nomeProprietario,
        nsiContatoProprietario,
        nsiValorLocacao,
        valorLocacao,
        familyIndex,
        form,
    ]);
    // Formatar telefone se contato_proprietario ou telefone_proprietario_cedida mudarem
    useEffect(() => {
        const prev = prevValuesRef.current;

        if (formValues.contato_proprietario && prev.contato_proprietario !== formValues.contato_proprietario) {
            const formatted = formatarTelefone(formValues.contato_proprietario);
            if (formatted !== formValues.contato_proprietario) {
                form.setValue(`families[${familyIndex}].contato_proprietario`, formatted);
            }
        }

        if (formValues.telefone_proprietario_cedida && prev.telefone_proprietario_cedida !== formValues.telefone_proprietario_cedida) {
            const formatted = formatarTelefone(formValues.telefone_proprietario_cedida);
            if (formatted !== formValues.telefone_proprietario_cedida) {
                form.setValue(`families[${familyIndex}].telefone_proprietario_cedida`, formatted);
            }
        }

        // Atualiza valores anteriores para esses campos também
        prevValuesRef.current.contato_proprietario = formValues.contato_proprietario;
        prevValuesRef.current.telefone_proprietario_cedida = formValues.telefone_proprietario_cedida;
    }, [
        formValues.contato_proprietario,
        formValues.telefone_proprietario_cedida,
        familyIndex,
        form,
    ]);

    useEffect(() => {
        const campos = ["contato_proprietario", "telefone_proprietario_cedida"];

        campos.forEach((campo) => {
            const valor = formValues[campo as keyof typeof formValues];
            if (valor) {
                const formatted = formatarTelefone(valor);
                if (formatted !== valor) {
                    form.setValue(`families[${familyIndex}].${campo}`, formatted);
                }
            }
        });
    }, [
        formValues.contato_proprietario,
        formValues.telefone_proprietario_cedida,
        familyIndex,
        form
    ]);
     */

    useEffect(() => {
        const nsiValor = formValues.nsi_valor_locacao;
        const valorLocacao = formValues?.valor_locacao;
        const campoPath = `families[${familyIndex}].valor_locacao`;
        const current = form.getValues(campoPath);

        if (nsiValor) {
            if (current) {
                form.setValue(campoPath, "");
            }
        } else if (valorLocacao !== undefined && valorLocacao !== null) {
            const formatted = formatCurrency(valorLocacao);
            if (formatted !== current) {
                form.setValue(campoPath, formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        }
    }, [formValues.nsi_valor_locacao, formValues?.valor_locacao, familyIndex, form]);

    useEffect(() => {
        if (formValues.tempoMoradiaNaoSabe) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].tempoMoradiaAnos`);


            if (email) {
                form.setValue(`families[${familyIndex}].tempoMoradiaAnos`, "");

            }
        }
    }, [formValues.tempoMoradiaNaoSabe, form, familyIndex]);

    useEffect(() => {
        if (formValues.tempoMoradiaNaoSabe1) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].tempoMoradiaMeses`);


            if (email) {
                form.setValue(`families[${familyIndex}].tempoMoradiaMeses`, "");

            }
        }
    }, [formValues.tempoMoradiaNaoSabe1, form, familyIndex]);




    useEffect(() => {
        if (!isActive || isViewMode || isCompletedNow()) return; // não registrar listeners em visualização ou família inativa
        const handleBlur = async () => {
            // Evita PATCH antes do usuário abrir a seção ao menos uma vez
            if (!hasSectionBeenOpenedRef.current) {
                return;
            }
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                [`situacao_uso.regime_ocupacao`]: regimeOcupacao,
                [`situacao_uso.contato_proprietario`]: contatoProprietario,
                [`situacao_uso.contrato_locacao`]: contratoLocacao,
                [`situacao_uso.nome_proprietario`]: nomeProprietario,
                [`situacao_uso.nsi_contato_proprietario`]: nsiContatoProprietario,
                [`situacao_uso.nsi_valor_locacao`]: nsiValorLocacao,
                [`situacao_uso.valor_locacao`]: valorLocacao,
                [`situacao_uso.documentoComprovacao`]: documentoComprovacao,
                [`situacao_uso.descricaoDocumento`]: descricaoDocumento,
                [`situacao_uso.nome_proprietario_cedida`]: nomeProprietarioCedida,
                [`situacao_uso.telefone_proprietario_cedida`]: telefoneProprietarioCedida,
                [`situacao_uso.tempoMoradiaAnos`]: tempoMoradiaAnos,
                [`situacao_uso.tempoMoradiaMeses`]: tempoMoradiaMeses,
                [`situacao_uso.tempoMoradiaNaoSabe`]: tempoMoradiaNaoSabe,
                [`situacao_uso.tempoMoradiaNaoSabe1`]: tempoMoradiaNaoSabe1,
                [`situacao_uso.cozinhaCompartilhada`]: cozinhaCompartilhada,
                [`situacao_uso.banheiroCompartilhado`]: banheiroCompartilhado,
                [`situacao_uso.separaResiduos`]: separaResiduos,
                [`situacao_uso.destinoReciclavel`]: destinoReciclavel,
                [`situacao_uso.outroDestinoReciclavel`]: outroDestinoReciclavel,
                [`situacao_uso.destinoOrganico`]: destinoOrganico,
                [`situacao_uso.outroDestinoOrganico`]: outroDestinoOrganico,
                [`situacao_uso.destinoDomestico`]: destinoDomestico,
                [`situacao_uso.outroDestinoDomestico`]: outroDestinoDomestico,
            };

            let shouldFetch = false;

            for (const [fieldName, currentValue] of Object.entries(fields)) {
                const fieldKey = fieldName.split(".").pop() || "";
                const prevValue = prevValuesRef.current[fieldKey];

                if (currentValue !== prevValue && activeFieldName !== fieldName) {
                    shouldFetch = true;
                    prevValuesRef.current[fieldKey] = currentValue;
                }
            }

            if (!firstBlurSkippedRef.current && !shouldFetch) {
                firstBlurSkippedRef.current = true;
                return;
            }

            if (shouldFetch) {
                const seiNumber = localStorage.getItem("seiNumber");
                const request = {
                    numero_sei: Number(seiNumber),
                    initial_date: initialDate,
                    end_date: endDate,
                };

                const hasData = await hasArrolamento(request);

                if (!hasData) {
                    console.log("Nenhum Arrolamento Cadastrado");
                    return;
                }

                triggeredByBlurRef.current = true;
                fetchData();
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        isActive,
        isViewMode,
        regimeOcupacao,
        contatoProprietario,
        contratoLocacao,
        nomeProprietario,
        nsiContatoProprietario,
        nsiValorLocacao,
        valorLocacao,
        documentoComprovacao,
        descricaoDocumento,
        nomeProprietarioCedida,
        telefoneProprietarioCedida,
        tempoMoradiaAnos,
        tempoMoradiaMeses,
        tempoMoradiaNaoSabe,
        tempoMoradiaNaoSabe1,
        cozinhaCompartilhada,
        banheiroCompartilhado,
        separaResiduos,
        destinoReciclavel,
        outroDestinoReciclavel,
        destinoOrganico,
        outroDestinoOrganico,
        destinoDomestico,
        outroDestinoDomestico,
    ]);

    // Get merged form sections with conditional fields included
    const formSections = (() => {
        try {
            // Certifique-se de que os valores passados para getMergedFormSections são válidos
            const safeFormValues = { ...formValues };

            // Garantir que todos os campos select tenham valores válidos
            const selectFields = ['regime_ocupacao', 'separaResiduos', 'cozinhaCompartilhada',
                'banheiroCompartilhado', 'contrato_locacao', 'documentoComprovacao',
                'destinoReciclavel', 'destinoOrganico', 'destinoDomestico'];

            selectFields.forEach(field => {
                if (field in safeFormValues) {
                    safeFormValues[field] = ensureValidSelectValue(safeFormValues[field]);
                }
            });

            const sections = getMergedFormSections(safeFormValues);
            return sections;
        } catch (err) {
            console.error("Erro ao obter as seções do formulário:", err);
            return [situUsoUniDefinition.sections[0]]; // Fallback para seção básica
        }
    })();

    return (
        <div className="text-left">
            <Collapsible
                open={mostrarSituacaoUso}
                onOpenChange={(open) => {
                    setMostrarSituacaoUso(open);
                    if (open) {
                        hasSectionBeenOpenedRef.current = true;
                        firstBlurSkippedRef.current = false;
                    }
                }}
            >
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 3} - Situação e Uso da Unidade`}
                        </h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {Array.isArray(formSections) && formSections.length > 0 && formSections[0].fields && (
                        formSections.map((section, sectionIndex) => (
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
                        ))
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default SituUsoUniForm; 