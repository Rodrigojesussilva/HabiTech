import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/selagem/definitions/identEspacoHabitado.definition";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { formatarNumeroComTresDecimais, formatarNumeroComQuatroDecimais, formatarNumeroComDoisDecimais } from "@/components/forms/selagem/helpers/identEspacoHabitado.helper";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { API_BASE_URL, SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"

interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const IdentEspacoHabitadoForm = ({ sectionIndex: sectionNumber, familyIndex }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(true);
    const [initialDate] = useState("")
    const [endDate] = useState("")

    const { watch, setValue } = useFormContext();
    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    const formSections = getMergedFormSections(formValues);

    const seloSetor = watch(`families[${familyIndex}].identificacaoSeloSetor`);
    const seloLote = watch(`families[${familyIndex}].identificacaoSeloLote`);
    const seloUnidade = watch(`families[${familyIndex}].identificacaoSeloUnidade`);
    const seloComplemento = watch(`families[${familyIndex}].identificacaoSeloComplemento`);
    const numeroSelo = watch(`families[${familyIndex}].numeroSelo`);
    const nomeEspacoHabitado = form.watch(`families[${familyIndex}].nomeEspacoHabitado`);
    const triggeredByBlurRef = useRef(false);

    const prevValuesRef = useRef<Record<string, any>>({
        nome_espaco_habitado: nomeEspacoHabitado,
        numero_selo: numeroSelo,
        selo_complemento: seloComplemento,
        selo_lote: seloLote,
        selo_setor: seloSetor,
        selo_unidade: seloUnidade,
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

    const fetchSelagemData = async () => {
        const seiFromStorageRaw = localStorage.getItem("seiNumberS");
        console.log("seiFromStorageRaw:", seiFromStorageRaw);

        const seiFromStorage = Number(seiFromStorageRaw);
        console.log("seiFromStorage (Number):", seiFromStorage);

        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };
            console.log("Request para fetchSelagem:", request);

            const response = await fetchSelagem(request);
            console.log("Resposta fetchSelagem:", response);

            if (isGetSelagemResponse(response)) {
                console.log("Resposta é do tipo GetSelagemResponse, chamando handleSelagemResponse");
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
        if (selagem) {
            const selagemId = selagem.id;
            const criadoPor = selagem.created_by;

            localStorage.setItem("selagemId", selagemId);
            localStorage.setItem("selagemCreated_by", criadoPor);
            console.log("ID da Selagem recebido:", selagemId);

            const payload = {
                created_by: criadoPor,
                identificacao_espaco_habitado: {
                    nome_espaco_habitado: nomeEspacoHabitado,
                    numero_selo: numeroSelo,
                    selo_complemento: seloComplemento,
                    selo_lote: seloLote,
                    selo_setor: seloSetor,
                    selo_unidade: seloUnidade,
                },
            };

            try {
                console.log("Payload Selagem:", JSON.stringify(payload, null, 2));
                await survey_resource.SendFormToSelagemIdentificacaoEspaco(API_BASE_URL, selagemId, payload);
            } catch (error) {
                console.error("Erro ao enviar identificação do espaço habitado:", error);
                showErrorMessage("Erro ao enviar os dados de identificação do espaço habitado");
            }
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

    useEffect(() => {
        const handleBlur = async () => {
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                ["identificacao_espaco_habitado.nome_espaco_habitado"]: nomeEspacoHabitado,
                ["identificacao_espaco_habitado.numero_selo"]: numeroSelo,
                ["identificacao_espaco_habitado.selo_complemento"]: seloComplemento,
                ["identificacao_espaco_habitado.selo_lote"]: seloLote,
                ["identificacao_espaco_habitado.selo_setor"]: seloSetor,
                ["identificacao_espaco_habitado.selo_unidade"]: seloUnidade,
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
                const seiNumber = localStorage.getItem("seiNumberS");
                const request = {
                    numero_sei: Number(seiNumber),
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
        nomeEspacoHabitado,
        numeroSelo,
        seloComplemento,
        seloLote,
        seloSetor,
        seloUnidade,
    ]);

    useEffect(() => {
        // Se todos os campos forem undefined, não faz nada
        if (
            seloSetor === undefined &&
            seloLote === undefined &&
            seloUnidade === undefined &&
            seloComplemento === undefined
        ) {
            return;
        }

        // Formatação dos números, removendo qualquer caractere não numérico
        const setorNumeros = String(seloSetor || "").replace(/[^\d]/g, "").padStart(3, "0").slice(0, 3);
        const loteNumeros = String(seloLote || "").replace(/[^\d]/g, "").padStart(4, "0").slice(0, 4);
        const unidadeNumeros = String(seloUnidade || "").replace(/[^\d]/g, "").padStart(2, "0").slice(0, 2);

        // A parte fixa do número do selo
        let numeroSeloFormatado = `${setorNumeros}/${loteNumeros}${unidadeNumeros}-`;

        // Se o complemento for fornecido, inclui no número do selo
        const complemento = seloComplemento || "";
        numeroSeloFormatado += complemento;

        // Atualiza o valor do número do selo, se ele tiver mudado
        if (numeroSelo !== numeroSeloFormatado) {
            setValue(`families[${familyIndex}].numeroSelo`, numeroSeloFormatado, { shouldDirty: true });
        }

    }, [seloSetor, seloLote, seloUnidade, seloComplemento, numeroSelo, familyIndex, setValue]);

    useEffect(() => {
        if (seloSetor === undefined || seloSetor === null) return;

        const formatado = formatarNumeroComTresDecimais(seloSetor);

        // Só atualiza se for diferente para evitar loop
        if (seloSetor !== formatado) {
            setValue(`families[${familyIndex}].identificacaoSeloSetor`, formatado, { shouldDirty: true });
        }
    }, [seloSetor, familyIndex, setValue]);

    useEffect(() => {
        if (seloLote === undefined || seloLote === null) return;

        const formatado = formatarNumeroComQuatroDecimais(seloLote);

        // Só atualiza se for diferente para evitar loop
        if (seloLote !== formatado) {
            setValue(`families[${familyIndex}].identificacaoSeloLote`, formatado, { shouldDirty: true });
        }
    }, [seloLote, familyIndex, setValue]);

    useEffect(() => {
        if (seloUnidade === undefined || seloUnidade === null) return;

        const formatado = formatarNumeroComDoisDecimais(seloUnidade);

        // Só atualiza se for diferente para evitar loop
        if (seloUnidade !== formatado) {
            setValue(`families[${familyIndex}].identificacaoSeloUnidade`, formatado, { shouldDirty: true });
        }
    }, [seloUnidade, familyIndex, setValue]);


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

export default IdentEspacoHabitadoForm; 