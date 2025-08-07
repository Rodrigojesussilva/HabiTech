import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections,
} from "@/components/forms/selagem/definitions/anexos.definition";
// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "@/service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "@/service/constants"

// Optional: Import country data if used in the component

interface AnexosFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const AnexosForm = ({ sectionIndex: sectionNumber, familyIndex }: AnexosFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    console.log(formValues);
    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    const anexoSelo = form.watch(`families[${familyIndex}].anexoSelo`);
    const anexoFachada = form.watch(`families[${familyIndex}].anexoFachada`);
    const anexoMorador = form.watch(`families[${familyIndex}].anexoMorador`);
    const anexoOutros = form.watch(`families[${familyIndex}].anexoOutros`);



    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoSelo`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoSelo`, base64);
            };
            reader.readAsDataURL(valorCampo);
        }

    }, [form.watch(`families[${familyIndex}].anexoSelo`)]);

    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoFachada`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoFachada`, base64);
            };
            reader.readAsDataURL(valorCampo);
        }

    }, [form.watch(`families[${familyIndex}].anexoFachada`)]);

    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoMorador`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoMorador`, base64);
            };
            reader.readAsDataURL(valorCampo);
        }

    }, [form.watch(`families[${familyIndex}].anexoMorador`)]);

    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoOutros`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoOutros`, base64);
            };
            reader.readAsDataURL(valorCampo);
        }

    }, [form.watch(`families[${familyIndex}].anexoOutros`)]);


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

    function isGetSelagemResponse(response: any): response is { selagens: any[] } {
        return response && Array.isArray(response.selagens);
    }

    const fetchDataAndUploadFileSelagem = async (fileBase64: string) => {
        const seiFromStorageRaw = localStorage.getItem("seiNumberS"); // adaptado para "seiNumberS"
        const seiFromStorage = Number(seiFromStorageRaw);

        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchSelagem(request);

            if (!isGetSelagemResponse(response)) {
                showErrorMessage("Resposta inválida ou erro ao buscar selagens");
                return;
            }

            if (response.selagens.length === 0) {
                showErrorMessage("Nenhuma Selagem encontrada");
                return;
            }

            const selagem = response.selagens[0];
            const selagemId = selagem.id;

            localStorage.setItem("selagemId", selagemId);

            const uploadResponse = await survey_resource.SendFileToUpload(SURVEY_RESOURCE_BASE_URL, selagemId, fileBase64);

            console.log("Upload realizado com sucesso:", uploadResponse);
        } catch (error) {
            console.error("Erro ao buscar selagens ou enviar arquivo:", error);
            showErrorMessage("Erro ao buscar dados da selagem ou enviar arquivo");
        }
    };

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {/* Regular form fields using FormSectionRenderer */}
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

                    <div className="mt-4 w-full flex justify-start">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
                            onClick={async () => {
                                try {
                                    // Verifica e envia apenas os arquivos que não estão em branco
                                    if (anexoSelo) {
                                        console.log("fileContentAnexoSelo:", anexoSelo);
                                        await fetchDataAndUploadFileSelagem(anexoSelo);
                                    }

                                    if (anexoFachada) {
                                        console.log("fileContentAnexoFachada:", anexoFachada);
                                        await fetchDataAndUploadFileSelagem(anexoFachada);
                                    }

                                    if (anexoMorador) {
                                        console.log("fileContentanexoMorador:", anexoMorador);
                                        await fetchDataAndUploadFileSelagem(anexoMorador);
                                    }

                                    if (anexoOutros) {
                                        console.log("fileContentAnexoOutros:", anexoOutros);
                                        await fetchDataAndUploadFileSelagem(anexoOutros);
                                    }

                                    alert("Arquivo(s) enviado(s) com sucesso!");
                                } catch (error) {
                                    alert("Erro ao enviar arquivo, veja o console.");
                                    console.error(error);
                                }
                            }}

                        >
                            Enviar Anexos
                        </button>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default AnexosForm; 