import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/integrantesFamilia.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { buscarEnderecoPorCep } from '../api_cep';
import { mask, unMask } from 'remask';
import { subprefeituras, distritosPorSubprefeitura } from '../subprefeiturasDistritos';
import { estados as fetchEstados, getCidadesOptions } from '../../../cidades_estados/api_estadosCidades';
import { estados } from '@/components/cidades_estados/estados';
import { cidadesLocais } from '@/components/cidades_estados/cidade';

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

interface Option {
    label: string;
    value: string;
}

const IntegrantesFamiliaForm = ({ sectionIndex: sectionNumber, familyIndex }: IntegrantesFamiliaFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [integrantesExpandidos, setIntegrantesExpandidos] = useState<number[]>([]);
    
    // Estados para opções dinâmicas
    const [estadoOptions, setEstadoOptions] = useState<Option[]>([]);
    const [cidadeOptionsI1, setCidadeOptionsI1] = useState<Option[]>([]);
    const [cidadeOptionsI2, setCidadeOptionsI2] = useState<Option[]>([]);
    const [cidadeOptionsI3, setCidadeOptionsI3] = useState<Option[]>([]);
    const [cidadeOptionsTrabalho1, setCidadeOptionsTrabalho1] = useState<Option[]>([]);
    const [cidadeOptionsTrabalho2, setCidadeOptionsTrabalho2] = useState<Option[]>([]);
    const [cidadeOptionsTrabalho3, setCidadeOptionsTrabalho3] = useState<Option[]>([]);
    const [subPrefeituraOptions, setSubPrefeituraOptions] = useState<Option[]>([]);
    const [distritoOptionsI1, setDistritoOptionsI1] = useState<Option[]>([]);
    const [distritoOptionsI2, setDistritoOptionsI2] = useState<Option[]>([]);
    const [distritoOptionsI3, setDistritoOptionsI3] = useState<Option[]>([]);
    const [distritoOptionsTrabalho1, setDistritoOptionsTrabalho1] = useState<Option[]>([]);
    const [distritoOptionsTrabalho2, setDistritoOptionsTrabalho2] = useState<Option[]>([]);
    const [distritoOptionsTrabalho3, setDistritoOptionsTrabalho3] = useState<Option[]>([]);

    const form = useFormContext();
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Watches para datas
    const dataNascimentoIntegrante1 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante1`);
    const dataNascimentoIntegrante2 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante2`);
    const dataNascimentoIntegrante3 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante3`);

    // Watches para CEPs
    const cepI1 = form.watch(`families[${familyIndex}].cepI1`);
    const cepI2 = form.watch(`families[${familyIndex}].cepI2`);
    const cepI3 = form.watch(`families[${familyIndex}].cepI3`);
    const cepTrabalho1 = form.watch(`families[${familyIndex}].cepTrabalho1`);
    const cepTrabalho2 = form.watch(`families[${familyIndex}].cepTrabalho2`);
    const cepTrabalho3 = form.watch(`families[${familyIndex}].cepTrabalho3`);

    // Watches para UFs
    const ufI1 = form.watch(`families[${familyIndex}].ufI1`);
    const ufI2 = form.watch(`families[${familyIndex}].ufI2`);
    const ufI3 = form.watch(`families[${familyIndex}].ufI3`);
    const ufTrabalho1 = form.watch(`families[${familyIndex}].ufTrabalho1`);
    const ufTrabalho2 = form.watch(`families[${familyIndex}].ufTrabalho2`);
    const ufTrabalho3 = form.watch(`families[${familyIndex}].ufTrabalho3`);

    // Watches para subprefeituras
    const subPrefeituraI1 = form.watch(`families[${familyIndex}].subPrefeituraI1`);
    const subPrefeituraI2 = form.watch(`families[${familyIndex}].subPrefeituraI2`);
    const subPrefeituraI3 = form.watch(`families[${familyIndex}].subPrefeituraI3`);
    const subPrefeituraTrabalho1 = form.watch(`families[${familyIndex}].subPrefeituraTrabalho1`);
    const subPrefeituraTrabalho2 = form.watch(`families[${familyIndex}].subPrefeituraTrabalho2`);
    const subPrefeituraTrabalho3 = form.watch(`families[${familyIndex}].subPrefeituraTrabalho3`);

    // ========== CARREGAMENTO DE ESTADOS ==========
    useEffect(() => {
        fetchEstados()
            .then(list => {
                const options = list.map(e => ({ label: e.nome, value: e.sigla }));
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }
                setEstadoOptions(options);
            })
            .catch(error => {
                console.error('Erro ao buscar estados da API, usando fallback local:', error);
                const options = estados.map(e => ({ label: e.label, value: e.value }));
                const spIndex = options.findIndex(e => e.label === 'São Paulo');
                if (spIndex > -1) {
                    const [sp] = options.splice(spIndex, 1);
                    options.unshift(sp);
                }
                setEstadoOptions(options);
            });
    }, []);

    // ========== CARREGAMENTO DE SUBPREFEITURAS ==========
    useEffect(() => {
        const options = subprefeituras.map(sp => ({ label: sp, value: sp }));
        setSubPrefeituraOptions(options);
    }, []);

    // ========== CARREGAMENTO DE CIDADES ==========

    // Instituição Ensino - Integrante 1
    useEffect(() => {
        if (!ufI1) {
            setCidadeOptionsI1([]);
            return;
        }
        getCidadesOptions(ufI1)
            .then(cidades => {
                if (ufI1 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsI1(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades para ${ufI1} (I1):`, error);
                const fallback = cidadesLocais[ufI1 as keyof typeof cidadesLocais] || [];
                setCidadeOptionsI1(fallback);
            });
    }, [ufI1]);

    // Instituição Ensino - Integrante 2
    useEffect(() => {
        if (!ufI2) {
            setCidadeOptionsI2([]);
            return;
        }
        getCidadesOptions(ufI2)
            .then(cidades => {
                if (ufI2 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsI2(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades para ${ufI2} (I2):`, error);
                const fallback = cidadesLocais[ufI2 as keyof typeof cidadesLocais] || [];
                setCidadeOptionsI2(fallback);
            });
    }, [ufI2]);

    // Instituição Ensino - Integrante 3
    useEffect(() => {
        if (!ufI3) {
            setCidadeOptionsI3([]);
            return;
        }
        getCidadesOptions(ufI3)
            .then(cidades => {
                if (ufI3 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsI3(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades para ${ufI3} (I3):`, error);
                const fallback = cidadesLocais[ufI3 as keyof typeof cidadesLocais] || [];
                setCidadeOptionsI3(fallback);
            });
    }, [ufI3]);

    // Trabalho - Integrante 1
    useEffect(() => {
        if (!ufTrabalho1) {
            setCidadeOptionsTrabalho1([]);
            return;
        }
        getCidadesOptions(ufTrabalho1)
            .then(cidades => {
                if (ufTrabalho1 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsTrabalho1(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades para ${ufTrabalho1} (Trabalho1):`, error);
                const fallback = cidadesLocais[ufTrabalho1 as keyof typeof cidadesLocais] || [];
                setCidadeOptionsTrabalho1(fallback);
            });
    }, [ufTrabalho1]);

    // Trabalho - Integrante 2
    useEffect(() => {
        if (!ufTrabalho2) {
            setCidadeOptionsTrabalho2([]);
            return;
        }
        getCidadesOptions(ufTrabalho2)
            .then(cidades => {
                if (ufTrabalho2 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsTrabalho2(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades para ${ufTrabalho2} (Trabalho2):`, error);
                const fallback = cidadesLocais[ufTrabalho2 as keyof typeof cidadesLocais] || [];
                setCidadeOptionsTrabalho2(fallback);
            });
    }, [ufTrabalho2]);

    // Trabalho - Integrante 3
    useEffect(() => {
        if (!ufTrabalho3) {
            setCidadeOptionsTrabalho3([]);
            return;
        }
        getCidadesOptions(ufTrabalho3)
            .then(cidades => {
                if (ufTrabalho3 === 'SP') {
                    const spIndex = cidades.findIndex(c => c.label === 'São Paulo');
                    if (spIndex > -1) {
                        const [spCity] = cidades.splice(spIndex, 1);
                        cidades.unshift(spCity);
                    }
                }
                setCidadeOptionsTrabalho3(cidades);
            })
            .catch(error => {
                console.error(`Erro ao buscar cidades para ${ufTrabalho3} (Trabalho3):`, error);
                const fallback = cidadesLocais[ufTrabalho3 as keyof typeof cidadesLocais] || [];
                setCidadeOptionsTrabalho3(fallback);
            });
    }, [ufTrabalho3]);

    // ========== CARREGAMENTO DE DISTRITOS ==========

    // Instituição Ensino - Integrante 1
    useEffect(() => {
        if (!subPrefeituraI1) {
            setDistritoOptionsI1([]);
            return;
        }
        const distritos = distritosPorSubprefeitura[subPrefeituraI1] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsI1(options);
    }, [subPrefeituraI1]);

    // Instituição Ensino - Integrante 2
    useEffect(() => {
        if (!subPrefeituraI2) {
            setDistritoOptionsI2([]);
            return;
        }
        const distritos = distritosPorSubprefeitura[subPrefeituraI2] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsI2(options);
    }, [subPrefeituraI2]);

    // Instituição Ensino - Integrante 3
    useEffect(() => {
        if (!subPrefeituraI3) {
            setDistritoOptionsI3([]);
            return;
        }
        const distritos = distritosPorSubprefeitura[subPrefeituraI3] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsI3(options);
    }, [subPrefeituraI3]);

    // Trabalho - Integrante 1
    useEffect(() => {
        if (!subPrefeituraTrabalho1) {
            setDistritoOptionsTrabalho1([]);
            return;
        }
        const distritos = distritosPorSubprefeitura[subPrefeituraTrabalho1] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsTrabalho1(options);
    }, [subPrefeituraTrabalho1]);

    // Trabalho - Integrante 2
    useEffect(() => {
        if (!subPrefeituraTrabalho2) {
            setDistritoOptionsTrabalho2([]);
            return;
        }
        const distritos = distritosPorSubprefeitura[subPrefeituraTrabalho2] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsTrabalho2(options);
    }, [subPrefeituraTrabalho2]);

    // Trabalho - Integrante 3
    useEffect(() => {
        if (!subPrefeituraTrabalho3) {
            setDistritoOptionsTrabalho3([]);
            return;
        }
        const distritos = distritosPorSubprefeitura[subPrefeituraTrabalho3] || [];
        const options = distritos.map(nome => ({ label: nome, value: nome }));
        setDistritoOptionsTrabalho3(options);
    }, [subPrefeituraTrabalho3]);

    // ========== FUNÇÃO PARA MONTAR SEÇÕES COM OPÇÕES DINÂMICAS ==========
    const formSectionsComOpcoes = (() => {
        try {
            const sections = getMergedFormSections(formValues);
            if (!sections || sections.length === 0) {
                return [];
            }
            
            return sections.map(section => ({
                ...section,
                fields: (section.fields || []).map(field => {
                    switch (field.name) {
                        // Estados
                        case 'ufI1':
                        case 'ufI2':
                        case 'ufI3':
                        case 'ufTrabalho1':
                        case 'ufTrabalho2':
                        case 'ufTrabalho3':
                            return { ...field, options: estadoOptions };

                        // Cidades Instituição Ensino
                        case 'cidadeI1':
                            return { ...field, options: cidadeOptionsI1 };
                        case 'cidadeI2':
                            return { ...field, options: cidadeOptionsI2 };
                        case 'cidadeI3':
                            return { ...field, options: cidadeOptionsI3 };

                        // Cidades Trabalho
                        case 'cidadeTrabalho1':
                            return { ...field, options: cidadeOptionsTrabalho1 };
                        case 'cidadeTrabalho2':
                            return { ...field, options: cidadeOptionsTrabalho2 };
                        case 'cidadeTrabalho3':
                            return { ...field, options: cidadeOptionsTrabalho3 };

                        // Subprefeituras
                        case 'subPrefeituraI1':
                        case 'subPrefeituraI2':
                        case 'subPrefeituraI3':
                        case 'subPrefeituraTrabalho1':
                        case 'subPrefeituraTrabalho2':
                        case 'subPrefeituraTrabalho3':
                            return { ...field, options: subPrefeituraOptions };

                        // Distritos Instituição Ensino
                        case 'distritoI1':
                            return { ...field, options: distritoOptionsI1 };
                        case 'distritoI2':
                            return { ...field, options: distritoOptionsI2 };
                        case 'distritoI3':
                            return { ...field, options: distritoOptionsI3 };

                        // Distritos Trabalho
                        case 'distritoTrabalho1':
                            return { ...field, options: distritoOptionsTrabalho1 };
                        case 'distritoTrabalho2':
                            return { ...field, options: distritoOptionsTrabalho2 };
                        case 'distritoTrabalho3':
                            return { ...field, options: distritoOptionsTrabalho3 };

                        default:
                            return field;
                    }
                })
            }));
        } catch (err) {
            console.error("Erro ao montar seções do formulário:", err);
            return getMergedFormSections(formValues) || [];
        }
    })();

    const sectionComOpcoes = formSectionsComOpcoes[0] || { id: '', title: '', fields: [] };

    // ========== MÁSCARAS DE CEP ==========
    
    useEffect(() => {
        if (cepI1) {
            let cepMasked = cepI1.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepI1`, cepMasked);
        }
    }, [cepI1, familyIndex, form]);

    useEffect(() => {
        if (cepI2) {
            let cepMasked = cepI2.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepI2`, cepMasked);
        }
    }, [cepI2, familyIndex, form]);

    useEffect(() => {
        if (cepI3) {
            let cepMasked = cepI3.replace(/\D/g, "").slice(0, 8);
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`;
            }
            form.setValue(`families[${familyIndex}].cepI3`, cepMasked);
        }
    }, [cepI3, familyIndex, form]);

    // ========== BUSCA DE CEP SIMPLIFICADA ==========

    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cepI1`);
        const cepLimpo = (cep || '').replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                try {
                    const endereco = await buscarEnderecoPorCep(cepLimpo);
                    form.clearErrors(`families[${familyIndex}].cepI1`);
                    form.setValue(`families[${familyIndex}].logradouroI1`, endereco.logradouro || '');
                    form.setValue(`families[${familyIndex}].bairroI1`, endereco.bairro || '');
                    form.setValue(`families[${familyIndex}].complementoI1`, endereco.complemento || '');
                    form.setValue(`families[${familyIndex}].ufI1`, endereco.uf || '');
                    form.setValue(`families[${familyIndex}].cidadeI1`, endereco.cidade || '');
                } catch (error) {
                    console.error('Erro ao buscar CEP (I1):', error);
                    form.setError(`families[${familyIndex}].cepI1`, {
                        type: 'manual',
                        message: 'CEP inválido ou não encontrado.',
                    });
                }
            };
            buscarEndereco();
        }
    }, [form.watch(`families[${familyIndex}].cepI1`), familyIndex, form]);

    // ========== VALIDAÇÃO DE CPF ==========

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
    }, [form.watch(`families[${familyIndex}].numeroCPFI1`), familyIndex, form]);

    // ========== VALIDAÇÃO DE DATA ==========

    useEffect(() => {
        const validarDataIntegrante = (dataNascimento: string, campo: string, idade: string) => {
            const pathNascimento = `families[${familyIndex}].${campo}`;
            const pathIdade = `families[${familyIndex}].${idade}`;

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
        form
    ]);

    // ========== LÓGICA DE AGRUPAMENTO DE INTEGRANTES ==========

    const getCamposPorIntegrante = (): Integrante[] => {
        const campos = sectionComOpcoes.fields || [];
        const integrantes: Integrante[] = [];

        if (formValues.possuiIntegrantes === "sim") {
            const camposIntegrante1 = campos.filter(f =>
                (f.name.endsWith('1') || f.name.includes('Integrante1') || f.name === 'doc1' || f.name === 'filiacao1' || f.name === 'contatos1') &&
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

        if (formValues.ativarIntegrante2 === true) {
            const camposIntegrante2 = campos.filter(f =>
                (f.name.endsWith('2') || f.name.includes('Integrante2') || f.name === 'doc2' || f.name === 'filiacao2' || f.name === 'contatos2') &&
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

        if (formValues.ativarIntegrante3 === true) {
            const camposIntegrante3 = campos.filter(f =>
                (f.name.endsWith('3') || f.name.includes('Integrante3') || f.name === 'doc3' || f.name === 'filiacao3' || f.name === 'contatos3') &&
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

    const getCheckboxesIntegrantes = () => {
        return (sectionComOpcoes.fields || []).filter(f =>
            f.name === "ativarIntegrante2" || f.name === "ativarIntegrante3"
        );
    };

    const integrantes = getCamposPorIntegrante();
    const checkboxesIntegrantes = getCheckboxesIntegrantes();

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

    const getIntegranteIcon = (relacao: string): string => {
        const icons: Record<string, string> = {
            conjuge_campanheiro: "💑", filho: "👦", filha: "👧", enteado: "👦", enteada: "👧",
            irmao: "👨", irma: "👩", pai: "👨‍🦳", mae: "👩‍🦳", sogro: "👴", sogra: "👵",
            neto: "🧒", neta: "🧒", bisneto: "👶", bisneta: "👶", genro: "👨", nora: "👩",
            padrasto: "👨", madrasta: "👩", sobrinho: "👦", sobrinha: "👧",
            sem_parentesco: "👤", nsi: "❓", outro: "👥", select: "❓"
        };
        return icons[relacao] || "👤";
    };

    const getRelacaoLabel = (relacao: string): string => {
        const relacaoOptions = [
            { label: "Cônjuge/Companheiro(a)", value: "conjuge_campanheiro" },
            { label: "Filho", value: "filho" }, { label: "Filha", value: "filha" },
            { label: "Enteado", value: "enteado" }, { label: "Enteada", value: "enteada" },
            { label: "Irmão", value: "irmao" }, { label: "Irmã", value: "irma" },
            { label: "Pai", value: "pai" }, { label: "Mãe", value: "mae" },
            { label: "Sogro", value: "sogro" }, { label: "Sogra", value: "sogra" },
            { label: "Neto", value: "neto" }, { label: "Neta", value: "neta" },
            { label: "Bisneto", value: "bisneto" }, { label: "Bisneta", value: "bisneta" },
            { label: "Genro", value: "genro" }, { label: "Nora", value: "nora" },
            { label: "Padrasto", value: "padrasto" }, { label: "Madrasta", value: "madrasta" },
            { label: "Sobrinho", value: "sobrinho" }, { label: "Sobrinha", value: "sobrinha" },
            { label: "Sem Relação de Parentesco", value: "sem_parentesco" },
            { label: "Não Sabe Informar", value: "nsi" },
            { label: "Outra Relação de Parentesco", value: "outro" }
        ];
        const found = relacaoOptions.find(opt => opt.value === relacao);
        return found ? found.label : "Não informado";
    };

    // Se não há seção, retorna null para evitar erro
    if (!sectionComOpcoes || !sectionComOpcoes.fields) {
        return null;
    }

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2 mb-2 rounded-xl">
                        <h4 className="text-xl font-semibold mb-1" data-secao={sectionComOpcoes.title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${sectionComOpcoes.title}`}
                        </h4>
                        <p className="text-gray-600 text-xs">
                            {formValues.possuiIntegrantes === "sim"
                                ? `${integrantes.length} integrante(s) cadastrado(s)`
                                : "Clique para expandir"}
                        </p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <FormSectionRenderer
                            section={{
                                id: sectionComOpcoes.id,
                                title: "Informações Gerais",
                                fields: (sectionComOpcoes.fields || []).filter(f => f.name === "possuiIntegrantes"),
                            }}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                            sectionIndex={0}
                            formValues={formValues}
                            showSectionLabel={false}
                            familyIndex={familyIndex}
                        />
                    </div>

                    {integrantes.map((integrante, index) => (
                        <Collapsible
                            key={`integrante-${integrante.numero}`}
                            open={isIntegranteExpandido(integrante.numero)}
                            onOpenChange={() => toggleIntegrante(integrante.numero)}
                            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
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
                                            {isIntegranteExpandido(integrante.numero) ? (
                                                <ChevronUpIcon className="h-4 w-4 text-gray-600" />
                                            ) : (
                                                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleTrigger>

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

                    {formValues.possuiIntegrantes === "sim" && integrantes.length === 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border-2 border-blue-200 p-6 text-center">
                            <div className="text-3xl mb-3">👥</div>
                            <h5 className="text-base font-semibold text-blue-800 mb-2">
                                Nenhum integrante cadastrado
                            </h5>
                            <p className="text-blue-600 mb-3 text-sm">
                                Preencha os campos do primeiro integrante para começar
                            </p>
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