import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/integrantesFamilia.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { buscarEnderecoPorCep } from '../api_cep';
import { mask, unMask } from 'remask';
import { estados as fetchEstados, getCidadesOptions } from '../../../cidades_estados/api_estadosCidades';
import { subprefeituras, distritosPorSubprefeitura } from '../subprefeiturasDistritos';
import { estados } from '@/components/cidades_estados/estados';
import { cidadesLocais } from '@/components/cidades_estados/cidade'; // cidades.ts gerado

interface IntegrantesFamiliaFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

interface Integrante {
    numero: number;
    nome: string;
    relacao: string;
    campos: any[];
}

const IntegrantesFamiliaForm = ({ sectionIndex: sectionNumber, familyIndex }: IntegrantesFamiliaFormProps) => {

    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const [estadoOptionsI1, setEstadoOptionsI1] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptionsI1, setCidadeOptionsI1] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptionsI1, setSubPrefeituraOptionsI1] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsStateI1, setDistritoOptionsStateI1] = useState<{ label: string; value: string }[]>([]);

    const [estadoOptionsI2, setEstadoOptionsI2] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptionsI2, setCidadeOptionsI2] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptionsI2, setSubPrefeituraOptionsI2] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsStateI2, setDistritoOptionsStateI2] = useState<{ label: string; value: string }[]>([]);

    const [estadoOptionsI3, setEstadoOptionsI3] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptionsI3, setCidadeOptionsI3] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptionsI3, setSubPrefeituraOptionsI3] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsStateI3, setDistritoOptionsStateI3] = useState<{ label: string; value: string }[]>([]);


    // 🗺️ Estados (options) para os campos de Trabalho
    const [estadoOptionsTrabalho1, setEstadoOptionsTrabalho1] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptionsTrabalho1, setCidadeOptionsTrabalho1] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptionsTrabalho1, setSubPrefeituraOptionsTrabalho1] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsStateTrabalho1, setDistritoOptionsStateTrabalho1] = useState<{ label: string; value: string }[]>([]);

    const [estadoOptionsTrabalho2, setEstadoOptionsTrabalho2] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptionsTrabalho2, setCidadeOptionsTrabalho2] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptionsTrabalho2, setSubPrefeituraOptionsTrabalho2] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsStateTrabalho2, setDistritoOptionsStateTrabalho2] = useState<{ label: string; value: string }[]>([]);

    const [estadoOptionsTrabalho3, setEstadoOptionsTrabalho3] = useState<{ label: string; value: string }[]>([]);
    const [cidadeOptionsTrabalho3, setCidadeOptionsTrabalho3] = useState<{ label: string; value: string }[]>([]);
    const [subPrefeituraOptionsTrabalho3, setSubPrefeituraOptionsTrabalho3] = useState<{ label: string; value: string }[]>([]);
    const [distritoOptionsStateTrabalho3, setDistritoOptionsStateTrabalho3] = useState<{ label: string; value: string }[]>([]);





    // Estado para controlar qual integrante está expandido
    const [integrantesExpandidos, setIntegrantesExpandidos] = useState<number[]>([]);
    const form = useFormContext();
    // 🔁 Reage a mudanças em todos os campos da getCamposPorIntegrante
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues).map(section => ({
        ...section,
        fields: section.fields.map(field => {
            // Preenche campos com lista de estados - I1
            if (field.name === 'ufI1') {
                return {
                    ...field,
                    options: estadoOptionsI1
                };
            }
            if (field.name === 'cidadeI1') {
                return { ...field, options: cidadeOptionsI1 };
            }
            if (field.name === "subPrefeituraI1") {
                return {
                    ...field,
                    options: subPrefeituraOptionsI1,
                };
            }
            if (field.name === "distritoI1") {
                return {
                    ...field,
                    options: distritoOptionsStateI1,
                };
            }

            // Preenche campos com lista de estados - I2
            if (field.name === 'ufI2') {
                return {
                    ...field,
                    options: estadoOptionsI2
                };
            }
            if (field.name === 'cidadeI2') {
                return { ...field, options: cidadeOptionsI2 };
            }
            if (field.name === "subPrefeituraI2") {
                return {
                    ...field,
                    options: subPrefeituraOptionsI2,
                };
            }
            if (field.name === "distritoI2") {
                return {
                    ...field,
                    options: distritoOptionsStateI2,
                };
            }

            // Preenche campos com lista de estados - I3
            if (field.name === 'ufI3') {
                return {
                    ...field,
                    options: estadoOptionsI3
                };
            }
            if (field.name === 'cidadeI3') {
                return { ...field, options: cidadeOptionsI3 };
            }
            if (field.name === "subPrefeituraI3") {
                return {
                    ...field,
                    options: subPrefeituraOptionsI3,
                };
            }
            if (field.name === "distritoI3") {
                return {
                    ...field,
                    options: distritoOptionsStateI3,
                };
            }

            // Preenche campos com lista de estados - Trabalho1
            if (field.name === 'ufTrabalho1') return { ...field, options: estadoOptionsTrabalho1 };
            if (field.name === 'cidadeTrabalho1') return { ...field, options: cidadeOptionsTrabalho1 };
            if (field.name === 'subPrefeituraTrabalho1') return { ...field, options: subPrefeituraOptionsTrabalho1 };
            if (field.name === 'distritoTrabalho1') return { ...field, options: distritoOptionsStateTrabalho1 };

            // Preenche campos com lista de estados - Trabalho2
            if (field.name === 'ufTrabalho2') return { ...field, options: estadoOptionsTrabalho2 };
            if (field.name === 'cidadeTrabalho2') return { ...field, options: cidadeOptionsTrabalho2 };
            if (field.name === 'subPrefeituraTrabalho2') return { ...field, options: subPrefeituraOptionsTrabalho2 };
            if (field.name === 'distritoTrabalho2') return { ...field, options: distritoOptionsStateTrabalho2 };

            // Preenche campos com lista de estados - Trabalho2
            if (field.name === 'ufTrabalho3') return { ...field, options: estadoOptionsTrabalho3 };
            if (field.name === 'cidadeTrabalho3') return { ...field, options: cidadeOptionsTrabalho3 };
            if (field.name === 'subPrefeituraTrabalho3') return { ...field, options: subPrefeituraOptionsTrabalho3 };
            if (field.name === 'distritoTrabalho3') return { ...field, options: distritoOptionsStateTrabalho3 };



            return field;
        })
    }));
    const section = formSections[0];

    const dataNascimentoIntegrante1 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante1`);
    const dataNascimentoIntegrante2 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante2`);
    const dataNascimentoIntegrante3 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante3`);

    // Adicione estes watches no início do componente:
    const cepI1 = form.watch(`families[${familyIndex}].cepI1`);
    const cepI2 = form.watch(`families[${familyIndex}].cepI2`);
    const cepI3 = form.watch(`families[${familyIndex}].cepI3`);

    const cepTrabalho1 = form.watch(`families[${familyIndex}].cepTrabalho1`);
    const cepTrabalho2 = form.watch(`families[${familyIndex}].cepTrabalho2`);
    const cepTrabalho3 = form.watch(`families[${familyIndex}].cepTrabalho3`);

    const ufSelecionadaI1 = form.watch(`families[${familyIndex}].ufI1`);
    const selectedSubPrefeituraI1 = form.watch(`families[${familyIndex}].subPrefeituraI1`);

    const ufSelecionadaI2 = form.watch(`families[${familyIndex}].ufI2`);
    const selectedSubPrefeituraI2 = form.watch(`families[${familyIndex}].subPrefeituraI2`);

    const ufSelecionadaI3 = form.watch(`families[${familyIndex}].ufI3`);
    const selectedSubPrefeituraI3 = form.watch(`families[${familyIndex}].subPrefeituraI3`);


    // 🏢 Campos observados no formulário (Trabalho)
    const ufSelecionadaTrabalho1 = form.watch(`families[${familyIndex}].ufTrabalho1`);
    const selectedSubPrefeituraTrabalho1 = form.watch(`families[${familyIndex}].subPrefeituraTrabalho1`);

    const ufSelecionadaTrabalho2 = form.watch(`families[${familyIndex}].ufTrabalho2`);
    const selectedSubPrefeituraTrabalho2 = form.watch(`families[${familyIndex}].subPrefeituraTrabalho2`);

    const ufSelecionadaTrabalho3 = form.watch(`families[${familyIndex}].ufTrabalho3`);
    const selectedSubPrefeituraTrabalho3 = form.watch(`families[${familyIndex}].subPrefeituraTrabalho3`);


    //INTEGRANTE 1

    // Carrega subprefeituras para I1 - mas só se a UF for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI1`);
        if (currentUf === "SP") {
            const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
            setSubPrefeituraOptionsI1(options);
        } else {
            setSubPrefeituraOptionsI1([]);
        }
    }, [form.getValues(`families[${familyIndex}].ufI1`)]);

    // Atualiza distritos ao mudar subPrefeitura I1 SOMENTE se for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI1`);

        if (currentUf !== "SP" || !selectedSubPrefeituraI1) {
            setDistritoOptionsStateI1([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraI1] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateI1(options);
    }, [selectedSubPrefeituraI1, form.getValues(`families[${familyIndex}].ufI1`)]);

    // Atualiza distritos ao mudar subPrefeitura I1 SOMENTE se for São Paulo/SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI1`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeI1`);

        // Só mostra distritos se for SP, São Paulo e tem subprefeitura selecionada
        if (currentUf !== "SP" || currentCidade !== "São Paulo" || !selectedSubPrefeituraI1) {
            setDistritoOptionsStateI1([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraI1] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateI1(options);
    }, [selectedSubPrefeituraI1, form.getValues(`families[${familyIndex}].ufI1`), form.getValues(`families[${familyIndex}].cidadeI1`)]);

    // Torna o SP padrão na UF I1
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI1`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].ufI1`, "SP");
        }
    }, []);

    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia I1
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI1`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeI1`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidadeI1`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].ufI1`)]);

    // Atualiza UF I1
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

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsI1(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsI1(options);
            });
    }, []);

    // Atualiza Cidade I1
    useEffect(() => {
        if (!ufSelecionadaI1) {
            setCidadeOptionsI1([]);
            return;
        }

        getCidadesOptions(ufSelecionadaI1)
            .then(cidades => {
                if (ufSelecionadaI1 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptionsI1(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionadaI1}, usando dados locais:`, error);

                if (ufSelecionadaI1 in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionadaI1 as keyof typeof cidadesLocais];
                    setCidadeOptionsI1(cidadesLocaisDaUf);
                } else {
                    setCidadeOptionsI1([]);
                }
            });
    }, [ufSelecionadaI1]);


    //INTEGRANTE 2

    // Carrega subprefeituras para I2 - mas só se a UF for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI2`);
        if (currentUf === "SP") {
            const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
            setSubPrefeituraOptionsI2(options);
        } else {
            setSubPrefeituraOptionsI2([]);
        }
    }, [form.getValues(`families[${familyIndex}].ufI2`)]);

    // Atualiza distritos ao mudar subPrefeitura I2 SOMENTE se for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI2`);

        if (currentUf !== "SP" || !selectedSubPrefeituraI2) {
            setDistritoOptionsStateI2([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraI2] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateI2(options);
    }, [selectedSubPrefeituraI2, form.getValues(`families[${familyIndex}].ufI2`)]);

    // Atualiza distritos ao mudar subPrefeitura I2 SOMENTE se for São Paulo/SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI2`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeI2`);

        // Só mostra distritos se for SP, São Paulo e tem subprefeitura selecionada
        if (currentUf !== "SP" || currentCidade !== "São Paulo" || !selectedSubPrefeituraI2) {
            setDistritoOptionsStateI2([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraI2] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateI2(options);
    }, [
        selectedSubPrefeituraI2,
        form.getValues(`families[${familyIndex}].ufI2`),
        form.getValues(`families[${familyIndex}].cidadeI2`)
    ]);

    // Torna o SP padrão na UF I2
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI2`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].ufI2`, "SP");
        }
    }, []);

    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia I2
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI2`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeI2`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidadeI2`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].ufI2`)]);

    // Atualiza UF I2
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

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsI2(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsI2(options);
            });
    }, []);

    // Atualiza Cidade I2
    useEffect(() => {
        if (!ufSelecionadaI2) {
            setCidadeOptionsI2([]);
            return;
        }

        getCidadesOptions(ufSelecionadaI2)
            .then(cidades => {
                if (ufSelecionadaI2 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptionsI2(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionadaI2}, usando dados locais:`, error);

                if (ufSelecionadaI2 in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionadaI2 as keyof typeof cidadesLocais];
                    setCidadeOptionsI2(cidadesLocaisDaUf);
                } else {
                    setCidadeOptionsI2([]);
                }
            });
    }, [ufSelecionadaI2]);

    //INTEGRANTE I3

    // Carrega subprefeituras para I3 - mas só se a UF for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI3`);
        if (currentUf === "SP") {
            const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
            setSubPrefeituraOptionsI3(options);
        } else {
            setSubPrefeituraOptionsI3([]);
        }
    }, [form.getValues(`families[${familyIndex}].ufI3`)]);

    // Atualiza distritos ao mudar subPrefeitura I3 SOMENTE se for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI3`);

        if (currentUf !== "SP" || !selectedSubPrefeituraI3) {
            setDistritoOptionsStateI3([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraI3] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateI3(options);
    }, [selectedSubPrefeituraI3, form.getValues(`families[${familyIndex}].ufI3`)]);

    // Atualiza distritos ao mudar subPrefeitura I3 SOMENTE se for São Paulo/SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI3`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeI3`);

        // Só mostra distritos se for SP, São Paulo e tem subprefeitura selecionada
        if (currentUf !== "SP" || currentCidade !== "São Paulo" || !selectedSubPrefeituraI3) {
            setDistritoOptionsStateI3([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraI3] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateI3(options);
    }, [
        selectedSubPrefeituraI3,
        form.getValues(`families[${familyIndex}].ufI3`),
        form.getValues(`families[${familyIndex}].cidadeI3`)
    ]);

    // Torna o SP padrão na UF I3
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI3`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].ufI3`, "SP");
        }
    }, []);

    // Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia I3
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufI3`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeI3`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidadeI3`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].ufI3`)]);

    // Atualiza UF I3
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

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsI3(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsI3(options);
            });
    }, []);

    // Atualiza Cidade I3
    useEffect(() => {
        if (!ufSelecionadaI3) {
            setCidadeOptionsI3([]);
            return;
        }

        getCidadesOptions(ufSelecionadaI3)
            .then(cidades => {
                if (ufSelecionadaI3 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptionsI3(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionadaI3}, usando dados locais:`, error);

                if (ufSelecionadaI3 in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionadaI3 as keyof typeof cidadesLocais];
                    setCidadeOptionsI3(cidadesLocaisDaUf);
                } else {
                    setCidadeOptionsI3([]);
                }
            });
    }, [ufSelecionadaI3]);

    //TRABALH0 1

    // 1️⃣ Carrega subprefeituras para Trabalho1 - mas só se a UF for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho1`);
        if (currentUf === "SP") {
            const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
            setSubPrefeituraOptionsTrabalho1(options);
        } else {
            setSubPrefeituraOptionsTrabalho1([]);
        }
    }, [form.getValues(`families[${familyIndex}].ufTrabalho1`)]);

    // 2️⃣ Atualiza distritos ao mudar subPrefeitura Trabalho1 SOMENTE se for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho1`);

        if (currentUf !== "SP" || !selectedSubPrefeituraTrabalho1) {
            setDistritoOptionsStateTrabalho1([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraTrabalho1] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateTrabalho1(options);
    }, [selectedSubPrefeituraTrabalho1, form.getValues(`families[${familyIndex}].ufTrabalho1`)]);

    // 3️⃣ Atualiza distritos ao mudar subPrefeitura Trabalho1 SOMENTE se for São Paulo/SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho1`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeTrabalho1`);

        if (currentUf !== "SP" || currentCidade !== "São Paulo" || !selectedSubPrefeituraTrabalho1) {
            setDistritoOptionsStateTrabalho1([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraTrabalho1] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsStateTrabalho1(options);
    }, [selectedSubPrefeituraTrabalho1, form.getValues(`families[${familyIndex}].ufTrabalho1`), form.getValues(`families[${familyIndex}].cidadeTrabalho1`)]);

    // 4️⃣ Torna o SP padrão na UF Trabalho1
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho1`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].ufTrabalho1`, "SP");
        }
    }, []);

    // 5️⃣ Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia Trabalho1
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho1`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeTrabalho1`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidadeTrabalho1`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].ufTrabalho1`)]);

    // 6️⃣ Atualiza UF Trabalho1
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

                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsTrabalho1(options);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);

                const options = estados.map((e: any) => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex((e: any) => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }

                setEstadoOptionsTrabalho1(options);
            });
    }, []);

    // 7️⃣ Atualiza Cidade Trabalho1
    useEffect(() => {
        if (!ufSelecionadaTrabalho1) {
            setCidadeOptionsTrabalho1([]);
            return;
        }

        getCidadesOptions(ufSelecionadaTrabalho1)
            .then(cidades => {
                if (ufSelecionadaTrabalho1 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }

                setCidadeOptionsTrabalho1(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionadaTrabalho1}, usando dados locais:`, error);

                if (ufSelecionadaTrabalho1 in cidadesLocais) {
                    const cidadesLocaisDaUf = cidadesLocais[ufSelecionadaTrabalho1 as keyof typeof cidadesLocais];
                    setCidadeOptionsTrabalho1(cidadesLocaisDaUf);
                } else {
                    setCidadeOptionsTrabalho1([]);
                }
            });
    }, [ufSelecionadaTrabalho1]);


    //TRABALHO 2

    // 1️⃣ Carrega subprefeituras para Trabalho2 - mas só se a UF for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho2`);
        if (currentUf === "SP") {
            const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
            setSubPrefeituraOptionsTrabalho2(options);
        } else {
            setSubPrefeituraOptionsTrabalho2([]);
        }
    }, [form.getValues(`families[${familyIndex}].ufTrabalho2`)]);

    // 2️⃣ Atualiza distritos ao mudar subPrefeitura Trabalho2 SOMENTE se for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho2`);
        if (currentUf !== "SP" || !selectedSubPrefeituraTrabalho2) {
            setDistritoOptionsStateTrabalho2([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraTrabalho2] || [];
        setDistritoOptionsStateTrabalho2(distritos.map(nome => ({ label: nome, value: nome })));
    }, [selectedSubPrefeituraTrabalho2, form.getValues(`families[${familyIndex}].ufTrabalho2`)]);

    // 3️⃣ Atualiza distritos ao mudar subPrefeitura Trabalho2 SOMENTE se for São Paulo/SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho2`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeTrabalho2`);

        if (currentUf !== "SP" || currentCidade !== "São Paulo" || !selectedSubPrefeituraTrabalho2) {
            setDistritoOptionsStateTrabalho2([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraTrabalho2] || [];
        setDistritoOptionsStateTrabalho2(distritos.map(nome => ({ label: nome, value: nome })));
    }, [selectedSubPrefeituraTrabalho2, form.getValues(`families[${familyIndex}].ufTrabalho2`), form.getValues(`families[${familyIndex}].cidadeTrabalho2`)]);

    // 4️⃣ Torna o SP padrão na UF Trabalho2
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho2`);
        if (!currentUf) form.setValue(`families[${familyIndex}].ufTrabalho2`, "SP");
    }, []);

    // 5️⃣ Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia Trabalho2
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho2`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeTrabalho2`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidadeTrabalho2`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].ufTrabalho2`)]);

    // 6️⃣ Atualiza UF Trabalho2
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
                const options = list.map(e => ({ label: e.nome, value: e.sigla }));
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }
                setEstadoOptionsTrabalho2(options);
            })
            .catch(error => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);
                const options = estados.map(e => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }
                setEstadoOptionsTrabalho2(options);
            });
    }, []);

    // 7️⃣ Atualiza Cidade Trabalho2
    useEffect(() => {
        if (!ufSelecionadaTrabalho2) {
            setCidadeOptionsTrabalho2([]);
            return;
        }

        getCidadesOptions(ufSelecionadaTrabalho2)
            .then(cidades => {
                if (ufSelecionadaTrabalho2 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsTrabalho2(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionadaTrabalho2}, usando dados locais:`, error);
                if (ufSelecionadaTrabalho2 in cidadesLocais) {
                    setCidadeOptionsTrabalho2(cidadesLocais[ufSelecionadaTrabalho2 as keyof typeof cidadesLocais]);
                } else {
                    setCidadeOptionsTrabalho2([]);
                }
            });
    }, [ufSelecionadaTrabalho2]);


    //TRABALHO 3

    // 1️⃣ Carrega subprefeituras para Trabalho3 - mas só se a UF for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho3`);
        if (currentUf === "SP") {
            const options = subprefeituras.map(nome => ({ label: nome, value: nome }));
            setSubPrefeituraOptionsTrabalho3(options);
        } else {
            setSubPrefeituraOptionsTrabalho3([]);
        }
    }, [form.getValues(`families[${familyIndex}].ufTrabalho3`)]);

    // 2️⃣ Atualiza distritos ao mudar subPrefeitura Trabalho3 SOMENTE se for SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho3`);
        if (currentUf !== "SP" || !selectedSubPrefeituraTrabalho3) {
            setDistritoOptionsStateTrabalho3([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraTrabalho3] || [];
        setDistritoOptionsStateTrabalho3(distritos.map(nome => ({ label: nome, value: nome })));
    }, [selectedSubPrefeituraTrabalho3, form.getValues(`families[${familyIndex}].ufTrabalho3`)]);

    // 3️⃣ Atualiza distritos ao mudar subPrefeitura Trabalho3 SOMENTE se for São Paulo/SP
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho3`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeTrabalho3`);

        if (currentUf !== "SP" || currentCidade !== "São Paulo" || !selectedSubPrefeituraTrabalho3) {
            setDistritoOptionsStateTrabalho3([]);
            return;
        }

        const distritos = distritosPorSubprefeitura[selectedSubPrefeituraTrabalho3] || [];
        setDistritoOptionsStateTrabalho3(distritos.map(nome => ({ label: nome, value: nome })));
    }, [selectedSubPrefeituraTrabalho3, form.getValues(`families[${familyIndex}].ufTrabalho3`), form.getValues(`families[${familyIndex}].cidadeTrabalho3`)]);

    // 4️⃣ Torna o SP padrão na UF Trabalho3
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho3`);
        if (!currentUf) form.setValue(`families[${familyIndex}].ufTrabalho3`, "SP");
    }, []);

    // 5️⃣ Torna a cidade São Paulo padrão **somente se** a UF for SP e cidade estiver vazia Trabalho3
    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].ufTrabalho3`);
        const currentCidade = form.getValues(`families[${familyIndex}].cidadeTrabalho3`);
        if (currentUf === "SP" && !currentCidade) {
            form.setValue(`families[${familyIndex}].cidadeTrabalho3`, "São Paulo");
        }
    }, [form.getValues(`families[${familyIndex}].ufTrabalho3`)]);

    // 6️⃣ Atualiza UF Trabalho3
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
                const options = list.map(e => ({ label: e.nome, value: e.sigla }));
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }
                setEstadoOptionsTrabalho3(options);
            })
            .catch(error => {
                console.error('Erro ao buscar estados da API, usando dados locais:', error);
                const options = estados.map(e => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }
                setEstadoOptionsTrabalho3(options);
            });
    }, []);

    // 7️⃣ Atualiza Cidade Trabalho3
    useEffect(() => {
        if (!ufSelecionadaTrabalho3) {
            setCidadeOptionsTrabalho3([]);
            return;
        }

        getCidadesOptions(ufSelecionadaTrabalho3)
            .then(cidades => {
                if (ufSelecionadaTrabalho3 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsTrabalho3(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades da UF ${ufSelecionadaTrabalho3}, usando dados locais:`, error);
                if (ufSelecionadaTrabalho3 in cidadesLocais) {
                    setCidadeOptionsTrabalho3(cidadesLocais[ufSelecionadaTrabalho3 as keyof typeof cidadesLocais]);
                } else {
                    setCidadeOptionsTrabalho3([]);
                }
            });
    }, [ufSelecionadaTrabalho3]);


    // Para a primeira filiação (filiacao1_nome3)
    useEffect(() => {
        if (formValues.filiacao1_naoSeAplica3) {
            const nomeAtual = form.getValues(`families[${familyIndex}].filiacao1_nome3`);

            if (nomeAtual && nomeAtual !== '') {
                form.setValue(`families[${familyIndex}].filiacao1_nome3`, "");
            }
        }
    }, [formValues.filiacao1_naoSeAplica3, form, familyIndex]);

    // Para a segunda filiação (filiacao2_nome3)
    useEffect(() => {
        if (formValues.filiacao2_naoSeAplica3) {
            const nomeAtual = form.getValues(`families[${familyIndex}].filiacao2_nome3`);

            if (nomeAtual && nomeAtual !== '') {
                form.setValue(`families[${familyIndex}].filiacao2_nome3`, "");
            }
        }
    }, [formValues.filiacao2_naoSeAplica3, form, familyIndex]);

    // Para a primeira filiação (filiacao1_nome2)
    useEffect(() => {
        if (formValues.filiacao1_naoSeAplica2) {
            const nomeAtual = form.getValues(`families[${familyIndex}].filiacao1_nome2`);

            if (nomeAtual && nomeAtual !== '') {
                form.setValue(`families[${familyIndex}].filiacao1_nome2`, "");
            }
        }
    }, [formValues.filiacao1_naoSeAplica2, form, familyIndex]);

    // Para a segunda filiação (filiacao2_nome2)
    useEffect(() => {
        if (formValues.filiacao2_naoSeAplica2) {
            const nomeAtual = form.getValues(`families[${familyIndex}].filiacao2_nome2`);

            if (nomeAtual && nomeAtual !== '') {
                form.setValue(`families[${familyIndex}].filiacao2_nome2`, "");
            }
        }
    }, [formValues.filiacao2_naoSeAplica2, form, familyIndex]);

    // Para a primeira filiação
    useEffect(() => {
        if (formValues.filiacao1_naoSeAplica1) {
            const nomeAtual = form.getValues(`families[${familyIndex}].filiacao1_nome1`);

            if (nomeAtual && nomeAtual !== '') {
                form.setValue(`families[${familyIndex}].filiacao1_nome1`, "");
            }
        }
    }, [formValues.filiacao1_naoSeAplica1, form, familyIndex]);

    // Para a segunda filiação
    useEffect(() => {
        if (formValues.filiacao2_naoSeAplica1) {
            const nomeAtual = form.getValues(`families[${familyIndex}].filiacao2_nome1`);

            if (nomeAtual && nomeAtual !== '') {
                form.setValue(`families[${familyIndex}].filiacao2_nome1`, "");
            }
        }
    }, [formValues.filiacao2_naoSeAplica1, form, familyIndex]);


    // ----------- Máscara CEP para Integrante 1 -----------
    useEffect(() => {
        if (cepI1) {
            let cepMasked = cepI1.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepI1`, cepMasked);
        }
    }, [cepI1]);

    // ----------- Máscara CEP para Integrante 2 -----------
    useEffect(() => {
        if (cepI2) {
            let cepMasked = cepI2.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepI2`, cepMasked);
        }
    }, [cepI2]);

    // ----------- Máscara CEP para Integrante 3 -----------
    useEffect(() => {
        if (cepI3) {
            let cepMasked = cepI3.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepI3`, cepMasked);
        }
    }, [cepI3]);

    // ----------- Máscara CEP para Trabalho1 -----------
    useEffect(() => {
        if (cepTrabalho1) {
            let cepMasked = cepTrabalho1.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepTrabalho1`, cepMasked);
        }
    }, [cepTrabalho1]);

    // ----------- Máscara CEP para Trabalho2 -----------
    useEffect(() => {
        if (cepTrabalho2) {
            let cepMasked = cepTrabalho2.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepTrabalho2`, cepMasked);
        }
    }, [cepTrabalho2]);

    // ----------- Máscara CEP para Trabalho3 -----------
    useEffect(() => {
        if (cepTrabalho3) {
            let cepMasked = cepTrabalho3.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepTrabalho3`, cepMasked);
        }
    }, [cepTrabalho3]);



    // ----------- Buscar CEP para Integrante 1 -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepI1`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        const logradouroAtual = form.getValues(`families[${familyIndex}].logradouroI1`);
        const bairroAtual = form.getValues(`families[${familyIndex}].bairroI1`);
        const ufAtual = form.getValues(`families[${familyIndex}].ufI1`);
        const cidadeAtual = form.getValues(`families[${familyIndex}].cidadeI1`);

        const limparCamposEndereco = () => {
            if (!logradouroAtual && !bairroAtual && !ufAtual && !cidadeAtual) {
                form.setValue(`families[${familyIndex}].logradouroI1`, '');
                form.setValue(`families[${familyIndex}].bairroI1`, '');
                form.setValue(`families[${familyIndex}].complementoI1`, '');
                form.setValue(`families[${familyIndex}].ufI1`, '');
                form.setValue(`families[${familyIndex}].cidadeI1`, '');
            }
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepI1`);

                    // ⚠️ Verificação adicionada: CEP deve ser de SP
                    if (endereco.uf !== 'SP') {
                        form.setError(`families[${familyIndex}].cepI1`, {
                            type: 'manual',
                            message: 'O CEP informado não pertence ao estado de São Paulo.',
                        });
                        limparCamposEndereco();
                        form.setValue(`families[${familyIndex}].cepI1`, '');
                        return;
                    }

                    // Preenche os campos diretamente
                    form.setValue(`families[${familyIndex}].logradouroI1`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroI1`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoI1`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufI1`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeI1`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP (I1):', error);
                    limparCamposEndereco();
                    form.setError(`families[${familyIndex}].cepI1`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepI1`)]);


    // ----------- Buscar CEP para escola Integrante 2 -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepI2`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        const logradouroAtual = form.getValues(`families[${familyIndex}].logradouroI2`);
        const bairroAtual = form.getValues(`families[${familyIndex}].bairroI2`);
        const ufAtual = form.getValues(`families[${familyIndex}].ufI2`);
        const cidadeAtual = form.getValues(`families[${familyIndex}].cidadeI2`);

        const limparCamposEndereco = () => {
            if (!logradouroAtual && !bairroAtual && !ufAtual && !cidadeAtual) {
                form.setValue(`families[${familyIndex}].logradouroI2`, '');
                form.setValue(`families[${familyIndex}].bairroI2`, '');
                form.setValue(`families[${familyIndex}].complementoI2`, '');
                form.setValue(`families[${familyIndex}].ufI2`, '');
                form.setValue(`families[${familyIndex}].cidadeI2`, '');
            }
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepI2`);

                    // 🔹 Verifica se o CEP pertence ao estado de São Paulo
                    if (endereco.uf !== 'SP') {
                        form.setError(`families[${familyIndex}].cepI2`, {
                            type: 'manual',
                            message: 'O CEP informado não pertence ao estado de São Paulo.',
                        });
                        limparCamposEndereco();
                        return;
                    }

                    // Preenche os campos diretamente
                    form.setValue(`families[${familyIndex}].logradouroI2`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroI2`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoI2`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufI2`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeI2`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP (I2):', error);
                    limparCamposEndereco();
                    form.setError(`families[${familyIndex}].cepI2`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepI2`)]);

    // ----------- Buscar CEP escola para Integrante 3 -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepI3`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        const logradouroAtual = form.getValues(`families[${familyIndex}].logradouroI3`);
        const bairroAtual = form.getValues(`families[${familyIndex}].bairroI3`);
        const ufAtual = form.getValues(`families[${familyIndex}].ufI3`);
        const cidadeAtual = form.getValues(`families[${familyIndex}].cidadeI3`);

        const limparCamposEndereco = () => {
            if (!logradouroAtual && !bairroAtual && !ufAtual && !cidadeAtual) {
                form.setValue(`families[${familyIndex}].logradouroI3`, '');
                form.setValue(`families[${familyIndex}].bairroI3`, '');
                form.setValue(`families[${familyIndex}].complementoI3`, '');
                form.setValue(`families[${familyIndex}].ufI3`, '');
                form.setValue(`families[${familyIndex}].cidadeI3`, '');
            }
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepI3`);

                    // 🔹 Verifica se o CEP pertence ao estado de São Paulo
                    if (endereco.uf !== 'SP') {
                        form.setError(`families[${familyIndex}].cepI3`, {
                            type: 'manual',
                            message: 'O CEP informado não pertence ao estado de São Paulo.',
                        });
                        limparCamposEndereco();
                        return;
                    }

                    // Preenche os campos diretamente
                    form.setValue(`families[${familyIndex}].logradouroI3`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroI3`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoI3`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufI3`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeI3`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP (I3):', error);
                    limparCamposEndereco();
                    form.setError(`families[${familyIndex}].cepI3`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepI3`)]);


    // ----------- Buscar CEP Trabalho para Integrante 1 -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepTrabalho1`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        const logradouroAtual = form.getValues(`families[${familyIndex}].logradouroTrabalho1`);
        const bairroAtual = form.getValues(`families[${familyIndex}].bairroTrabalho1`);
        const ufAtual = form.getValues(`families[${familyIndex}].ufTrabalho1`);
        const cidadeAtual = form.getValues(`families[${familyIndex}].cidadeTrabalho1`);

        const limparCamposEndereco = () => {
            if (!logradouroAtual && !bairroAtual && !ufAtual && !cidadeAtual) {
                form.setValue(`families[${familyIndex}].logradouroTrabalho1`, '');
                form.setValue(`families[${familyIndex}].bairroTrabalho1`, '');
                form.setValue(`families[${familyIndex}].complementoTrabalho1`, '');
                form.setValue(`families[${familyIndex}].ufTrabalho1`, '');
                form.setValue(`families[${familyIndex}].cidadeTrabalho1`, '');
            }
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepTrabalho1`);

                    // 🔹 Verifica se o CEP pertence ao estado de São Paulo
                    if (endereco.uf !== 'SP') {
                        form.setError(`families[${familyIndex}].cepTrabalho1`, {
                            type: 'manual',
                            message: 'O CEP informado não pertence ao estado de São Paulo.',
                        });
                        limparCamposEndereco();
                        form.setValue(`families[${familyIndex}].cepTrabalho1`, '');
                        return;
                    }

                    form.setValue(`families[${familyIndex}].logradouroTrabalho1`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroTrabalho1`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoTrabalho1`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufTrabalho1`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeTrabalho1`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP Trabalho (I1):', error);
                    limparCamposEndereco();
                    form.setError(`families[${familyIndex}].cepTrabalho1`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepTrabalho1`)]);


    // ----------- Buscar CEP Trabalho para Integrante 2 -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepTrabalho2`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        const logradouroAtual = form.getValues(`families[${familyIndex}].logradouroTrabalho2`);
        const bairroAtual = form.getValues(`families[${familyIndex}].bairroTrabalho2`);
        const ufAtual = form.getValues(`families[${familyIndex}].ufTrabalho2`);
        const cidadeAtual = form.getValues(`families[${familyIndex}].cidadeTrabalho2`);

        const limparCamposEndereco = () => {
            if (!logradouroAtual && !bairroAtual && !ufAtual && !cidadeAtual) {
                form.setValue(`families[${familyIndex}].logradouroTrabalho2`, '');
                form.setValue(`families[${familyIndex}].bairroTrabalho2`, '');
                form.setValue(`families[${familyIndex}].complementoTrabalho2`, '');
                form.setValue(`families[${familyIndex}].ufTrabalho2`, '');
                form.setValue(`families[${familyIndex}].cidadeTrabalho2`, '');
            }
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepTrabalho2`);

                    // 🔹 Verifica se o CEP pertence ao estado de São Paulo
                    if (endereco.uf !== 'SP') {
                        form.setError(`families[${familyIndex}].cepTrabalho2`, {
                            type: 'manual',
                            message: 'O CEP informado não pertence ao estado de São Paulo.',
                        });
                        limparCamposEndereco();
                        form.setValue(`families[${familyIndex}].cepTrabalho2`, '');
                        return;
                    }

                    form.setValue(`families[${familyIndex}].logradouroTrabalho2`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroTrabalho2`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoTrabalho2`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufTrabalho2`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeTrabalho2`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP Trabalho (I2):', error);
                    limparCamposEndereco();
                    form.setError(`families[${familyIndex}].cepTrabalho2`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepTrabalho2`)])


    // ----------- Buscar CEP Trabalho para Integrante 3 -----------
    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepTrabalho3`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        const logradouroAtual = form.getValues(`families[${familyIndex}].logradouroTrabalho3`);
        const bairroAtual = form.getValues(`families[${familyIndex}].bairroTrabalho3`);
        const ufAtual = form.getValues(`families[${familyIndex}].ufTrabalho3`);
        const cidadeAtual = form.getValues(`families[${familyIndex}].cidadeTrabalho3`);

        const limparCamposEndereco = () => {
            if (!logradouroAtual && !bairroAtual && !ufAtual && !cidadeAtual) {
                form.setValue(`families[${familyIndex}].logradouroTrabalho3`, '');
                form.setValue(`families[${familyIndex}].bairroTrabalho3`, '');
                form.setValue(`families[${familyIndex}].complementoTrabalho3`, '');
                form.setValue(`families[${familyIndex}].ufTrabalho3`, '');
                form.setValue(`families[${familyIndex}].cidadeTrabalho3`, '');
            }
        };

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepTrabalho3`);

                    // 🔹 Verifica se o CEP pertence ao estado de São Paulo
                    if (endereco.uf !== 'SP') {
                        form.setError(`families[${familyIndex}].cepTrabalho3`, {
                            type: 'manual',
                            message: 'O CEP informado não pertence ao estado de São Paulo.',
                        });
                        limparCamposEndereco();
                        form.setValue(`families[${familyIndex}].cepTrabalho3`, '');
                        return;
                    }

                    form.setValue(`families[${familyIndex}].logradouroTrabalho3`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroTrabalho3`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoTrabalho3`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufTrabalho3`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeTrabalho3`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP Trabalho (I3):', error);
                    limparCamposEndereco();
                    form.setError(`families[${familyIndex}].cepTrabalho3`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };

            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepTrabalho3`)]);



    // ----------- Validacao CPF escola Integrante 1 -----------
    useEffect(() => {
        const pathCpf = `families[${familyIndex}].numeroCPFI1`;
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
    }, [form.watch(`families[${familyIndex}].numeroCPFI1`)]);

    // ----------- Validacao CPF Integrante 2 -----------
    useEffect(() => {
        const pathCpf = `families[${familyIndex}].numeroCPFI2`;
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
    }, [form.watch(`families[${familyIndex}].numeroCPFI2`)]);

    // ----------- Validacao CPF Integrante 3 -----------
    useEffect(() => {
        const pathCpf = `families[${familyIndex}].numeroCPFI3`;
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
    }, [form.watch(`families[${familyIndex}].numeroCPFI3`)]);

    //valida Data
    useEffect(() => {
        const validarDataIntegrante = (dataNascimento: string, campo: string, idade: string) => {
            const pathNascimento = `families[${familyIndex}].${campo}`;
            const pathIdade = `families[${familyIndex}].${idade}`;

            console.log(`📅 ${campo}:`, dataNascimento);

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
                alert(`Data inválida no campo ${campo}.`);
                return;
            }

            if (data > hoje) {
                form.setValue(pathNascimento, "");
                form.setValue(pathIdade, "");
                alert(`Data de nascimento não pode ser futura no campo ${campo}.`);
                return;
            }
        };

        // Valida todos os integrantes
        requestAnimationFrame(() => {
            validarDataIntegrante(dataNascimentoIntegrante1, 'dataNascimentoIntegrante1', 'idadeIntegrante1');
            validarDataIntegrante(dataNascimentoIntegrante2, 'dataNascimentoIntegrante2', 'idadeIntegrante2');
            validarDataIntegrante(dataNascimentoIntegrante3, 'dataNascimentoIntegrante3', 'idadeIntegrante3');
        });
    }, [
        dataNascimentoIntegrante1,
        dataNascimentoIntegrante2,
        dataNascimentoIntegrante3,
        familyIndex,
        form.setValue
    ]);



    // ✅ Função para agrupar campos por integrante - MESMA LÓGICA DOS ANIMAIS
    const getCamposPorIntegrante = (): Integrante[] => {
        const campos = section.fields || [];
        const integrantes: Integrante[] = [];

        // Integrante 1 - sempre existe se possuiIntegrantes === "sim"
        if (formValues.possuiIntegrantes === "sim") {
            const camposIntegrante1 = campos.filter(f =>
                (f.name.endsWith('1') ||
                    f.name.includes('Integrante1') ||
                    f.name === 'doc1' ||
                    f.name === 'filiacao1' ||
                    f.name === 'contatos1') &&
                !f.name.includes('ativarIntegrante')
            );

            if (camposIntegrante1.length > 0) {
                integrantes.push({
                    numero: 1,
                    nome: formValues.nomeIntegrante1 || "Integrante 1",
                    relacao: formValues.relacaoResponsavel1 || "select",
                    campos: camposIntegrante1
                });
            }
        }

        // Integrante 2 - se ativado
        if (formValues.ativarIntegrante2 === true) {
            const camposIntegrante2 = campos.filter(f =>
                (f.name.endsWith('2') ||
                    f.name.includes('Integrante2') ||
                    f.name === 'doc2' ||
                    f.name === 'filiacao2' ||
                    f.name === 'contatos2') &&
                !f.name.includes('ativarIntegrante')
            );

            if (camposIntegrante2.length > 0) {
                integrantes.push({
                    numero: 2,
                    nome: formValues.nomeIntegrante2 || "Integrante 2",
                    relacao: formValues.relacaoResponsavel2 || "select",
                    campos: camposIntegrante2
                });
            }
        }

        // Integrante 3 - se ativado
        if (formValues.ativarIntegrante3 === true) {
            const camposIntegrante3 = campos.filter(f =>
                (f.name.endsWith('3') ||
                    f.name.includes('Integrante3') ||
                    f.name === 'doc3' ||
                    f.name === 'filiacao3' ||
                    f.name === 'contatos3') &&
                !f.name.includes('ativarIntegrante')
            );

            if (camposIntegrante3.length > 0) {
                integrantes.push({
                    numero: 3,
                    nome: formValues.nomeIntegrante3 || "Integrante 3",
                    relacao: formValues.relacaoResponsavel3 || "select",
                    campos: camposIntegrante3
                });
            }
        }

        return integrantes;
    };

    // ✅ Função para obter checkboxes de adicionar integrantes
    const getCheckboxesIntegrantes = () => {
        return section.fields.filter(f =>
            f.name === "ativarIntegrante2" ||
            f.name === "ativarIntegrante3"
        );
    };

    const integrantes = getCamposPorIntegrante();
    const checkboxesIntegrantes = getCheckboxesIntegrantes();

    // ✅ Funções para controlar o estado dos accordions - MESMO PADRÃO DOS ANIMAIS
    const toggleIntegrante = (numeroIntegrante: number) => {
        setIntegrantesExpandidos(prev =>
            prev.includes(numeroIntegrante)
                ? prev.filter(n => n !== numeroIntegrante)
                : [...prev, numeroIntegrante]
        );
    };

    const isIntegranteExpandido = (numeroIntegrante: number) => {
        return integrantesExpandidos.includes(numeroIntegrante);
    };

    // ✅ Ícones para cada tipo de relação
    const getIntegranteIcon = (relacao: string): string => {
        const icons: Record<string, string> = {
            conjuge_campanheiro: "💑",
            filho: "👦", filha: "👧",
            enteado: "👦", enteada: "👧",
            irmao: "👨", irma: "👩",
            pai: "👨‍🦳", mae: "👩‍🦳",
            sogro: "👴", sogra: "👵",
            neto: "🧒", neta: "🧒",
            bisneto: "👶", bisneta: "👶",
            genro: "👨", nora: "👩",
            padrasto: "👨", madrasta: "👩",
            sobrinho: "👦", sobrinha: "👧",
            sem_parentesco: "👤", nsi: "❓", outro: "👥", select: "❓"
        };
        return icons[relacao] || "👤";
    };

    // ✅ Função para obter o label da relação
    const getRelacaoLabel = (relacao: string): string => {
        const relacaoOptions = [
            { label: "Cônjuge/Companheiro(a)", value: "conjuge_campanheiro" },
            { label: "Filho", value: "filho" },
            { label: "Filha", value: "filha" },
            { label: "Enteado", value: "enteado" },
            { label: "Enteada", value: "enteada" },
            { label: "Irmão", value: "irmao" },
            { label: "Irmã", value: "irma" },
            { label: "Pai", value: "pai" },
            { label: "Mãe", value: "mae" },
            { label: "Sogro", value: "sogro" },
            { label: "Sogra", value: "sogra" },
            { label: "Neto", value: "neto" },
            { label: "Neta", value: "neta" },
            { label: "Bisneto", value: "bisneto" },
            { label: "Bisneta", value: "bisneta" },
            { label: "Genro", value: "genro" },
            { label: "Nora", value: "nora" },
            { label: "Padrasto", value: "padrasto" },
            { label: "Madrasta", value: "madrasta" },
            { label: "Sobrinho", value: "sobrinho" },
            { label: "Sobrinha", value: "sobrinha" },
            { label: "Sem Relação de Parentesco", value: "sem_parentesco" },
            { label: "Não Sabe Informar", value: "nsi" },
            { label: "Outra Relação de Parentesco", value: "outro" }
        ];

        const found = relacaoOptions.find(opt => opt.value === relacao);
        return found ? found.label : "Não informado";
    };



    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    {/* ✅ CABEÇALHO REDUZIDO - MESMO ESTILO DOS ANIMAIS */}
                    <div className="section-header cursor-pointer bg-gray-100 p-2 mb-2 rounded-xl">
                        <h4 className="text-xl font-semibold mb-1" data-secao={section.title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${section.title}`}
                        </h4>
                        {/* ✅ CONTADOR DE INTEGRANTES COM FONTE MENOR */}
                        <p className="text-gray-600 text-xs">
                            {formValues.possuiIntegrantes === "sim"
                                ? `${integrantes.length} integrante(s) cadastrado(s)`
                                : "Clique para expandir"}
                        </p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6">
                    {/* ✅ Campo principal - Possui Integrantes? */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <FormSectionRenderer
                            section={{
                                id: section.id,
                                title: "Informações Gerais",
                                fields: section.fields.filter(f => f.name === "possuiIntegrantes"),
                            }}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                            sectionIndex={0}
                            formValues={formValues}
                            showSectionLabel={false}
                            familyIndex={familyIndex}
                        />
                    </div>

                    {/* ✅ Quadros para cada integrante COMO ACCORDIONS - MESMO PADRÃO DOS ANIMAIS */}
                    {integrantes.map((integrante, index) => (
                        <Collapsible
                            key={`integrante-${integrante.numero}`}
                            open={isIntegranteExpandido(integrante.numero)}
                            onOpenChange={() => toggleIntegrante(integrante.numero)}
                            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Header do integrante - AGORA É CLICÁVEL */}
                            <CollapsibleTrigger asChild>
                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="text-xl">
                                                {getIntegranteIcon(integrante.relacao)}
                                            </div>
                                            <div>
                                                <h3 className="text-base text-gray-900">
                                                    {integrante.nome}
                                                </h3>
                                                <p className="text-gray-700 text-xs">
                                                    {integrante.relacao && integrante.relacao !== "select"
                                                        ? `Parentesco: ${getRelacaoLabel(integrante.relacao)}`
                                                        : "Complete as informações"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-300 rounded-full px-2 py-1">
                                                <span className="text-gray-800 font-semibold text-xs">
                                                    #{integrante.numero}
                                                </span>
                                            </div>
                                            {/* Ícone de expandir/recolher - MESMO DOS ANIMAIS */}
                                            {isIntegranteExpandido(integrante.numero) ? (
                                                <ChevronUpIcon className="h-4 w-4 text-gray-600" />
                                            ) : (
                                                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleTrigger>

                            {/* Campos do integrante - AGORA DENTRO DO COLLAPSIBLE CONTENT */}
                            <CollapsibleContent className="p-4 space-y-4">
                                <FormSectionRenderer
                                    section={{
                                        id: `integrante-${integrante.numero}`,
                                        title: "",
                                        fields: integrante.campos,
                                    }}
                                    formControl={form.control}
                                    getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${index + 1}.${fieldIndex + 1}`}
                                    sectionIndex={0}
                                    formValues={formValues}
                                    showSectionLabel={false}
                                    familyIndex={familyIndex}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    ))}

                    {/* ✅ Mensagem quando não há integrantes mas selecionou "Sim" - MESMO PADRÃO DOS ANIMAIS */}
                    {formValues.possuiIntegrantes === "sim" && integrantes.length === 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border-2 border-blue-200 p-6 text-center">
                            <div className="text-3xl mb-3">👥</div>
                            <h5 className="text-base font-semibold text-blue-800 mb-2">
                                Nenhum integrante cadastrado
                            </h5>
                            <p className="text-blue-600 mb-3 text-sm">
                                Preencha os campos do primeiro integrante para começar
                            </p>

                            {/* ✅ Checkbox para segundo integrante mesmo sem integrantes cadastrados */}
                            {checkboxesIntegrantes.length > 0 && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200 max-w-md mx-auto">
                                    <FormSectionRenderer
                                        section={{
                                            id: "checkboxes-iniciais",
                                            title: "",
                                            fields: checkboxesIntegrantes.filter(f => f.name === "ativarIntegrante2"),
                                        }}
                                        formControl={form.control}
                                        getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.I${fieldIndex + 1}`}
                                        sectionIndex={0}
                                        formValues={formValues}
                                        showSectionLabel={false}
                                        familyIndex={familyIndex}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ Checkboxes para adicionar mais integrantes - MESMO PADRÃO DOS ANIMAIS */}
                    {formValues.possuiIntegrantes === "sim" && checkboxesIntegrantes.length > 0 && (
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <span>➕</span>
                                Adicionar mais integrantes
                            </h5>
                            <div className="space-y-2">
                                <FormSectionRenderer
                                    section={{
                                        id: "checkboxes-integrantes",
                                        title: "",
                                        fields: checkboxesIntegrantes,
                                    }}
                                    formControl={form.control}
                                    getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.C${fieldIndex + 1}`}
                                    sectionIndex={0}
                                    formValues={formValues}
                                    showSectionLabel={false}
                                    familyIndex={familyIndex}
                                />

                                {/* Mensagem informativa mais discreta - MESMO DOS ANIMAIS */}
                                <div className="bg-gray-100 rounded-lg p-2 border border-gray-300">
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                        <span>💡</span>
                                        Marque para adicionar mais integrantes
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default IntegrantesFamiliaForm;