import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/statusNotas.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"

interface PessoaDefFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    isActive?: boolean;
}



const PessoaDefForm = ({ sectionIndex: sectionNumber, familyIndex, isActive = true }: PessoaDefFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    const status = form.watch(`families[${familyIndex}].status`);
    const justificativa = form.watch(`families[${familyIndex}].justificativa`);
    const nomeSupervisor = form.watch(`families[${familyIndex}].nomeSupervisor`);
    const observacao = form.watch(`families[${familyIndex}].observacao`);
    const triggeredByBlurRef = useRef(false);
    const hasSectionBeenOpenedRef = useRef(false);
    const firstBlurSkippedRef = useRef(false);

    const prevValuesRef = useRef<Record<string, any>>({
        justificativa: justificativa,
        nome_supervisor: nomeSupervisor,
        observacao: observacao,
        status: status,
    });

    function isGetArrolamentoResponse(response: any): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos);
    }

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
                await handleStatusNotasResponse(response);
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

    const handleStatusNotasResponse = async (response: any) => {
        const arrolamento = response.arrolamentos?.[0];
        if (arrolamento) {
            const arrolamentoId = arrolamento.id;
            const criadoPor = arrolamento.created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            const payload = {
                created_by: criadoPor,
                form: {
                    family_index: 1,
                },
                status_notas: {
                    justificativa: justificativa || "",
                    nome_supervisor: nomeSupervisor || "",
                    observacao: observacao || "",
                    status: status || "",
                },
            };

            try {
                console.log("Payload Status Notas:", JSON.stringify(payload, null, 2));
                const token = localStorage.getItem('authToken') || ''
                await survey_resource.SendFormToArrolamentoStatusNotas(SURVEY_RESOURCE_URL, arrolamentoId, payload, token);
            } catch (error) {
                console.error("Erro ao enviar status_notas:", error);
                showErrorMessage("Erro ao enviar status_notas da família");
            }
        }
    };

    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const response = await fetchArrolamento(request);
            const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);
            return !isEmpty;
        } catch (error) {
            console.error("Erro ao verificar arrolamentos:", error);
            return false;
        }
    };

    useEffect(() => {
        if (!isActive) return;
        const handleBlur = async () => {
            // Evita PATCH antes do usuário abrir a seção ao menos uma vez
            if (!hasSectionBeenOpenedRef.current) {
                return;
            }
            // Evita PATCH no primeiro blur após a abertura da seção somente quando não houve mudança
            // (para que a primeira edição real já dispare o PATCH)
            // Nota: esta seção pode já estar aberta por padrão conforme UX
            if (!firstBlurSkippedRef.current) {
                // Ainda vamos calcular mudanças antes de decidir retornar
            }
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                justificativa: justificativa,
                nome_supervisor: nomeSupervisor,
                observacao: observacao,
                status: status,
            };

            let shouldFetch = false;

            for (const [key, currentValue] of Object.entries(fields)) {
                const prevValue = prevValuesRef.current[key];

                if (currentValue !== prevValue && activeFieldName !== key) {
                    shouldFetch = true;
                    prevValuesRef.current[key] = currentValue;
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

                await fetchData(); // chama handleStatusNotasResponse
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        isActive,
        justificativa,
        nomeSupervisor,
        observacao,
        status,
    ]);

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

export default PessoaDefForm; 