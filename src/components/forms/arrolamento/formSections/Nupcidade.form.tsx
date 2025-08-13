import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/nupcidade.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import useViewMode from '@/hooks/useViewMode'

interface NupcidadeFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    isActive?: boolean;
}

const NupcidadeForm = ({ sectionIndex: sectionNumber, familyIndex, isActive = true }: NupcidadeFormProps) => {
    const isViewMode = useViewMode();
    const isCompletedNow = () => localStorage.getItem('arrolamentoCompleted') === 'true';
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    const estadoCivil = form.watch(`families[${familyIndex}].estadoCivil`);
    const nomeCompanheiro = form.watch(`families[${familyIndex}].nomeCompanheiro`);
    const viveComCompanheiro = form.watch(`families[${familyIndex}].viveComCompanheiro`);
    const triggeredByBlurRef = useRef(false);
    const hasSectionBeenOpenedRef = useRef(false);
    const firstBlurSkippedRef = useRef(false);


    const prevValuesRef = useRef<Record<string, any>>({
        estado_civil: estadoCivil,
        nome_companheiro: nomeCompanheiro,
        vive_com_companheiro: viveComCompanheiro,
    });

    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos)
    };

    const fetchData = async () => {
        if (isViewMode || isCompletedNow()) return;
        const idLS = localStorage.getItem('arrolamentoId')
        if (idLS) {
            console.log('[Arrolamento][Nupcidade] fetchData: usando fallback localStorage para PATCH imediato')
            await handleNupcidadeResponse({ arrolamentos: [] })
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
                await handleNupcidadeResponse(response);
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

    const handleNupcidadeResponse = async (response: any) => {
        if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Nupcidade] View/Completed: PATCH bloqueado'); return; }
        const arrolamento = response.arrolamentos?.[0] || null;
        const fallbackId = localStorage.getItem('arrolamentoId') || ''
        const fallbackCreatedBy = localStorage.getItem('arrolamentoCreated_by') || ''
        const target = arrolamento || (fallbackId ? { id: fallbackId, created_by: fallbackCreatedBy } : null)
        if (target) {
            if (!arrolamento) console.log('[Arrolamento][Nupcidade] PATCH: usando contexto localStorage id=', fallbackId)
            const completedResp = !!(target?.completed || (target?.status_notas && (target as any).status_notas.status === 'Concluida'))
            if (completedResp) { console.log('[Arrolamento][Nupcidade] Registro concluído. Abortando PATCH.'); return; }
            const arrolamentoId = (target as any).id;
            const criadoPor = (target as any).created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            const payload = {
                created_by: criadoPor,
                form: {
                    family_index: familyIndex + 1,
                    nupcidade: {
                        estado_civil: estadoCivil,
                        nome_companheiro: nomeCompanheiro,
                        vive_com_companheiro: Boolean(viveComCompanheiro),
                    },
                },
            };

            try {
                console.log('[Arrolamento][Nupcidade] PATCH prepared (final):', { family_index: familyIndex + 1, payload });
                const token = localStorage.getItem('authToken') || ''
                await survey_resource.SendFormToArrolamentoNupcidade(SURVEY_RESOURCE_URL, arrolamentoId, payload, token);
            } catch (error) {
                console.error("Erro ao enviar dados de nupcidade:", error);
                if (!isViewMode && !isCompletedNow()) showErrorMessage("Erro ao enviar os dados de nupcidade");
            }
        }
    };

    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const idLS = localStorage.getItem('arrolamentoId')
            if (idLS) { console.log('[Arrolamento][Nupcidade] hasArrolamento: usando contexto localStorage id=', idLS); return true }
            const response = await fetchArrolamento(request);

            const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);

            return !isEmpty;
        } catch (error) {
            console.error("Erro ao verificar arrolamentos:", error);
            return false;
        }
    };

    useEffect(() => {
        if (!isActive || isViewMode || isCompletedNow()) return;
        const handleBlur = async () => {
            // Evita PATCH antes do usuário abrir a seção ao menos uma vez
            if (!hasSectionBeenOpenedRef.current) {
                return;
            }
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                "nupcidade.estado_civil": estadoCivil,
                "nupcidade.nome_companheiro": nomeCompanheiro,
                "nupcidade.vive_com_companheiro": viveComCompanheiro,
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

                await fetchData(); // chama handleNupcidadeResponse internamente
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [isActive, isViewMode, estadoCivil, nomeCompanheiro, viveComCompanheiro]);


    useEffect(() => {
        const path = `families[${familyIndex}].nomeCompanheiro`;

        const rawValue = form.getValues(path); // sempre pega o valor atualizado

        if (typeof rawValue === "string") {
            const sanitizedValue = rawValue.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""); // mantém letras com acento e espaços

            if (rawValue !== sanitizedValue) {
                form.setValue(path, sanitizedValue);
            }
        }
    }, [form.getValues(`families[${familyIndex}].nomeCompanheiro`), form, familyIndex]);

    return (
        <div className="text-left">
            <Collapsible
                open={mostrarIdentificacao}
                onOpenChange={(open) => {
                    setMostrarIdentificacao(open);
                    if (open) {
                        hasSectionBeenOpenedRef.current = true;
                        firstBlurSkippedRef.current = false;
                    }
                }}
            >
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formSections.map((section, sectionIndex) => (
                        <FormSectionRenderer
                            key={section.id}
                            section={section}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
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

export default NupcidadeForm; 