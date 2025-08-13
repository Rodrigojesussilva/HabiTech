import { useEffect, useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/selagem/definitions/identUnidade.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { buscarEnderecoPorCep } from '../api_cep'; // ajuste o path conforme seu projeto
import { estados as fetchEstados, getCidadesOptions } from '../api_estadosCidades';
import { subprefeituras, distritosPorSubprefeitura } from '../subprefeiturasDistritos';
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"

interface InfoContatoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const InfoContatoForm = ({ sectionIndex: sectionNumber, familyIndex }: InfoContatoFormProps) => {
    const [mostrarContato, setMostrarContato] = useState(false);
    const [estadoOptions, setEstadoOptions] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptions, setCidadeOptions] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptions, setSubPrefeituraOptions] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsState, setDistritoOptionsState] = useState<{ label: string; value: string }[]>([]);
    const [initialDate] = useState("")
    const [endDate] = useState("")

    const form = useFormContext();
    const { control, setValue, watch } = form;

    const formValues = form.watch(`families[${familyIndex}]`) || {};
    let formSections = getMergedFormSections(formValues);

    const cep = useWatch({
        control,
        name: `families[${familyIndex}].cep`,
    });

    const ufSelecionada = form.watch(`families[${familyIndex}].uf`);
    const selectedSubPrefeitura = watch(`families[${familyIndex}].subPrefeitura`);
    const bairro = watch(`families[${familyIndex}].bairro`);
    const cidade = watch(`families[${familyIndex}].cidade`);
    const complemento = watch(`families[${familyIndex}].complemento`);
    const distrito = watch(`families[${familyIndex}].distrito`);
    const logradouro = watch(`families[${familyIndex}].logradouro`);
    const numero = watch(`families[${familyIndex}].numero`);
    const subprefeitura = watch(`families[${familyIndex}].subPrefeitura`);
    const uf = watch(`families[${familyIndex}].uf`);

    const triggeredByBlurRef = useRef(false);

    const prevValuesRef = useRef<Record<string, any>>({
        bairro,
        cep,
        cidade,
        complemento,
        distrito,
        logradouro,
        numero,
        subprefeitura,
        uf,
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

            // 💡 Limpa o valor de distrito no formulário se subprefeitura estiver vazio
            if (subprefeitura === "") {
                form.setValue(`families[${familyIndex}].distrito`, "");
            }

            // ⚠️ Pega o valor atualizado de distrito do form após limpar, garantindo consistência
            const currentDistrito = form.getValues(`families[${familyIndex}].distrito`);

            const payload = {
                created_by: criadoPor,
                identificacao_unidade: {
                    bairro,
                    cep,
                    cidade,
                    complemento,
                    distrito: currentDistrito, // ✅ valor atualizado
                    logradouro,
                    numero: String(numero ?? "").trim(),
                    subprefeitura,
                    uf,
                },
            };

            try {
                console.log("Payload Selagem:", JSON.stringify(payload, null, 2));
                await survey_resource.SendFormToSelagemIdentificacaoUnidade(SURVEY_RESOURCE_BASE_URL, selagemId, payload);
            } catch (error) {
                console.error("Erro ao enviar identificação da unidade:", error);
                showErrorMessage("Erro ao enviar os dados de identificação da unidade");
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
                "identificacao_unidade.bairro": bairro,
                "identificacao_unidade.cep": cep,
                "identificacao_unidade.cidade": cidade,
                "identificacao_unidade.complemento": complemento,
                "identificacao_unidade.distrito": distrito,
                "identificacao_unidade.logradouro": logradouro,
                "identificacao_unidade.numero": numero,
                "identificacao_unidade.subprefeitura": subprefeitura,
                "identificacao_unidade.uf": uf,
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
        bairro,
        cep,
        cidade,
        complemento,
        distrito,
        logradouro,
        numero,
        subprefeitura,
        uf,
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
    // Atualiza distritos ao mudar subPrefeitura
    useEffect(() => {
        if (!selectedSubPrefeitura) {
            setDistritoOptionsState([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeitura] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));

        setDistritoOptionsState(options);
    }, [selectedSubPrefeitura]);
    //carrega api de Cep
    useEffect(() => {
        const cepLimpo = (cep || '').replace(/\D/g, '');

        // 🔁 Função auxiliar deve vir ANTES de ser usada
        const limparCamposEndereco = () => {
            setValue(`families[${familyIndex}].logradouro`, '');
            setValue(`families[${familyIndex}].bairro`, '');
            setValue(`families[${familyIndex}].complemento`, '');
            setValue(`families[${familyIndex}].uf`, '');
            setValue(`families[${familyIndex}].cidade`, '');
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    console.log('Endereço retornado:', endereco);  // <-- aqui
                    setValue(`families[${familyIndex}].logradouro`, endereco.logradouro || '');
                    setValue(`families[${familyIndex}].bairro`, endereco.bairro || '');                    
                    setValue(`families[${familyIndex}].uf`, endereco.uf || '');
                    setValue(`families[${familyIndex}].cidade`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                    limparCamposEndereco();
                }
            };

            buscarEndereco();
        } else {
            limparCamposEndereco();
        }
    }, [cep, familyIndex, setValue]);
    // Torna o SP padrão na UF
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].uf`, "SP");
        }
    }, []);
    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidade`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidade`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].uf`)]);
    // Formata o campo Cep
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cep`);

        if (cep) {
            // Remove todos os caracteres não numéricos
            let cepMasked = cep.replace(/\D/g, "").slice(0, 8); // Limita a 8 dígitos
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`; // Aplica a máscara
            }

            // Atualiza o valor do campo no formulário
            form.setValue(`families[${familyIndex}].cep`, cepMasked);
        }
    }, [form.watch(`families[${familyIndex}].cep`)]);
    // Limpa o campo Cep
    useEffect(() => {
        if (formValues.naoAplica) {
            // Verifica se os valores já não estão vazios antes de setar
            const nomeResponsavel = form.getValues(`families[${familyIndex}].cep`);


            if (nomeResponsavel) {
                form.setValue(`families[${familyIndex}].cep`, "");

            }
        }
    }, [formValues.naoAplica, form, familyIndex]);
    // Atualiza UF
    useEffect(() => {
        fetchEstados()
            .then(list => {
                const options = list.map(e => ({ label: e.nome, value: e.sigla }));

                // Encontra São Paulo e remove da lista
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1); // remove SP
                    options.unshift(sp); // adiciona SP no começo
                }

                setEstadoOptions(options);
            })
            .catch(console.error);
    }, []);
    // Atualiza cidades ao mudar UF
    useEffect(() => {
        if (!ufSelecionada) {
            setCidadeOptions([]);
            return;
        }
        getCidadesOptions(ufSelecionada)
            .then(cidades => {
                if (ufSelecionada === 'SP') {
                    // Encontra São Paulo e coloca primeiro
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptions(cidades);
            })
            .catch(console.error);
    }, [ufSelecionada]);
    // Mescla seções e preenche opções dinâmicas
    formSections = getMergedFormSections(formValues).map(section => ({
        ...section,
        fields: section.fields.map(field => {
            // Preenche campos de estado (UF) com lista de estados
            if (field.name === 'uf') {
                return {
                    ...field,
                    options: estadoOptions
                };
            }
            if (field.name === 'cidade') {
                return { ...field, options: cidadeOptions };
            }
            if (field.name === "subPrefeitura") {
                return {
                    ...field,
                    options: subPrefeituraOptions,
                };
            }
            if (field.name === "distrito") {
                return {
                    ...field,
                    options: distritoOptionsState,
                };
            }
            return field;
        })
    }));

    return (
        <div className="text-left">
            <Collapsible open={mostrarContato} onOpenChange={setMostrarContato}>
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
                            formControl={control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 2}.${fieldIndex + 1}`}
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

export default InfoContatoForm;
