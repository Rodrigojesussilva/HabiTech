import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/integrantesFamilia.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { buscarEnderecoPorCep } from '../api_cep';
import { mask, unMask } from 'remask';
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
    // Estado para controlar qual integrante está expandido
    const [integrantesExpandidos, setIntegrantesExpandidos] = useState<number[]>([]);
    const form = useFormContext();
    // 🔁 Reage a mudanças em todos os campos da família
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues);
    const section = formSections[0];

    const dataNascimentoIntegrante1 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante1`);
    const dataNascimentoIntegrante2 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante2`);
    const dataNascimentoIntegrante3 = form.watch(`families[${familyIndex}].dataNascimentoIntegrante3`);

    // Adicione estes watches no início do componente:
    const cepI1 = form.watch(`families[${familyIndex}].cepI1`);
    const cepI2 = form.watch(`families[${familyIndex}].cepI2`);
    const cepI3 = form.watch(`families[${familyIndex}].cepI3`);

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
    }, [form.watch(`families[${familyIndex}].cepI1`)]);~

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
    }, [form.watch(`families[${familyIndex}].cepTrabalho2`)]);

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