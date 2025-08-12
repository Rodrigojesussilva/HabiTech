import React from 'react';
import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/arrolamento/definitions/identResp.definition";
import { calcularIdade, validarDataNascimento } from "@/components/forms/arrolamento/helpers/identResp.helper";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import Swal from 'sweetalert2';


interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
    onChangeMostrarSecoes: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const IdentRespForm = ({ sectionIndex: sectionNumber, familyIndex, onChangeMostrarSecoes }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(true);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const form = useFormContext();
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues);
    const dataNascimento = form.watch(`families[${familyIndex}].dataNascimentoResp`);
    const idadeResp = form.watch(`families[${familyIndex}].idadeResp`);
    const nomeCompleto = form.watch(`families[${familyIndex}].nomeCompletoResp`);
    const responsavel = form.watch(`families[${familyIndex}].responsavel`);
    const relacaoResponsavel = form.watch(`families[${familyIndex}].relacaoResponsavel`);
    const nomeCompletoEntrevistado = form.watch(`families[${familyIndex}].nomeCompletoEntrevistado`);
    const naoSeAplicaEntrevistado = form.watch(`families[${familyIndex}].naoSeAplicaEntrevistado`);
    const nomeSocialEntrevistado = form.watch(`families[${familyIndex}].nomeSocialEntrevistado`);
    const descrevParentesco = form.watch(`families.${familyIndex}.DescrevParentesco`);
    const pessoaEmancipada = form.watch(`families.${familyIndex}.pessoaEmancipada`);
    const certidaoEmancipacao = form.watch(`families.${familyIndex}.certidaoEmancipacao`);

    const alertAberto = React.useRef(false);
    const [alertShown, setAlertShown] = useState(false);
    const triggeredByBlurRef = useRef(false);

    // 👇 Armazena os valores anteriores
    const prevValuesRef = useRef<Record<string, any>>({
        dataNascimento: dataNascimento,
        idadeResp: idadeResp,
        nomeCompleto: nomeCompleto,
        responsavel: responsavel,
        relacaoResponsavel: relacaoResponsavel,
        nomeCompletoEntrevistado: nomeCompletoEntrevistado,
        naoSeAplicaEntrevistado: naoSeAplicaEntrevistado,
        nomeSocialEntrevistado: nomeSocialEntrevistado,
        descrevParentesco: descrevParentesco,
        pessoaEmancipada: pessoaEmancipada,
        certidaoEmancipacao: certidaoEmancipacao
    });

    //auxilia a fetchData
    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos)
    }

    const fetchData = async () => {
        const seiFromStorageRaw = localStorage.getItem("seiNumber");
        const seiFromStorage = Number(seiFromStorageRaw);


        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchArrolamento(request);


            if (isGetArrolamentoResponse(response)) {
                await handleArrolamentoResponse(response);
            }

        } catch (error) {
            console.error("Erro ao buscar arrolamentos:", error);
            showErrorMessage("Erro ao buscar dados do arrolamento");
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

    const fetchArrolamento = async (request: any) => {
        return await survey_resource.GetArrolamento(request, async (req: any) => {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
                if (value !== undefined && value !== "") {
                    searchParams.append(key, String(value));
                }
            }

            const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
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

    const handleArrolamentoResponse = async (response: any) => {
        if (response.arrolamentos && response.arrolamentos.length > 0) {
            const primeiroArrolamento = response.arrolamentos[0];
            const arrolamentoId = primeiroArrolamento.id;
            const criadoPor = primeiroArrolamento.created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            const createdBy = localStorage.getItem('userEmail') || criadoPor || ''
            const token = localStorage.getItem('authToken') || ''

            const payload = {
                created_by: createdBy,
                form: {
                    family_index: 1,
                    identificacao_responsavel: createIdentificacaoResponsavel(),
                },
            };

            try {
                console.log('[Arrolamento][IdentResp] PATCH prepared:', {
                    arrolamentoId,
                    createdBy,
                    tokenPresent: !!token,
                    payload
                })
                await survey_resource.SendFormToArrolamentoIdentRep(SURVEY_RESOURCE_URL, arrolamentoId, payload as any, token);
                console.log('[Arrolamento][IdentResp] PATCH success')
            } catch (error) {
                console.error("[Arrolamento][IdentResp] PATCH error:", error);
                showErrorMessage("Erro ao enviar os dados");
            }
        }
    };

    const createIdentificacaoResponsavel = () => {
        const valorResponsavel = (responsavel || "").trim().toLowerCase();
        const valorEmancipado = (pessoaEmancipada || "").trim().toLowerCase();
        const isResponsavel = valorResponsavel === "sim";
        const isEmancipado = valorEmancipado === "sim";

        const formatarDataParaBR = (data: string): string => {
            if (!data) return "";
            const [ano, mes, dia] = data.split("-");
            return `${dia}/${mes}/${ano}`;
        };

        return {
            responsavel: isResponsavel,
            nome_completo: nomeCompleto || "",
            data_nascimento: formatarDataParaBR(dataNascimento),
            relacao_social: isResponsavel ? "" : relacaoResponsavel,
            nome_social: nomeSocialEntrevistado || "",
            nome_social_aplicavel: isResponsavel ? false : !!naoSeAplicaEntrevistado,
            nome_completo_entrevistado: isResponsavel ? "" : nomeCompletoEntrevistado || "",
            descrev_parentesco: isResponsavel ? "" : descrevParentesco || "",
            pessoa_emancipada: isEmancipado,
            certidao_emancipacao: certidaoEmancipacao,
            idade: parseInt(idadeResp || "0", 10),
        };
    };

    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const response = await fetchArrolamento(request);

            const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);

            return !isEmpty;
        } catch (error) {
            console.error("Erro ao verificar arrolamentos:", error);
            return false;
        }
    };

    useEffect(() => {

        const handleBlur = async () => {
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                [`families[${familyIndex}].dataNascimentoResp`]: dataNascimento,
                [`families[${familyIndex}].idadeResp`]: idadeResp,
                [`families[${familyIndex}].nomeCompletoResp`]: nomeCompleto,
                [`families[${familyIndex}].responsavel`]: responsavel,
                [`families[${familyIndex}].relacaoResponsavel`]: relacaoResponsavel,
                [`families[${familyIndex}].nomeCompletoEntrevistado`]: nomeCompletoEntrevistado,
                [`families[${familyIndex}].naoSeAplicaEntrevistado`]: naoSeAplicaEntrevistado,
                [`families[${familyIndex}].nomeSocialEntrevistado`]: nomeSocialEntrevistado,
                [`families.${familyIndex}.DescrevParentesco`]: descrevParentesco,
                [`families.${familyIndex}.DescrevParentesco`]: pessoaEmancipada,
                [`families.${familyIndex}.DescrevParentesco`]: certidaoEmancipacao,
            };

            let shouldFetch = false;

            for (const [fieldName, currentValue] of Object.entries(fields)) {
                const prevValue = prevValuesRef.current[fieldName.split(".").pop() || ""];

                if (currentValue !== prevValue && activeFieldName !== fieldName) {
                    shouldFetch = true;
                    prevValuesRef.current[fieldName.split(".").pop() || ""] = currentValue;
                }
            }

            if (shouldFetch) {
                const seiNumber = localStorage.getItem("seiNumber");
                const request = {
                    numero_sei: Number(seiNumber),
                    initial_date: initialDate,
                    end_date: endDate,
                };

                const hasData = await hasArrolamento(request); // ✅ uso aqui da função externa

                if (!hasData) {
                    console.log("Nenhum Arrolamento Cadastrado");
                    return;
                }

                // Só chama se tiver arrolamento
                triggeredByBlurRef.current = true;
                fetchData();
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        dataNascimento,
        idadeResp,
        nomeCompleto,
        responsavel,
        relacaoResponsavel,
        nomeCompletoEntrevistado,
        naoSeAplicaEntrevistado,
        nomeSocialEntrevistado,
        descrevParentesco,
        pessoaEmancipada,
        certidaoEmancipacao
    ]);

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
            const pathRelacaoResponsavel = `families[${familyIndex}].relacaoResponsavel`;
            const pathNomeCompletoResp = `families[${familyIndex}].nomeCompletoResp`;
            const pathNomeCompletoEntrevistado = `families[${familyIndex}].nomeCompletoEntrevistado`;
            const pathNomeSocialEntrevistado = `families[${familyIndex}].nomeSocialEntrevistado`;
            const pathDescrevParentesco = `families[${familyIndex}].DescrevParentesco`;
            const pathCertidaoEmancipacao = `families[${familyIndex}].certidaoEmancipacao`;



            if (name === `families[${familyIndex}].responsavel`) {

                form.setValue(pathNascimento, '');
                form.setValue(pathEmancipada, '');
                form.setValue(pathRelacaoResponsavel, '');
                form.setValue(pathNomeCompletoResp, '');
                form.setValue(pathNomeCompletoEntrevistado, '');
                form.setValue(pathNomeSocialEntrevistado, '');
                form.setValue(pathDescrevParentesco, '');
                form.setValue(pathCertidaoEmancipacao, '');



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
