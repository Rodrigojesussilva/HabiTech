import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/identEticRacGene.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import useViewMode from '@/hooks/useViewMode'

interface IdentEticRacGeneFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    isActive?: boolean;
}

const IdentEticRacGeneForm = ({ sectionIndex: sectionNumber, familyIndex, isActive = true }: IdentEticRacGeneFormProps) => {
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
    const etnicoRacial = form.watch(`families[${familyIndex}].etnicoRacial`);
    const genero = form.watch(`families[${familyIndex}].genero`);
    const generoOutro = form.watch(`families[${familyIndex}].generoOutro`);
    const triggeredByBlurRef = useRef(false);
    const hasSectionBeenOpenedRef = useRef(false);
    const firstBlurSkippedRef = useRef(false);


    const prevValuesRef = useRef<Record<string, any>>({
        etnico_racial: etnicoRacial,
        genero: genero,
        genero_outro: generoOutro,
    });

    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos)
    };

    const fetchData = async () => {
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
                await handleIdentificacaoResponse(response);
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

    const handleIdentificacaoResponse = async (response: any) => {
        if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][EtnicoRacial] View/Completed: PATCH bloqueado'); return; }
        const arrolamento = response.arrolamentos?.[0] || null;
        const fallbackId = localStorage.getItem('arrolamentoId') || ''
        const fallbackCreatedBy = localStorage.getItem('arrolamentoCreated_by') || ''
        const target = arrolamento || (fallbackId ? { id: fallbackId, created_by: fallbackCreatedBy } : null)
        if (target) {
            if (!arrolamento) console.log('[Arrolamento][EtnicoRacial] PATCH: usando contexto localStorage id=', fallbackId)
            const completedResp = !!(target?.completed || (target?.status_notas && (target as any).status_notas.status === 'Concluida'))
            if (completedResp) { console.log('[Arrolamento][EtnicoRacial] Registro concluído. Abortando PATCH.'); return; }
            const arrolamentoId = (target as any).id;
            const criadoPor = (target as any).created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            const payload = {
                created_by: criadoPor,
                form: {
                    family_index: 1,
                    identificacao_etnico_racial: {
                        etnico_racial: etnicoRacial,
                        genero: genero,
                        genero_outro: generoOutro,
                    },
                },
            };

            try {
                console.log('[Arrolamento][EtnicoRacial] PATCH prepared (final):', payload);
                const token = localStorage.getItem('authToken') || ''
                await survey_resource.SendFormToArrolamentoEtnicoRacial(SURVEY_RESOURCE_URL, arrolamentoId, payload, token);
            } catch (error) {
                console.error("Erro ao enviar identificação étnico-racial:", error);
                if (!isViewMode && !isCompletedNow()) showErrorMessage("Erro ao enviar os dados de identificação étnico-racial");
            }
        }
    };

    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const idLS = localStorage.getItem('arrolamentoId')
            if (idLS) { console.log('[Arrolamento][EtnicoRacial] hasArrolamento: usando contexto localStorage id=', idLS); return true }
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
            // Evita PATCH no primeiro blur após a abertura da seção
            if (!firstBlurSkippedRef.current) {
                firstBlurSkippedRef.current = true;
                return;
            }
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                "identificacao_etnico_racial.etnico_racial": etnicoRacial,
                "identificacao_etnico_racial.genero": genero,
                "identificacao_etnico_racial.genero_outro": generoOutro,
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

                // ✅ Aqui agora chamamos fetchData, que por sua vez chama handleIdentificacaoResponse
                await fetchData();
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [isActive, isViewMode, etnicoRacial, genero, generoOutro]);


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

export default IdentEticRacGeneForm; 