import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/infoContato.definition";
import { formatarTelefoneAuto } from "@/components/forms/arrolamento/helpers/infoContato.helper";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
import Swal from 'sweetalert2';

interface InfoContatoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const InfoContatoForm = ({ sectionIndex: sectionNumber, familyIndex }: InfoContatoFormProps) => {

    const [mostrarContato, setMostrarContato] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const email = form.watch(`families[${familyIndex}].email`);
    const naoSabeEmail = form.watch(`families[${familyIndex}].naoSabeEmail`);
    
    const prevValuesRef = useRef<{ [key: string]: any }>({
        email: email,
        // outros campos se necessário
    });
    //auxilia a fetchData
    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos)
    };

    const fetchData = async () => {
        const seiFromStorageRaw = localStorage.getItem("seiNumber");
        const seiFromStorage = Number(seiFromStorageRaw);

        const hasEmailError = validateEmailField();
        if (hasEmailError) {
            showWarningMessage("Preencha todos os campos obrigatórios do responsável");
            return;
        }

        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchArrolamento(request);

            if (!response || (typeof response === "object" && Object.keys(response).length === 0)) {
                showErrorMessage("Nenhum Arrolamento Cadastrado");
                return;
            }

            if (isGetArrolamentoResponse(response)) {
                await handleContatoResponse(response);
            }

        } catch (error) {
            console.error("Erro ao buscar arrolamentos:", error);
            showErrorMessage("Erro ao buscar dados do arrolamento");
        }
    };

    const validateEmailField = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;

        if (!naoSabeEmail) {
            if (!email) {
                form.setError(`families.${familyIndex}.email`, {
                    type: "manual",
                    message: "Informe o email ou marque 'Não se aplica'.",
                });
                hasError = true;
            } else if (!emailRegex.test(email)) {
                form.setError(`families.${familyIndex}.email`, {
                    type: "manual",
                    message: "Informe um e-mail válido.",
                });
                hasError = true;
            } else {
                form.clearErrors(`families.${familyIndex}.email`);
            }
        } else {
            form.clearErrors(`families.${familyIndex}.email`);
        }

        return hasError;
    };

    const showWarningMessage = (message: string) => {
        Swal.fire({
            position: "top-end",
            icon: "warning",
            html: `<div class="text-lg text-center break-words w-full -translate-y-2">${message}</div>`,
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
            },
        });
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

    const handleContatoResponse = async (response: any) => {
        const arrolamento = response.arrolamentos?.[0];
        if (arrolamento) {
            const arrolamentoId = arrolamento.id;
            const criadoPor = arrolamento.created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            const formPayload = {
                created_by: criadoPor,
                form: {
                    family_index: 1,
                    contato: {
                        email: email,
                    },
                },
            };

            try {
                await survey_resource.SendFormToArrolamentoContato(SURVEY_RESOURCE_URL, arrolamentoId, formPayload);
                //showSuccessMessage("Informações de contato cadastradas com sucesso");
            } catch (error) {
                console.error("Erro ao enviar formulário:", error);
                showErrorMessage("Erro ao enviar os dados");
            }
        }
    };

    useEffect(() => {
        const handleBlur = () => {
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fieldName = `families.${familyIndex}.email`;
            const prevEmail = prevValuesRef.current["email"];
            const currentEmail = email;

            const emailFieldChanged = currentEmail !== prevEmail && activeFieldName !== fieldName;

            if (emailFieldChanged) {
                prevValuesRef.current["email"] = currentEmail;

                const questionario = localStorage.getItem("questionario");
                const seiNumber = localStorage.getItem("seiNumber");
                const sealNumber = localStorage.getItem("sealNumber");
                const numberFamilies = localStorage.getItem("numberFamilies");

                console.log("questionario:", questionario);
                console.log("seiNumber:", seiNumber);
                console.log("sealNumber:", sealNumber);
                console.log("numberFamilies:", numberFamilies);

                fetchData();
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [email, familyIndex]);

    // Initialize telefones array if it doesn't exist
    useEffect(() => {
        const currentTelefones = form.getValues(`families[${familyIndex}].telefones`);
        if (!currentTelefones || !Array.isArray(currentTelefones) || currentTelefones.length === 0) {
            form.setValue(`families[${familyIndex}].telefones`, [{ numero: "", isWhatsApp: false }]);
        }
    }, []);

    useEffect(() => {
        const phoneFields = [
            'telefone1',
            'telefone2',
            'telefone3',
            'telefone4',
        ];

        phoneFields.forEach(field => {
            const valor = formValues[field];
            if (valor) {
                const formatted = formatarTelefoneAuto(valor);
                if (formatted !== valor) {
                    form.setValue(`families[${familyIndex}].${field}`, formatted);
                }
            }
        });
    }, [
        formValues.telefone1,
        formValues.telefone2,
        formValues.telefone3,
        formValues.telefoneResidencial,
        formValues.telefoneRecado,
        formValues.telefoneComercial,
        familyIndex,
        form
    ]);

    useEffect(() => {
        // Garante valor inicial do checkbox 'responsavel_nao_identificado'
        if (formValues.naoSabeEmail === undefined) {
            form.setValue(`families[${familyIndex}].naoSabeEmail`, false);
        }

    }, [
        formValues.naoSabeEmail,
        form,
        familyIndex
    ]);

    useEffect(() => {
        // Garante valor inicial do checkbox 'responsavel_nao_identificado'
        if (formValues.naoSabeTelefoneComercial === undefined) {
            form.setValue(`families[${familyIndex}].naoSabeTelefoneComercial`, false);
        }

    }, [
        formValues.naoSabeTelefoneComercial,
        form,
        familyIndex
    ]);

    useEffect(() => {
        if (formValues.naoSabeEmail) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].email`);


            if (email) {
                form.setValue(`families[${familyIndex}].email`, "");

            }
        }
    }, [formValues.naoSabeEmail, form, familyIndex]);


    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

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
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 2}.${fieldIndex + 1}`}
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

export default InfoContatoForm; 