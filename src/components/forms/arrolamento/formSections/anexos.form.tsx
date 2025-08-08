import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections,
} from "@/components/forms/arrolamento/definitions/anexos.definition";

import Swal from 'sweetalert2';
// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import survey_resource from "@/service/survey_resource.api"
import { API_BASE_URL } from "@/service/constants"
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
    const ComprovanteRenda = form.watch(`families[${familyIndex}].anexoComprovanteRenda`);
    const CarteiraTrabalho = form.watch(`families[${familyIndex}].anexoCarteiraTrabalho`);
    const Area = form.watch(`families[${familyIndex}].anexoArea`);


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

    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos);
    }

    const fetchDataAndUploadFile = async (fileBase64: string) => {
        const seiFromStorageRaw = localStorage.getItem("seiNumber");
        const seiFromStorage = Number(seiFromStorageRaw);

        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchArrolamento(request);

            if (!isGetArrolamentoResponse(response)) {
                showErrorMessage("Resposta inválida ou erro ao buscar arrolamentos");
                return;
            }

            if (response.arrolamentos.length === 0) {
                showErrorMessage("Nenhum Arrolamento encontrado");
                return;
            }

            const arrolamento = response.arrolamentos[0];
            const arrolamentoId = arrolamento.id;

            localStorage.setItem("arrolamentoId", arrolamentoId);

            const uploadResponse = await survey_resource.SendFileToUpload(API_BASE_URL, arrolamentoId, fileBase64);

            console.log("Upload realizado com sucesso:", uploadResponse);

        } catch (error) {
            console.error("Erro ao buscar arrolamentos ou enviar arquivo:", error);
            showErrorMessage("Erro ao buscar dados do arrolamento ou enviar arquivo");
        }
    };

    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoComprovanteRenda`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoComprovanteRenda`, base64);
                //  console.log("Base64 anexoComprovanteRenda salvo:", base64);
            };
            reader.readAsDataURL(valorCampo);
        }

        // Loga o valor do campo, mesmo que não seja File
        console.log("Valor atual do campo anexoComprovanteRenda:", valorCampo);

    }, [form.watch(`families[${familyIndex}].anexoComprovanteRenda`)]);

    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoCarteiraTrabalho`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoCarteiraTrabalho`, base64);
                // console.log("Base64 anexoCarteiraTrabalho salvo:", base64);
            };
            reader.readAsDataURL(valorCampo);
        }
    }, [form.watch(`families[${familyIndex}].anexoCarteiraTrabalho`)]); // Escuta mudanças no campo

    useEffect(() => {
        const valorCampo = form.getValues(`families[${familyIndex}].anexoArea`);

        // Se o valor for um File (arquivo), converte para base64
        if (valorCampo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                // Substitui o File pelo base64 no form
                form.setValue(`families[${familyIndex}].anexoArea`, base64);
                // console.log("Base64 anexoArea salvo:", base64);
            };
            reader.readAsDataURL(valorCampo);
        }
    }, [form.watch(`families[${familyIndex}].anexoArea`)]); // Escuta mudanças no campo

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
                                    if (ComprovanteRenda) {
                                        console.log("fileContentComprovanteRenda:", ComprovanteRenda);
                                        await fetchDataAndUploadFile(ComprovanteRenda);
                                    }

                                    if (CarteiraTrabalho) {
                                        console.log("fileContentCarteiraTrabalho:", CarteiraTrabalho);
                                        await fetchDataAndUploadFile(CarteiraTrabalho);
                                    }

                                    if (Area) {
                                        console.log("fileContentArea:", Area);
                                        await fetchDataAndUploadFile(Area);
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