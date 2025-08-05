import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/outrasInfos.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { API_BASE_URL } from "../../../../service/constants"
interface OutrasInfosFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const OutrasInfosForm = ({ sectionIndex: sectionNumber, familyIndex }: OutrasInfosFormProps) => {
    const [mostrarOutrasInfos, setMostrarOutrasInfos] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    // Get form context from React Hook Form

    const form = useFormContext();
    // Get form values
    const formValues = form.watch(`families[${familyIndex}]`);

    // Get merged form sections
    const formSections = getMergedFormSections(formValues);
    const outrasInformacoesTexto = form.watch(`families[${familyIndex}].texto`);
    const triggeredByBlurRef = useRef(false);

    const prevValuesRef = useRef<Record<string, any>>({
        texto: outrasInformacoesTexto,
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
                await handleOutrasInfResponse(response);
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

            const url = `${API_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
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

    const handleOutrasInfResponse = async (response: any) => {
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
                outras_informacoes: {
                    texto: outrasInformacoesTexto,
                },
            };

            try {
                console.log("Payload Outras Informações:", JSON.stringify(payload, null, 2));
                await survey_resource.SendFormToArrolamentoOutrasInf(API_BASE_URL, arrolamentoId, payload);
            } catch (error) {
                console.error("Erro ao enviar outras informações:", error);
                showErrorMessage("Erro ao enviar outras informações da família");
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
        const handleBlur = async () => {
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                "outras_informacoes.texto": outrasInformacoesTexto,
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

                await fetchData(); // agora chama handleInformacaoFamiliaResponse
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [outrasInformacoesTexto]);

    return (
        <div className="text-left">
            <Collapsible open={mostrarOutrasInfos} onOpenChange={setMostrarOutrasInfos}>
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

export default OutrasInfosForm; 