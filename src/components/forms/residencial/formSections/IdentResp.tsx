import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections, identRespDefinition
} from "@/components/forms/residencial/definitions/IdentResp.definition";
// Import FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"
import { subprefeituras, distritosPorSubprefeitura } from '../subprefeiturasDistritos';
interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const IdentRespForm = ({ sectionIndex: sectionNumber, familyIndex }: IdentRespFormProps) => {
    const [mostrarSituacaoUso, setMostrarSituacaoUso] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const [estadoOptions,] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptions,] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptions, setSubPrefeituraOptions] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsState, setDistritoOptionsState] = useState<{ label: string; value: string }[]>([]);
    const form = useFormContext();
    // Observe os campos relevantes para montar o payload
    const nomeResponsavel = form.watch(`families[${familyIndex}].nome_responsavel`);
    const qualUso = form.watch(`families[${familyIndex}].qualUso`);
    const responsavelIdentificado = form.watch(`families[${familyIndex}].responsavel_identificado`);
    const situacao = form.watch(`families[${familyIndex}].situacaoUsoUnidade`);
    const telefoneResponsavel = form.watch(`families[${familyIndex}].telefone_responsavel`);
    const tiposUso = form.watch(`families[${familyIndex}].quaisTipos`);
    const uso = form.watch(`families[${familyIndex}].uso`);
    const usoTerreno = form.watch(`families[${familyIndex}].uso_terreno`);
    const usoUnidade = form.watch(`families[${familyIndex}].usoUnidade`);
    const triggeredByBlurRef = useRef(false);    

    // Get form values for conditional logic
    const formValues = (() => {
        try {
            return form.watch(`families[${familyIndex}]`) || {};
        } catch (err) {
            console.error("Erro ao acessar form values:", err);
            return {};
        }
    })();

    const prevValuesRef = useRef<Record<string, any>>({
        nomeResponsavel,
        qualUso,
        responsavelIdentificado,
        situacao,
        telefoneResponsavel,
        tiposUso,
        uso,
        usoTerreno,
        usoUnidade,
    });

    function isGetSelagemResponse(response: any): response is { selagens: any[] } {
        return response && Array.isArray(response.selagens);
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

    const fetchSelagemData = async () => {
        console.log("Acessando fetchSelagemData ");
        const seiFromStorageRaw = localStorage.getItem("seiNumberS");
        const seiFromStorage = seiFromStorageRaw;

        try {
            const selagemIdFromStorage = localStorage.getItem('selagemId') || '';
            const hasSelagemId = Boolean(selagemIdFromStorage);
            const numeroSei = hasSelagemId ? undefined : (seiFromStorage || undefined);

            const request: any = {
                initial_date: initialDate,
                end_date: endDate,
            };
            if (hasSelagemId) {
                request.id = selagemIdFromStorage;
            } else if (numeroSei) {
                request.numero_sei = numeroSei;
            }

            const response = await fetchSelagem(request);
            console.log("Resposta de fetchSelagem:", response);

            const passedCheck = isGetSelagemResponse(response);
            console.log("Passou isGetSelagemResponse?", passedCheck);

            if (passedCheck) {
                await handleSelagemResponse(response);
            }
        } catch (error) {
            console.error("Erro ao buscar selagens:", error);
            showErrorMessage("Erro ao buscar dados da selagem");
        }
    };

    const handleSelagemResponse = async (response: any) => {
        console.log("Acessando handleSelagemResponse")
        const selagem = response.selagens?.[0];
        if (selagem) {
            const selagemId = selagem.id;
            const criadoPor = selagem.created_by;

            localStorage.setItem("selagemId", selagemId);
            localStorage.setItem("selagemCreated_by", criadoPor);
            console.log("ID da Selagem recebido:", selagemId);


            const payload = {
                created_by: criadoPor,
                situacao_uso_unidade: {
                    nome_responsavel: nomeResponsavel,
                    qual_uso: qualUso,
                    responsavel_identificado: responsavelIdentificado,
                    situacao: situacao,
                    telefone_responsavel: telefoneResponsavel,
                    tipos_uso: tiposUso,
                    uso: uso,
                    uso_terreno: usoTerreno,
                    uso_unidade: usoUnidade,
                },
            };

            try {
                console.log("Payload Situação de Uso da Unidade:", JSON.stringify(payload, null, 2));
                await survey_resource.SendFormToSelagemSituacaoUsoUnidade(SURVEY_RESOURCE_BASE_URL, selagemId, payload);
            } catch (error) {
                console.error("Erro ao enviar situação de uso da unidade:", error);
                showErrorMessage("Erro ao enviar os dados de situação de uso da unidade");
            }
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
            console.log("Acessando User efect")
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                "situacao_uso_unidade.nome_responsavel": nomeResponsavel,
                "situacao_uso_unidade.qual_uso": qualUso,
                "situacao_uso_unidade.responsavel_identificado": responsavelIdentificado,
                "situacao_uso_unidade.situacao": situacao,
                "situacao_uso_unidade.telefone_responsavel": telefoneResponsavel,
                "situacao_uso_unidade.tipos_uso": tiposUso,
                "situacao_uso_unidade.uso": uso,
                "situacao_uso_unidade.uso_terreno": usoTerreno,
                "situacao_uso_unidade.uso_unidade": usoUnidade,
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

            if (shouldFetch) {
                const selagemIdFromStorage = localStorage.getItem('selagemId') || '';
                const hasSelagemId = Boolean(selagemIdFromStorage);
                const seiNumber = hasSelagemId ? undefined : localStorage.getItem("seiNumberS") || undefined;
                const request: any = {
                    initial_date: initialDate,
                    end_date: endDate,
                };
                if (hasSelagemId) {
                    request.id = selagemIdFromStorage;
                } else if (seiNumber) {
                    request.numero_sei = seiNumber;
                }

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
        nomeResponsavel,
        qualUso,
        responsavelIdentificado,
        situacao,
        telefoneResponsavel,
        tiposUso,
        uso,
        usoTerreno,
        usoUnidade,
    ]);
    // Carrega subprefeituras (pode ser fetch ou lista estática)
    useEffect(() => {
        const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
        setSubPrefeituraOptions(options);
    }, []);

    // Carrega subprefeituras (pode ser fetch ou lista estática)
    useEffect(() => {
        const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
        setSubPrefeituraOptions(options);
    }, []);

    useEffect(() => {
        const sub = formValues.subPrefeitura_t || formValues.subPrefeitura;

        if (!sub) {
            setDistritoOptionsState([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[sub] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));

        setDistritoOptionsState(options);
    }, [formValues.subPrefeitura, formValues.subPrefeitura_t]);

    // Get merged form sections with conditional fields included
    const formSections = (() => {
        try {
            // Clona os valores do formulário de forma segura
            const safeFormValues = { ...formValues };

            // Obtém as seções do formulário
            const sections = getMergedFormSections(safeFormValues).map(section => ({
                ...section,
                fields: section.fields.map(field => {
                    switch (field.name) {
                        case 'uf':
                            return {
                                ...field,
                                options: estadoOptions,
                            };
                        case 'cidade':
                            return {
                                ...field,
                                options: cidadeOptions,
                            };
                        case 'subPrefeitura':
                            return {
                                ...field,
                                options: subPrefeituraOptions,
                            };
                        case 'distrito':
                            return {
                                ...field,
                                options: distritoOptionsState,
                            };
                        case 'subPrefeitura_t':
                            return {
                                ...field,
                                options: subPrefeituraOptions,
                            };
                        case 'distrito_t':
                            return {
                                ...field,
                                options: distritoOptionsState,
                            };
                        default:
                            return field;
                    }
                })
            }));

            return sections;
        } catch (err) {
            console.error("Erro ao obter as seções do formulário:", err);
            return [identRespDefinition.sections[0]]; // Fallback para seção básica
        }
    })();


    return (
        <div className="text-left">
            <Collapsible open={mostrarSituacaoUso} onOpenChange={setMostrarSituacaoUso}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 3} -  Identificação da pessoa responsável
`}
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

export default IdentRespForm; 