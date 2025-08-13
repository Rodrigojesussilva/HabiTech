import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/infoContato.definition";
import { formatarTelefoneAuto } from "@/components/forms/arrolamento/helpers/infoContato.helper";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import Swal from 'sweetalert2';
import useViewMode from '@/hooks/useViewMode'

interface InfoContatoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    isActive?: boolean;
}

const InfoContatoForm = ({ sectionIndex: sectionNumber, familyIndex, isActive = true }: InfoContatoFormProps) => {
    const isViewMode = useViewMode();
    const isCompletedNow = () => localStorage.getItem('arrolamentoCompleted') === 'true';

    const [mostrarContato, setMostrarContato] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const form = useFormContext();
    const initializedRef = useRef(false);
    const hasSectionBeenOpenedRef = useRef(false);
    const firstBlurSkippedRef = useRef(false);
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const email = form.watch(`families[${familyIndex}].email`);
    const naoSabeEmail = form.watch(`families[${familyIndex}].naoSabeEmail`);

    const telefone1 = form.watch(`families[${familyIndex}].telefone1`);
    const telefone2 = form.watch(`families[${familyIndex}].telefone2`);
    const telefone3 = form.watch(`families[${familyIndex}].telefone3`);
    const telefone4 = form.watch(`families[${familyIndex}].telefone4`);

    const tipoTelefone1 = form.watch(`families[${familyIndex}].tipoTelefone1`);
    const tipoTelefone2 = form.watch(`families[${familyIndex}].tipoTelefone2`);
    const tipoTelefone3 = form.watch(`families[${familyIndex}].tipoTelefone3`);
    const tipoTelefone4 = form.watch(`families[${familyIndex}].tipoTelefone4`);

    const nomeRecado1 = form.watch(`families[${familyIndex}].nomeRecado1`);
    const nomeRecado2 = form.watch(`families[${familyIndex}].nomeRecado2`);
    const nomeRecado3 = form.watch(`families[${familyIndex}].nomeRecado3`);
    const nomeRecado4 = form.watch(`families[${familyIndex}].nomeRecado4`);

    const escrevParentesco1 = form.watch(`families[${familyIndex}].escrevParentesco1`);
    const escrevParentesco2 = form.watch(`families[${familyIndex}].escrevParentesco2`);
    const escrevParentesco3 = form.watch(`families[${familyIndex}].escrevParentesco3`);
    const escrevParentesco4 = form.watch(`families[${familyIndex}].escrevParentesco4`);

    const telefone1WhatsApp = form.watch(`families[${familyIndex}].telefone1WhatsApp`);
    const telefone2WhatsApp = form.watch(`families[${familyIndex}].telefone2WhatsApp`);
    const telefone3WhatsApp = form.watch(`families[${familyIndex}].telefone3WhatsApp`);
    const telefone4WhatsApp = form.watch(`families[${familyIndex}].telefone4WhatsApp`);

    const ativarTelefone2 = form.watch(`families[${familyIndex}].ativarTelefone2`);
    const ativarTelefone3 = form.watch(`families[${familyIndex}].ativarTelefone3`);
    const ativarTelefone4 = form.watch(`families[${familyIndex}].ativarTelefone4`);


    const triggeredByBlurRef = useRef(false);

    const prevValuesRef = useRef<{ [key: string]: any }>({
        email: email,
        telefone1: telefone1,
        telefone2: telefone2,
        telefone3: telefone3,
        telefone4: telefone4,
        tipoTelefone1: tipoTelefone1,
        tipoTelefone2: tipoTelefone2,
        tipoTelefone3: tipoTelefone3,
        tipoTelefone4: tipoTelefone4,
        nomeRecado1: nomeRecado1,
        nomeRecado2: nomeRecado2,
        nomeRecado3: nomeRecado3,
        nomeRecado4: nomeRecado4,
        escrevParentesco1: escrevParentesco1,
        escrevParentesco2: escrevParentesco2,
        escrevParentesco3: escrevParentesco3,
        escrevParentesco4: escrevParentesco4,
        telefone1WhatsApp: telefone1WhatsApp,
        telefone2WhatsApp: telefone2WhatsApp,
        telefone3WhatsApp: telefone3WhatsApp,
        telefone4WhatsApp: telefone4WhatsApp,
        ativarTelefone2: ativarTelefone2,
        ativarTelefone3: ativarTelefone3,
        ativarTelefone4: ativarTelefone4,

    });
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
            console.log('[Arrolamento][Contato] fetchData: usando fallback localStorage para PATCH imediato')
            await handleContatoResponse({ arrolamentos: [] })
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
                await handleContatoResponse(response);
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

    const handleContatoResponse = async (response: any) => {
        if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Contato] View/Completed: PATCH bloqueado'); return; }
        const arrolamento = response.arrolamentos?.[0] || null;
        const fallbackId = localStorage.getItem('arrolamentoId') || ''
        const fallbackCreatedBy = localStorage.getItem('arrolamentoCreated_by') || ''
        const target = arrolamento || (fallbackId ? { id: fallbackId, created_by: fallbackCreatedBy } : null)
        if (target) {
            if (!arrolamento) console.log('[Arrolamento][Contato] PATCH: usando contexto localStorage id=', fallbackId)
            const completedResp = !!(target?.completed || (target?.status_notas && (target as any).status_notas.status === 'Concluida'))
            if (completedResp) { console.log('[Arrolamento][Contato] Registro concluído. Abortando PATCH.'); return; }
            const arrolamentoId = (target as any).id;
            const criadoPor = (target as any).created_by;
            const createdBy = localStorage.getItem('userEmail') || criadoPor || ''
            const token = localStorage.getItem('authToken') || ''

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            const formPayload = {
                created_by: createdBy,
                form: {
                    family_index: familyIndex + 1,
                    contato: {
                        email: email,
                        nao_sabe_email: naoSabeEmail,
                        telefone1: telefone1,
                        telefone2: telefone2,
                        telefone3: telefone3,
                        telefone4: telefone4,
                        tipo_telefone1: tipoTelefone1,
                        tipo_telefone2: tipoTelefone2,
                        tipo_telefone3: tipoTelefone3,
                        tipo_telefone4: tipoTelefone4,
                        nome_recado_tel1: nomeRecado1,
                        nome_recado_tel2: nomeRecado2,
                        nome_recado_tel3: nomeRecado3,
                        nome_recado_tel4: nomeRecado4,
                        relacao_parentesco_tel1: escrevParentesco1,
                        relacao_parentesco_tel2: escrevParentesco2,
                        relacao_parentesco_tel3: escrevParentesco3,
                        relacao_parentesco_tel4: escrevParentesco4,
                        whatzap_telefone1: telefone1WhatsApp,
                        whatzap_telefone2: telefone2WhatsApp,
                        whatzap_telefone3: telefone3WhatsApp,
                        whatzap_telefone4: telefone4WhatsApp,
                        ativar_telefone2: ativarTelefone2,
                        ativar_telefone3: ativarTelefone3,
                        ativar_telefone4: ativarTelefone4
                    }
                }
            };

            try {

                console.log('[Arrolamento][Contato] PATCH prepared (final):', { arrolamentoId, createdBy, tokenPresent: !!token, family_index: familyIndex + 1, formPayload })
                console.log('[Arrolamento][Contato] payload snapshot', { familyIndex, payload: formPayload })
                const res = await survey_resource.SendFormToArrolamentoContato(SURVEY_RESOURCE_URL, arrolamentoId, formPayload as any, token);
                console.log('[Arrolamento][Contato] PATCH success:', res)
            } catch (error) {
                console.error("[Arrolamento][Contato] PATCH error:", error);
                if (!isViewMode && !isCompletedNow()) showErrorMessage("Erro ao enviar os dados");
            }
        }
    };

    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const idLS = localStorage.getItem('arrolamentoId')
            if (idLS) { console.log('[Arrolamento][Contato] hasArrolamento: usando contexto localStorage id=', idLS); return true }
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
            // Evita PATCH antes do usuário abrir a seção ao menos uma vez
            if (!hasSectionBeenOpenedRef.current) {
                return;
            }
            // Evita PATCH no primeiro blur após a abertura da seção
            if (!firstBlurSkippedRef.current) {
                firstBlurSkippedRef.current = true;
                return;
            }
            const activeFieldName = document.activeElement?.getAttribute("name");

            const allFields = {
                email,
                telefone1,
                telefone2,
                telefone3,
                telefone4,
                tipoTelefone1,
                tipoTelefone2,
                tipoTelefone3,
                tipoTelefone4,
                nomeRecado1,
                nomeRecado2,
                nomeRecado3,
                nomeRecado4,
                escrevParentesco1,
                escrevParentesco2,
                escrevParentesco3,
                escrevParentesco4,
                telefone1WhatsApp,
                telefone2WhatsApp,
                telefone3WhatsApp,
                telefone4WhatsApp,
                ativarTelefone2,
                ativarTelefone3,
                ativarTelefone4,
            };

            let shouldFetch = false;

            for (const [key, currentValue] of Object.entries(allFields)) {
                const prevValue = prevValuesRef.current[key];
                const fullFieldName = `families[${familyIndex}].${key}`;

                if (currentValue !== prevValue && activeFieldName !== fullFieldName) {
                    prevValuesRef.current[key] = currentValue;
                    shouldFetch = true;
                }
            }

            if (!shouldFetch) return;

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
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        isActive,
        isViewMode,
        email,
        telefone1, telefone2, telefone3, telefone4,
        tipoTelefone1, tipoTelefone2, tipoTelefone3, tipoTelefone4,
        nomeRecado1, nomeRecado2, nomeRecado3, nomeRecado4,
        escrevParentesco1, escrevParentesco2, escrevParentesco3, escrevParentesco4,
        telefone1WhatsApp, telefone2WhatsApp, telefone3WhatsApp, telefone4WhatsApp,
        ativarTelefone2, ativarTelefone3, ativarTelefone4,
        familyIndex,
    ]);

    // Initialize telefones array if it doesn't exist
    useEffect(() => {
        const currentTelefones = form.getValues(`families[${familyIndex}].telefones`);
        if (!currentTelefones || !Array.isArray(currentTelefones) || currentTelefones.length === 0) {
            form.setValue(`families[${familyIndex}].telefones`, [{ numero: "", isWhatsApp: false }]);
        }
    }, []);

    useEffect(() => {
        const phoneFields = [
            'telefone1',
            'telefone2',
            'telefone3',
            'telefone4',
        ];

        phoneFields.forEach(field => {
            const valor = formValues[field];
            if (valor) {
                const formatted = formatarTelefoneAuto(valor);
                if (formatted !== valor) {
                    form.setValue(`families[${familyIndex}].${field}`, formatted);
                }
            }
        });
    }, [
        formValues.telefone1,
        formValues.telefone2,
        formValues.telefone3,
        formValues.telefoneResidencial,
        formValues.telefoneRecado,
        formValues.telefoneComercial,
        familyIndex,
        form
    ]);

    useEffect(() => {
        // Garante valor inicial do checkbox 'naoSabeEmail'
        if (formValues.naoSabeEmail === undefined) {
            form.setValue(`families[${familyIndex}].naoSabeEmail`, false);
        }
    }, [formValues.naoSabeEmail, form, familyIndex]);

    useEffect(() => {
        // Garante valor inicial do checkbox 'naoSabeTelefoneComercial'
        if (formValues.naoSabeTelefoneComercial === undefined) {
            form.setValue(`families[${familyIndex}].naoSabeTelefoneComercial`, false);
        }
    }, [formValues.naoSabeTelefoneComercial, form, familyIndex]);

    useEffect(() => {
        if (!initializedRef.current) return;
        if (formValues.naoSabeEmail) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].email`);


            if (email) {
                console.log('[Arrolamento][Contato] Limpando email por naoSabeEmail=true')
                form.setValue(`families[${familyIndex}].email`, "");

            }
        }
    }, [formValues.naoSabeEmail, form, familyIndex]);

    useEffect(() => {
        if (!initializedRef.current) return;
        if (!ativarTelefone2) {
            console.log('[Arrolamento][Contato] Limpando campos de telefone2 por ativarTelefone2=false')
            form.setValue(`families[${familyIndex}].telefone2`, "");
            form.setValue(`families[${familyIndex}].tipoTelefone2`, "");
            form.setValue(`families[${familyIndex}].nomeRecado2`, "");
            form.setValue(`families[${familyIndex}].escrevParentesco2`, "");
            form.setValue(`families[${familyIndex}].telefone2WhatsApp`, false);
        }
    }, [ativarTelefone2, familyIndex]);

    useEffect(() => {
        if (!initializedRef.current) return;
        if (!ativarTelefone3) {
            console.log('[Arrolamento][Contato] Limpando campos de telefone3 por ativarTelefone3=false')
            form.setValue(`families[${familyIndex}].telefone3`, "");
            form.setValue(`families[${familyIndex}].tipoTelefone3`, "");
            form.setValue(`families[${familyIndex}].nomeRecado3`, "");
            form.setValue(`families[${familyIndex}].escrevParentesco3`, "");
            form.setValue(`families[${familyIndex}].telefone3WhatsApp`, false);
        }
    }, [ativarTelefone3, familyIndex]);

    useEffect(() => {
        if (!initializedRef.current) return;
        if (!ativarTelefone4) {
            console.log('[Arrolamento][Contato] Limpando campos de telefone4 por ativarTelefone4=false')
            form.setValue(`families[${familyIndex}].telefone4`, "");
            form.setValue(`families[${familyIndex}].tipoTelefone4`, "");
            form.setValue(`families[${familyIndex}].nomeRecado4`, "");
            form.setValue(`families[${familyIndex}].escrevParentesco4`, "");
            form.setValue(`families[${familyIndex}].telefone4WhatsApp`, false);
        }
    }, [ativarTelefone4, familyIndex]);

    // Marca que inicialização foi concluída (evita limpar valores carregados)
    useEffect(() => { initializedRef.current = true }, [])

    // Antes de concluir inicialização, se já existem telefones 2/3/4 vindos do GET, habilita os toggles
    useEffect(() => {
        if (initializedRef.current) return;
        const t2 = form.getValues(`families[${familyIndex}].telefone2`)
        const t3 = form.getValues(`families[${familyIndex}].telefone3`)
        const t4 = form.getValues(`families[${familyIndex}].telefone4`)
        if (t2) {
            console.log('[Arrolamento][Contato] Detectado telefone2 carregado. Habilitando ativarTelefone2.')
            form.setValue(`families[${familyIndex}].ativarTelefone2`, true, { shouldValidate: false })
        }
        if (t3) {
            console.log('[Arrolamento][Contato] Detectado telefone3 carregado. Habilitando ativarTelefone3.')
            form.setValue(`families[${familyIndex}].ativarTelefone3`, true, { shouldValidate: false })
        }
        if (t4) {
            console.log('[Arrolamento][Contato] Detectado telefone4 carregado. Habilitando ativarTelefone4.')
            form.setValue(`families[${familyIndex}].ativarTelefone4`, true, { shouldValidate: false })
        }
    }, [familyIndex])

    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    useEffect(() => {
        console.log('[Arrolamento][Contato] watched values', { familyIndex, email, telefone1, telefone2, telefone3, telefone4 })
    }, [familyIndex, email, telefone1, telefone2, telefone3, telefone4])

    return (
        <div className="text-left">
            <Collapsible
                open={mostrarContato}
                onOpenChange={(open) => {
                    setMostrarContato(open);
                    if (open) {
                        hasSectionBeenOpenedRef.current = true;
                        firstBlurSkippedRef.current = false;
                    }
                }}
            >
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 2} - ${formSections[0].title}`}
                        </h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formSections.map((section, sectionIndex) => (
                        <FormSectionRenderer
                            key={section.id}
                            section={section}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 2}.${fieldIndex + 1}`}
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

export default InfoContatoForm; 