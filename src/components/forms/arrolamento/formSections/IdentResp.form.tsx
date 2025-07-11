import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/arrolamento/definitions/identResp.definition";
import { calcularIdade, validarDataNascimento } from "@/components/forms/arrolamento/helpers/identResp.helper";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    // Este useEffect garante que o campo "nomeSocialEntrevistado" da família contenha apenas letras (com ou sem acento) e espaços.
    // Sempre que o valor do campo mudar, caracteres inválidos (números, símbolos, etc.) são automaticamente removidos.

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

    // Este useEffect garante que o campo "nomeCompletoEntrevistado" da família contenha apenas letras (com ou sem acento) e espaços.
    // Sempre que o valor do campo mudar, caracteres inválidos (números, símbolos, etc.) são automaticamente removidos.
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

    // Este useEffect observa mudanças no campo "responsavel" da família atual.
    // Quando o valor muda, ele simula um evento de mudança (<select>) e chama a função "onChangeMostrarSecoes",
    // permitindo que seções do formulário sejam exibidas ou ocultadas dinamicamente com base na escolha do usuário.
    useEffect(() => {
        const subscription = form.watch((values, { name }) => {
            const responsavel = values?.families?.[familyIndex]?.responsavel;
            if (name === `families[${familyIndex}].responsavel` && typeof responsavel === "string") {
                const fakeEvent = {
                    target: {
                        value: responsavel
                    }
                } as React.ChangeEvent<HTMLSelectElement>;

                onChangeMostrarSecoes(fakeEvent);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, familyIndex, onChangeMostrarSecoes]);

    // Este useEffect limpa o campo "nomeSocialEntrevistado" sempre que a opção "naoSeAplicaEntrevistado" estiver marcada (true).
    // Isso garante que, se o usuário indicar que o nome social não se aplica, qualquer valor digitado previamente seja removido.
    useEffect(() => {
        if (formValues.naoSeAplicaEntrevistado) {
            const nomeResponsavel = form.getValues(`families[${familyIndex}].nomeSocialEntrevistado`);
            if (nomeResponsavel) {
                form.setValue(`families[${familyIndex}].nomeSocialEntrevistado`, "");
            }
        }
    }, [formValues.naoSeAplicaEntrevistado, form, familyIndex]);

    // Este useEffect calcula a idade do responsável com base na data de nascimento fornecida no formato "YYYY-MM-DD".
    // Quando a data é válida, calcula a idade e atualiza o campo "idadeResp" do formulário.
    // Caso contrário, limpa o campo de idade.
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
        const pathNome = `families[${familyIndex}].nomeCompletoResp`;
        const pathNomeSocial = `families[${familyIndex}].nomeSocialEntrevistado`;

        const pathPessoaEmancipada = `families[${familyIndex}].pessoaEmancipada`;
        const pathCertidao = `families[${familyIndex}].certidaoEmancipacao`;

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
                    message: 'Responsável com 16 ou 17 anos precisa de emancipação',
                });
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
                        text: 'Crianças/Adolescente com menos de 16 anos não podem ser responsáveis.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Corrigir data',
                        cancelButtonText: 'Sair'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Limpa o campo da data e remove erros
                            form.setValue(pathNascimento, '');
                            form.setValue(pathNome, '');
                            form.setValue(pathNomeSocial, '');

                            form.clearErrors(pathNascimento);
                        } else {
                            navigate('/home');
                        }
                    });
                }, 600); // Delay maior para garantir que o usuário terminou de digitar
            } else {
                form.clearErrors(pathNascimento);
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

        const validateEmancipation = () => {
            const resposta = form.getValues(pathPessoaEmancipada)?.toLowerCase();

            if (resposta === 'não' || !resposta) {
                Swal.fire({
                    title: 'Atenção',
                    text: 'Pessoas com 16 ou 17 anos sem emancipação não podem preencher esse cadastro.',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false,
                    showCancelButton: false
                }).then(() => {
                    navigate('/home');
                });
            }
        };

        // form.watch retorna um objeto Subscription
        const subscription = form.watch((_, { name }) => {
            if (name === pathPessoaEmancipada) {
                setTimeout(() => validateEmancipation(), 0);
            }
        });

        return () => {
            // chamar unsubscribe() para cancelar a inscrição
            subscription.unsubscribe();
        };
    }, [familyIndex, form, navigate]);


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
