import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/selagem/definitions/statusNotas.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"

interface PessoaDefFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const PessoaDefForm = ({ sectionIndex: sectionNumber, familyIndex }: PessoaDefFormProps) => {
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

    // Inicializa prevValuesRef só com os campos relevantes
    const prevValuesRef = useRef<Record<string, string>>({
        justificativa: justificativa,
        nome_supervisor: nomeSupervisor,
        observacao: observacao,
        status: status,
    });

    function isGetSelagemResponse(response: any): response is { selagens: any[] } {
        return response && Array.isArray(response.selagens);
    }

    const fetchSelagem = async (request: any) => {
        return await survey_resource.GetSelagem(request, async (req: any) => {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
                if (value !== undefined && value !== "") {
                    searchParams.append(key, String(value));
                }
            }

            const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
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

    const fetchSelagemData = async () => {
        const seiFromStorageRaw = localStorage.getItem("seiNumberS");
        const seiFromStorage = seiFromStorageRaw;

        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchSelagem(request);

            if (isGetSelagemResponse(response)) {
                await handleSelagemResponse(response);
            } else {
                console.warn("Resposta NÃO é do tipo GetSelagemResponse", response);
            }
        } catch (error) {
            console.error("Erro ao buscar selagens:", error);
            showErrorMessage("Erro ao buscar dados da selagem");
        }
    };

    const handleSelagemResponse = async (response: any) => {
        const selagem = response.selagens?.[0];
        if (!selagem) return;

        const selagemId = selagem.id;
        const criadoPor = selagem.created_by;

        localStorage.setItem("selagemId", selagemId);
        localStorage.setItem("selagemCreated_by", criadoPor);

        const sanitizeField = (value: any) => {
            if (value == null || value === "") return "string";
            return String(value);
        };
        void sanitizeField;

        const payload = {
            created_by: criadoPor,
            status_notas: {
                justificativa: justificativa,
                nome_supervisor: nomeSupervisor,
                observacao: observacao,
                status: status,
            },
        };

        try {
            console.log("Payload Selagem:", JSON.stringify(payload, null, 2));
            await survey_resource.SendFormToSelagemStatusNotas(SURVEY_RESOURCE_BASE_URL, selagemId, payload);
        } catch (error) {
            console.error("Erro ao enviar status_notas:", error);
            showErrorMessage("Erro ao enviar os dados de status_notas");
        }
    };

    const hasSelagem = async (request: any): Promise<boolean> => {
        try {
            const response = await fetchSelagem(request);
            const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);
            return !isEmpty;
        } catch (error) {
            console.error("Erro ao verificar selagens:", error);
            return false;
        }
    };

    useEffect(() => {
        const handleBlur = async () => {
            const activeFieldName = document.activeElement?.getAttribute("name");

            const sanitizeField = (value: any) => {
                if (value == null || value === "") return "string"; // valor padrão aceito pela API
                return String(value);
            };

            const fields = {
                justificativa: sanitizeField(justificativa),
                nome_supervisor: sanitizeField(nomeSupervisor),
                observacao: sanitizeField(observacao),
                status: sanitizeField(status),
            };

            let shouldFetch = false;

            for (const [fieldKey, currentValue] of Object.entries(fields)) {
                const prevValue = prevValuesRef.current[fieldKey];

                // Só dispara se o campo mudou e não é o campo atualmente ativo
                if (
                    currentValue !== prevValue &&
                    activeFieldName !== `families[${familyIndex}].statusNotas.${fieldKey}`
                ) {
                    shouldFetch = true;
                    prevValuesRef.current[fieldKey] = currentValue;
                }
            }

            if (shouldFetch) {
                const seiNumber = localStorage.getItem("seiNumberS");
                const request = {
                    numero_sei: seiNumber,
                    initial_date: initialDate,
                    end_date: endDate,
                };

                const hasData = await hasSelagem(request);
                if (!hasData) {
                    console.log("Nenhuma Selagem Cadastrada");
                    return;
                }

                triggeredByBlurRef.current = true;
                fetchSelagemData();
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        justificativa,
        nomeSupervisor,
        observacao,
        status,
    ]);

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
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
                    {/* 
<div className="mt-4 w-full flex justify-start">
  <button
    type="button"
    className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
    onClick={() => {
      console.log("Botão clicado!");
    }}
  >
    Salvar
  </button>
</div> 
*/}

                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default PessoaDefForm; 