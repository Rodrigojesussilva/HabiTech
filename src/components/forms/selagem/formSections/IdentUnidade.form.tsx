import { useCallback, useEffect, useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/selagem/definitions/identUnidade.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { buscarEnderecoPorCep } from '../api_cep'; // ajuste o path conforme seu projeto
    import { estados as fetchEstados, getCidadesOptions } from '../../../cidades_estados/api_estadosCidades';
    import { subprefeituras, distritosPorSubprefeitura } from '../subprefeiturasDistritos';
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"
import { estados } from '@/components/cidades_estados/estados';
import { cidadesLocais } from '@/components/cidades_estados/cidade'; // cidades.ts gerado

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
    const { control, watch } = form;

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
    const lastCepLookupRef = useRef("");

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
   //cadastro
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

    const lookupCepAddress = useCallback(async (value: string, clearOldAddress: boolean) => {
        const cepLimpo = value.replace(/\D/g, '');
        const cepPath = `families[${familyIndex}].cep`;
        if (cepLimpo.length !== 8) {
            lastCepLookupRef.current = '';
            return;
        }
        if (lastCepLookupRef.current === cepLimpo) return;
        lastCepLookupRef.current = cepLimpo;

        if (clearOldAddress) {
            for (const field of ['logradouro', 'bairro', 'complemento', 'uf', 'cidade', 'subPrefeitura', 'distrito']) {
                form.setValue(`families[${familyIndex}].${field}`, '');
            }
        }

        try {
            const endereco = await buscarEnderecoPorCep(cepLimpo);
            if (form.getValues(cepPath)?.replace(/\D/g, '') !== cepLimpo) return;
            form.clearErrors(cepPath);
            form.setValue(`families[${familyIndex}].logradouro`, endereco.logradouro || '', { shouldDirty: true });
            form.setValue(`families[${familyIndex}].bairro`, endereco.bairro || '', { shouldDirty: true });
            form.setValue(`families[${familyIndex}].complemento`, endereco.complemento || '', { shouldDirty: true });
            form.setValue(`families[${familyIndex}].uf`, endereco.uf || '', { shouldDirty: true });
            form.setValue(`families[${familyIndex}].cidade`, endereco.cidade || '', { shouldDirty: true });
        } catch (error) {
            if (form.getValues(cepPath)?.replace(/\D/g, '') !== cepLimpo) return;
            form.setError(cepPath, {
                type: 'manual',
                message: error instanceof Error ? error.message : 'Não foi possível consultar o CEP.',
            });
        }
    }, [familyIndex, form]);

    // Consulta imediatamente ao completar os 8 dígitos e cobre CEPs carregados ao editar.
    useEffect(() => {
        if (!cep) return;
        const addressIsEmpty = !form.getValues(`families[${familyIndex}].logradouro`)
            && !form.getValues(`families[${familyIndex}].bairro`)
            && !form.getValues(`families[${familyIndex}].uf`)
            && !form.getValues(`families[${familyIndex}].cidade`);
        if (addressIsEmpty) void lookupCepAddress(cep, false);
    }, [cep, familyIndex, form, lookupCepAddress]);
    // Formata o campo Cep

    useEffect(() => {
        if (cep) {
            // Remove todos os caracteres não numéricos
            let cepMasked = cep.replace(/\D/g, "").slice(0, 8); // Limita a 8 dígitos
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`; // Aplica a máscara
            }

            // Atualiza o valor do campo no formulário
            if (cepMasked !== cep) {
                form.setValue(`families[${familyIndex}].cep`, cepMasked, {
                    shouldDirty: true,
                    shouldValidate: false,
                });
            }
        }
    }, [cep, familyIndex, form]);

    // Limpa o campo Cep
    useEffect(() => {
        if (formValues.naoAplica) {
            const cepAtual = form.getValues(`families[${familyIndex}].cep`);

            if (cepAtual && cepAtual !== '') {
                form.setValue(`families[${familyIndex}].cep`, "");
            }
        }
    }, [formValues.naoAplica, form, familyIndex]);

    // Atualiza UF
    useEffect(() => {
        fetchEstados()
            .then(list => {
                const options = list.map(e => ({ label: e.nome, value: e.sigla }));

                // Prioriza SP
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions(options);
            })
            .catch(error => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                // Fallback: usa arquivo local
                const options = estados.map(e => ({ label: e.label, value: e.value }));

                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions(options);
            });
    }, []);

    // Atualiza Cidade
    useEffect(() => {
        if (!ufSelecionada) {
            setCidadeOptions([]);
            return;
        }

        getCidadesOptions(ufSelecionada)
            .then(cidades => {
                if (ufSelecionada === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptions(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionada}, usando dados locais:`, error);

                if (ufSelecionada in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionada as keyof typeof cidadesLocais];
                    setCidadeOptions(cidadesLocaisDaUf);
                } else {
                    setCidadeOptions([]);
                }
            });
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
                            onFieldValueChange={(fieldName, value) => {
                                if (fieldName === "cep") void lookupCepAddress(value, true);
                            }}
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
