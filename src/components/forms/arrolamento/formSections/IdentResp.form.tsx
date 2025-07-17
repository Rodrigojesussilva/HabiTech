import React from 'react';
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/arrolamento/definitions/identResp.definition";
import { calcularIdade, validarDataNascimento } from "@/components/forms/arrolamento/helpers/identResp.helper";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';


interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    onChangeMostrarSecoes: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const IdentRespForm = ({ sectionIndex: sectionNumber, familyIndex, onChangeMostrarSecoes }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(true);
    const form = useFormContext();
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues);
    const dataNascimento = form.watch(`families[${familyIndex}].dataNascimentoResp`);
    const alertAberto = React.useRef(false);
    const [alertShown, setAlertShown] = useState(false);


    //proibir o digitar numeros e caracteres especiais nomeSocialEntrevistado
    useEffect(() => {
        const path = `families[${familyIndex}].nomeSocialEntrevistado`;

        const rawValue = form.getValues(path); // sempre pega o valor atualizado

        if (typeof rawValue === "string") {
            const sanitizedValue = rawValue.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""); // mantém letras com acento e espaços

            if (rawValue !== sanitizedValue) {
                form.setValue(path, sanitizedValue);
            }
        }
    }, [form.getValues(`families[${familyIndex}].nomeSocialEntrevistado`), form, familyIndex]);

    useEffect(() => {
        const path = `families[${familyIndex}].nomeCompletoEntrevistado`;

        const rawValue = form.getValues(path); // sempre pega o valor atualizado

        if (typeof rawValue === "string") {
            const sanitizedValue = rawValue.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""); // mantém letras com acento e espaços

            if (rawValue !== sanitizedValue) {
                form.setValue(path, sanitizedValue);
            }
        }
    }, [form.getValues(`families[${familyIndex}].nomeCompletoEntrevistado`), form, familyIndex]);

    useEffect(() => {

        const subscription = form.watch((values, { name }) => {
            const responsavel = values?.families?.[familyIndex]?.responsavel;
            const pessoaEmancipada = values?.families?.[familyIndex]?.pessoaEmancipada;
            
            const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;  
            const pathEmancipada = `families[${familyIndex}].pessoaEmancipada`;  
            if (name === `families[${familyIndex}].responsavel`) {
               
                form.setValue(pathNascimento, '');
                form.setValue(pathEmancipada, '');
                
                // NÃO chama se responsavel for "sim" e pessoaEmancipada for "não"
                const isTrava = responsavel === "sim" && pessoaEmancipada === "nao";

                if (!isTrava) {
                    const fakeEvent = {
                        target: {
                            value: responsavel
                        }
                    } as React.ChangeEvent<HTMLSelectElement>;

                    onChangeMostrarSecoes(fakeEvent);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form, familyIndex, onChangeMostrarSecoes]);

    useEffect(() => {
        const subscription = form.watch((values, { name }) => {
            const responsavel = values?.families?.[familyIndex]?.responsavel;
            const pessoaEmancipada = values?.families?.[familyIndex]?.pessoaEmancipada;
            // Verifica se o campo 'responsavel' foi alterado e se o valor é "sim"
            if (name === `families[${familyIndex}].pessoaEmancipada` && pessoaEmancipada === "sim" && responsavel === "sim") {
                const fakeEvent = {
                    target: {
                        value: pessoaEmancipada
                    }
                } as React.ChangeEvent<HTMLSelectElement>;
                onChangeMostrarSecoes(fakeEvent);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, familyIndex, onChangeMostrarSecoes]);

    useEffect(() => {

        if (formValues.naoSeAplicaEntrevistado) {
            const nomeResponsavel = form.getValues(`families[${familyIndex}].nomeSocialEntrevistado`);
            if (nomeResponsavel) {
                form.setValue(`families[${familyIndex}].nomeSocialEntrevistado`, "");
            }
        }
    }, [formValues.naoSeAplicaEntrevistado, form, familyIndex]);

    useEffect(() => {
        // Só roda se dataNascimento estiver definida e no formato correto YYYY-MM-DD
        if (typeof dataNascimento === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
            const idade = calcularIdade(dataNascimento);
            form.setValue(`families[${familyIndex}].idadeResp`, idade, { shouldValidate: true });
        } else {
            form.setValue(`families[${familyIndex}].idadeResp`, "", { shouldValidate: false });
        }
    }, [dataNascimento, familyIndex, form.setValue]);

    useEffect(() => {

        // Chamada direta no início do useEffect
        validarDataNascimento(dataNascimento, familyIndex, form.setValue);

        let timeoutId: ReturnType<typeof setTimeout> | null = null; // Tipagem correta para timeoutId
        const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;
        const pathPessoaEmancipada = `families[${familyIndex}].pessoaEmancipada`;
        const pathCertidao = `families[${familyIndex}].certidaoEmancipacao`;
        const responsavel = `families[${familyIndex}].responsavel`;

        const validate = () => {
            const rawDate = form.getValues(pathNascimento);

            // Só valida quando completo (DD/MM/YYYY)
            if (!rawDate || rawDate.length !== 10) {
                form.clearErrors(pathNascimento);
                return;
            }

            const [day, month, year] = rawDate.split('/');
            const birthDate = new Date(`${year}-${month}-${day}`);
            const today = new Date();

            if (isNaN(birthDate.getTime())) return;

            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

            const isEmancipated = (
                form.getValues(pathPessoaEmancipada)?.toLowerCase() === 'sim' &&
                form.getValues(pathCertidao)
            );

            // Validação para 16-17 anos
            if ((age === 16 || age === 17) && !isEmancipated) {
                form.setError(pathNascimento, {
                    type: 'manual',
                    message: 'O(a) adolescente informado(a) não é emancipado(a). O cadastro não pode ser realizado.',
                });
                const responsavelValue = form.getValues(responsavel)?.toLowerCase();
                // Verifica se o responsável é "sim"
                if (responsavelValue === 'sim') {
                    const pessoaEmancipada = 'nao';
                    if (typeof pessoaEmancipada === 'string') {
                        const fakeEvent = {
                            target: {
                                name: pathPessoaEmancipada,
                                value: pessoaEmancipada,
                            },
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChangeMostrarSecoes(fakeEvent);
                    }
                }
            }
            // Validação para <16 anos (com alerta)
            else if (age < 16) {
                form.setError(pathNascimento, {
                    type: 'manual',
                    message: 'Idade mínima: 16 anos',
                });

                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    Swal.fire({
                        title: 'Idade inválida',
                        text: 'A(o) criança/adolescente informado(a) tem menos de 16 anos. O cadastro não pode ser realizado.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Corrigir data',
                        cancelButtonText: 'Continuar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    }).then((result) => {
                        const responsavelValue = form.getValues(responsavel)?.toLowerCase();

                        if (result.isConfirmed) {

                            // Limpa o campo da data e remove erros
                            form.setValue(pathNascimento, '');
                            form.clearErrors(pathNascimento);

                            // Verifica se o responsável é "sim"
                            if (responsavelValue !== 'nao') {
                                const pessoaEmancipada = 'sim';
                                if (typeof pessoaEmancipada === 'string') {
                                    const fakeEvent = {
                                        target: {
                                            name: pathPessoaEmancipada,
                                            value: pessoaEmancipada,
                                        },
                                    } as React.ChangeEvent<HTMLSelectElement>;
                                    onChangeMostrarSecoes(fakeEvent);
                                }
                            }

                        } else {
                            form.clearErrors(pathNascimento);
                            // Verifica se o responsável é "sim"
                            if (responsavelValue !== 'nao') {
                                const pessoaEmancipada = 'nao';
                                if (typeof pessoaEmancipada === 'string') {
                                    const fakeEvent = {
                                        target: {
                                            name: pathPessoaEmancipada,
                                            value: pessoaEmancipada,
                                        },
                                    } as React.ChangeEvent<HTMLSelectElement>;
                                    onChangeMostrarSecoes(fakeEvent);
                                }
                            }
                        }
                    });
                }, 600); // Delay maior para garantir que o usuário terminou de digitar
            } else {
                form.clearErrors(pathNascimento);
                // Não redefine o valor de pessoaEmancipada
                const responsavelValue = form.getValues(responsavel)?.toLowerCase();
                // Verifica se o responsável é "sim"
                if (responsavelValue === 'sim') {
                    const pessoaEmancipada = 'sim';
                    if (typeof pessoaEmancipada === 'string') {
                        const fakeEvent = {
                            target: {
                                name: pathPessoaEmancipada,
                                value: pessoaEmancipada,
                            },
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChangeMostrarSecoes(fakeEvent);
                    }
                }
            }
        };

        // Adiciona debounce de 300ms para múltiplos watchers
        const debouncedValidate = setTimeout(validate, 300);

        return () => {
            clearTimeout(debouncedValidate);
            if (timeoutId) clearTimeout(timeoutId);
        };

    }, [
        form.watch(`families[${familyIndex}].dataNascimentoResp`),
        form.watch(`families[${familyIndex}].pessoaEmancipada`),
        form.watch(`families[${familyIndex}].certidaoEmancipacao`)
    ]);
    
    useEffect(() => {

        const pathPessoaEmancipada = `families[${familyIndex}].pessoaEmancipada`;
        const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;

        const validateEmancipation = () => {
            if (alertAberto.current || alertShown) return; // evita abrir múltiplos alertas

            const resposta = form.getValues(pathPessoaEmancipada)?.toLowerCase();

            if (resposta === 'nao') {
                alertAberto.current = true;
                setAlertShown(true); // Marca que o alerta foi exibido

                Swal.fire({

                    title: 'Atenção',
                    text: 'Pessoas com 16 ou 17 anos sem emancipação não podem preencher esse cadastro.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Corrigir data',
                    cancelButtonText: 'Continuar',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then((result) => {
                    alertAberto.current = false;
                    setAlertShown(false); // Reseta o estado após o alerta ser fechado

                    if (result.isConfirmed) {
                        const pessoaEmancipada = 'sim';
                        if (typeof pessoaEmancipada === 'string') {
                            const fakeEvent = {
                                target: {
                                    name: pathPessoaEmancipada,
                                    value: pessoaEmancipada,
                                },
                            } as React.ChangeEvent<HTMLSelectElement>;
                            onChangeMostrarSecoes(fakeEvent);
                        }
                        
                        form.setValue(pathNascimento, '');
                        form.setValue(pathPessoaEmancipada, '');

                    }
                    else {
                        form.clearErrors(pathNascimento);
                        // Não redefine o valor de pessoaEmancipada
                        const pessoaEmancipada = form.getValues(pathPessoaEmancipada);

                        if (typeof pessoaEmancipada === 'string') {
                            const fakeEvent = {
                                target: {
                                    name: pathPessoaEmancipada,
                                    value: pessoaEmancipada,
                                },
                            } as React.ChangeEvent<HTMLSelectElement>;

                            onChangeMostrarSecoes(fakeEvent);
                        }
                    }
                });
            }
        };

        const subscription = form.watch((_, { name }) => {
            if (name === pathPessoaEmancipada) {
                const currentValue = form.getValues(pathPessoaEmancipada);
                if (currentValue !== undefined) {
                    validateEmancipation();
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [familyIndex, form, onChangeMostrarSecoes, alertShown]);


    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}
                        </h4>
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
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default IdentRespForm;
