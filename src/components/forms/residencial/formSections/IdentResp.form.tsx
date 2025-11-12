import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/IdentResp.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { buscarEnderecoPorCep } from '../api_cep';
import { calcularIdade } from "@/components/forms/residencial/helpers/identResp.helper";
import { mask, unMask } from 'remask';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { subprefeituras, distritosPorSubprefeitura } from '../subprefeiturasDistritos';
import { estados } from '@/components/cidades_estados/estados';
import { cidadesLocais } from '@/components/cidades_estados/cidade';

interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const IdentRespForm = ({ sectionIndex: sectionNumber, familyIndex }: IdentRespFormProps) => {

    const [mostrarSituacaoUso, setMostrarSituacaoUso] = useState(false);
    const [estadoOptions, setEstadoOptions] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptions, setCidadeOptions] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptions, setSubPrefeituraOptions] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsState, setDistritoOptionsState] = useState<{ label: string; value: string }[]>([]);


    const [estadoOptions_t, setEstadoOptions_t] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptions_t, setCidadeOptions_t] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptions_t, setSubPrefeituraOptions_t] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsState_t, setDistritoOptionsState_t] = useState<{ label: string; value: string }[]>([]);


    const form = useFormContext();

    // Observação dos campos
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const dataNascimento = form.watch(`families[${familyIndex}].dataNascimentoRespR`);

    const ufSelecionada = form.watch(`families[${familyIndex}].uf_r`);
    const selectedSubPrefeitura = form.watch(`families[${familyIndex}].subPrefeitura_r`);
    const ufSelecionada_t = form.watch(`families[${familyIndex}].uf_t`);
    const selectedSubPrefeitura_t = form.watch(`families[${familyIndex}].subPrefeitura_t`);

    //valida data de nascimento
    useEffect(() => {
        console.log('📅 Data R', dataNascimento);

        const pathNascimento = `families[${familyIndex}].dataNascimentoRespR`;
        const pathIdade = `families[${familyIndex}].idadeRespR`;


        console.log('📅 Data R', dataNascimento);

        const validarELimpar = () => {
            if (!dataNascimento || dataNascimento === "") {
                form.setValue(pathNascimento, "");
                form.setValue(pathIdade, "");
                return;
            }

            const data = new Date(dataNascimento);
            const hoje = new Date();

            if (isNaN(data.getTime())) {
                form.setValue(pathNascimento, "");
                form.setValue(pathIdade, "");
                alert("Data inválida.");
                return;
            }

            if (data > hoje) {
                form.setValue(pathNascimento, "");
                form.setValue(pathIdade, "");
                alert("Data de nascimento não pode ser futura.");
                return;
            }
        };

        // Executa no próximo frame para evitar conflitos com o React
        requestAnimationFrame(validarELimpar);
    }, [
        dataNascimento,
        familyIndex,
        form.setValue
    ]);

    // Carrega subprefeituras (pode ser fetch ou lista estática)
    useEffect(() => {
        const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
        setSubPrefeituraOptions(options);
    }, []);

    // Carrega subprefeituras (pode ser fetch ou lista estática) para trabalho
    useEffect(() => {
        const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
        setSubPrefeituraOptions_t(options);
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

    // Atualiza distritos ao mudar subPrefeitura para trabalho
    useEffect(() => {
        if (!selectedSubPrefeitura_t) {
            setDistritoOptionsState_t([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeitura] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));

        setDistritoOptionsState_t(options);
    }, [selectedSubPrefeitura_t]);

    // Torna o SP padrão na UF
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf_r`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].uf_r`, "SP");
        }
    }, []);

    // Torna o SP padrão na UF para trabalho
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf_t`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].uf_t`, "SP");
        }
    }, []);

    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf_r`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidade_r`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidade_r`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].uf_r`)]);

    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia para trabalho
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf_t`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidade_t`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidade_t`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].uf_t`)]);

    // Atualiza UF
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch('sua-url-da-api-aqui');
                if (!response.ok) throw new Error('Erro na API');
                return await response.json();
            } catch (error) {
                throw error;
            }
        };

        fetchEstados()
            .then((list: any[]) => {
                const options = list.map((e: any) => ({ label: e.nome, value: e.sigla }));

                // Prioriza SP
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                // Fallback: usa arquivo local
                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions(options);
            });
    }, []);

    // Atualiza UF para trabalho
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch('sua-url-da-api-aqui');
                if (!response.ok) throw new Error('Erro na API');
                return await response.json();
            } catch (error) {
                throw error;
            }
        };

        fetchEstados()
            .then((list: any[]) => {
                const options = list.map((e: any) => ({ label: e.nome, value: e.sigla }));

                // Prioriza SP
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions_t(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                // Fallback: usa arquivo local
                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions_t(options);
            });
    }, []);

    // Atualiza Cidade
    useEffect(() => {
        if (!ufSelecionada) {
            setCidadeOptions([]);
            return;
        }

        // Adicione esta função dentro do useEffect
        const getCidadesOptions = async (uf: string): Promise<any[]> => {
            try {
                const response = await fetch(`sua-url-cidades/${uf}`);
                if (!response.ok) throw new Error('Erro na API');
                const data = await response.json();
                return data.map((cidade: any) => ({ label: cidade.nome, value: cidade.id }));
            } catch (error) {
                throw error;
            }
        };

        getCidadesOptions(ufSelecionada)
            .then((cidades: any[]) => {
                if (ufSelecionada === 'SP') {
                    const spIndex = cidades.findIndex((c: any) => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptions(cidades);
            })
            .catch((error: any) => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionada}, usando dados locais:`, error);

                if (ufSelecionada in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionada as keyof typeof cidadesLocais];
                    setCidadeOptions(cidadesLocaisDaUf);
                } else {
                    setCidadeOptions([]);
                }
            });
    }, [ufSelecionada]);


    // Carrega subprefeituras (pode ser fetch ou lista estática) para trabalho
    useEffect(() => {
        const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
        setSubPrefeituraOptions_t(options);
    }, []);

    // Atualiza distritos ao mudar subPrefeitura (trabalho)
    useEffect(() => {
        if (!selectedSubPrefeitura_t) {
            setDistritoOptionsState_t([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeitura_t] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));

        setDistritoOptionsState_t(options);
    }, [selectedSubPrefeitura_t]);

    // Torna o SP padrão na UF (trabalho)
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf_t`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].uf_t`, "SP");
        }
    }, []);

    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia (trabalho)
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf_t`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidade_t`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidade_t`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].uf_t`)]);

    // Atualiza UF (trabalho)
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch('sua-url-da-api-aqui');
                if (!response.ok) throw new Error('Erro na API');
                return await response.json();
            } catch (error) {
                throw error;
            }
        };

        fetchEstados()
            .then((list: any[]) => {
                const options = list.map((e: any) => ({ label: e.nome, value: e.sigla }));

                // Prioriza SP
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions_t(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                // Fallback: usa arquivo local
                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptions_t(options);
            });
    }, []);

    // Atualiza Cidade (trabalho)
    useEffect(() => {
        if (!ufSelecionada_t) {
            setCidadeOptions_t([]);
            return;
        }

        const getCidadesOptions = async (uf: string): Promise<any[]> => {
            try {
                const response = await fetch(`sua-url-cidades/${uf}`);
                if (!response.ok) throw new Error('Erro na API');
                const data = await response.json();
                return data.map((cidade: any) => ({ label: cidade.nome, value: cidade.id }));
            } catch (error) {
                throw error;
            }
        };

        getCidadesOptions(ufSelecionada_t)
            .then((cidades: any[]) => {
                if (ufSelecionada_t === 'SP') {
                    const spIndex = cidades.findIndex((c: any) => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptions_t(cidades);
            })
            .catch((error: any) => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionada_t}, usando dados locais:`, error);

                if (ufSelecionada_t in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionada_t as keyof typeof cidadesLocais];
                    setCidadeOptions_t(cidadesLocaisDaUf);
                } else {
                    setCidadeOptions_t([]);
                }
            });
    }, [ufSelecionada_t]);

    // ----------- CEP PARA _r -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cep_r`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cep_r`);

                    // Preenche os campos diretamente
                    form.setValue(`families[${familyIndex}].logradouro_r`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairro_r`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complemento_r`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].uf_r`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidade_r`, endereco.cidade || '');

                } catch (error) {
                    console.error('Erro ao buscar CEP (r):', error);
                    // Limpa os campos apenas em caso de erro
                    form.setValue(`families[${familyIndex}].logradouro_r`, '');
                    form.setValue(`families[${familyIndex}].bairro_r`, '');
                    form.setValue(`families[${familyIndex}].complemento_r`, '');
                    form.setValue(`families[${familyIndex}].uf_r`, '');
                    form.setValue(`families[${familyIndex}].cidade_r`, '');

                    form.setError(`families[${familyIndex}].cep_r`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cep_r`)]);

    // ----------- CEP PARA _t -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cep_t`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cep_t`);

                    // Preenche os campos diretamente
                    form.setValue(`families[${familyIndex}].logradouro_t`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairro_t`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complemento_t`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].uf_t`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidade_t`, endereco.cidade || '');

                } catch (error) {
                    console.error('Erro ao buscar CEP (t):', error);
                    // Limpa os campos apenas em caso de erro
                    form.setValue(`families[${familyIndex}].logradouro_t`, '');
                    form.setValue(`families[${familyIndex}].bairro_t`, '');
                    form.setValue(`families[${familyIndex}].complemento_t`, '');
                    form.setValue(`families[${familyIndex}].uf_t`, '');
                    form.setValue(`families[${familyIndex}].cidade_t`, '');

                    form.setError(`families[${familyIndex}].cep_t`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cep_t`)]);



    // ----------- Máscara CEP para _r -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cep_r`);
        if (cep) {
            let cepMasked = cep.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cep_r`, cepMasked);
        }
    }, [form.watch(`families[${familyIndex}].cep_r`)]);

    // ----------- Máscara CEP para _t -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cep_t`);
        if (cep) {
            let cepMasked = cep.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cep_t`, cepMasked);
        }
    }, [form.watch(`families[${familyIndex}].cep_t`)]);

    // ----------- Limpa campo CEP se nao aplica (r) -----------
    useEffect(() => {
        if (formValues.naoAplicaCep_r) {
            const cepAtual = form.getValues(`families[${familyIndex}].cep_r`);
            if (cepAtual && cepAtual !== '') {
                form.setValue(`families[${familyIndex}].cep_r`, "");
            }
        }
    }, [formValues.naoAplicaCep_r]);

    // ----------- Limpa campo CEP se nao aplica (t) -----------
    useEffect(() => {
        if (formValues.naoAplicaCep_t) {
            const cepAtual = form.getValues(`families[${familyIndex}].cep_t`);
            if (cepAtual && cepAtual !== '') {
                form.setValue(`families[${familyIndex}].cep_t`, "");
            }
        }
    }, [formValues.naoAplicaCep_t]);

    useEffect(() => {
        // Só roda se dataNascimento estiver definida e no formato correto YYYY-MM-DD
        if (typeof dataNascimento === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
            const idade = calcularIdade(dataNascimento);
            form.setValue(`families[${familyIndex}].idadeRespR`, idade, { shouldValidate: true });
        } else {
            form.setValue(`families[${familyIndex}].idadeRespR`, "", { shouldValidate: false });
        }
    }, [dataNascimento, familyIndex, form.setValue]);

    // ----------- Validacao CPF -----------
    useEffect(() => {
        const pathCpf = `families[${familyIndex}].numero_cpf`;
        const cpfRaw = form.getValues(pathCpf);

        form.clearErrors(pathCpf);

        if (cpfRaw) {
            const onlyNumbers = unMask(cpfRaw);
            const maskedCpf = mask(onlyNumbers, ['999.999.999-99']);
            form.setValue(pathCpf, maskedCpf, { shouldValidate: false });

            if (!cpfValidator.isValid(onlyNumbers)) {
                form.setError(pathCpf, {
                    type: 'manual',
                    message: 'CPF inválido.',
                });
            }
        }
    }, [form.watch(`families[${familyIndex}].numero_cpf`)]);
    // Atualiza seções com opções nos campos dinâmicos

    const formSections = getMergedFormSections(formValues).map(section => ({
        ...section,
        fields: section.fields.map(field => {
            // Preenche campos de estado (UF) com lista de estados - RESIDÊNCIA
            if (field.name === 'uf_r') {
                return {
                    ...field,
                    options: estadoOptions
                };
            }
            if (field.name === 'cidade_r') {
                return { ...field, options: cidadeOptions };
            }
            if (field.name === "subPrefeitura_r") {
                return {
                    ...field,
                    options: subPrefeituraOptions,
                };
            }
            if (field.name === "distrito_r") {
                return {
                    ...field,
                    options: distritoOptionsState,
                };
            }

            // Preenche campos de estado (UF) com lista de estados - TRABALHO
            if (field.name === 'uf_t') {
                return {
                    ...field,
                    options: estadoOptions_t
                };
            }
            if (field.name === 'cidade_t') {
                return { ...field, options: cidadeOptions_t };
            }
            if (field.name === "subPrefeitura_t") {
                return {
                    ...field,
                    options: subPrefeituraOptions_t,
                };
            }
            if (field.name === "distrito_t") {
                return {
                    ...field,
                    options: distritoOptionsState_t,
                };
            }
            return field;
        })
    }));


    return (
        <div className="text-left">
            <Collapsible open={mostrarSituacaoUso} onOpenChange={setMostrarSituacaoUso}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber !== undefined ? sectionNumber + 1 : 3} - Identificação da pessoa responsável`}
                        </h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formSections.map((section, idx) => (
                        <FormSectionRenderer
                            key={section.id || idx}
                            section={section}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) =>
                                `${sectionNumber !== undefined ? sectionNumber + 1 : 3}.${fieldIndex + 1}`
                            }
                            sectionIndex={idx}
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

export default IdentRespForm;
