import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/infoFamilia.definition";
import {
    formatCurrency,
    formatarNumeroComDoisDecimais
} from "@/components/forms/arrolamento/helpers/infoFamilia.helper";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { API_BASE_URL } from "../../../../service/constants"


interface InfoFamiliaFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}
const InfoFamiliaForm = ({ sectionIndex: sectionNumber, familyIndex }: InfoFamiliaFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Get merged form sections with conditional fields included
    let formSections = getMergedFormSections(formValues);
    const totalPessoas = form.watch(`families[${familyIndex}].totalPessoas`);
    const rendaFamiliar = form.watch(`families[${familyIndex}].rendaFamiliar`);
    const criancas0a3 = form.watch(`families[${familyIndex}].criancas0a3`);
    const criancas4a6 = form.watch(`families[${familyIndex}].criancas4a6`);
    const criancas7a11 = form.watch(`families[${familyIndex}].criancas7a11`);
    const adolescentes12a18 = form.watch(`families[${familyIndex}].adolescentes12a18`);
    const adultos19a59 = form.watch(`families[${familyIndex}].adultos19a59`);
    const idosos60 = form.watch(`families[${familyIndex}].idosos60`);
    const pessoasComDeficienciaCronica = form.watch(`families[${familyIndex}].pessoasComDoencasCronicas`);
    const gestantes = form.watch(`families[${familyIndex}].gestantes`);
    const pessoasImigrantes = form.watch(`families[${familyIndex}].pessoasImigrantes`);



    const triggeredByBlurRef = useRef(false);

    const prevValuesRef = useRef<Record<string, any>>({
        totalPessoas,
        rendaFamiliar,
        criancas0a3,
        criancas4a6,
        criancas7a11,
        adolescentes12a18,
        adultos19a59,
        idosos60,
        pessoasComDeficienciaCronica,
        gestantes,
        pessoasImigrantes,
    });

    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos);
    };

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
                await handleInformacaoFamiliaResponse(response);
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

            const url = `${API_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
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

    const handleInformacaoFamiliaResponse = async (response: any) => {
        const arrolamento = response.arrolamentos?.[0];
        if (arrolamento) {
            const arrolamentoId = arrolamento.id;
            const criadoPor = arrolamento.created_by;

            localStorage.setItem("arrolamentoId", arrolamentoId);
            localStorage.setItem("arrolamentoCreated_by", criadoPor);

            // 🔢 Calcula total_pessoas dinamicamente
            const total_pessoas =
                Number(criancas0a3 || 0) +
                Number(criancas4a6 || 0) +
                Number(criancas7a11 || 0) +
                Number(adolescentes12a18 || 0) +
                Number(adultos19a59 || 0) +
                Number(idosos60 || 0);

            const payload = {
                created_by: criadoPor,
                form: {
                    family_index: 1,
                    informacao_familia: {
                        total_pessoas: total_pessoas,
                        renda_familiar: rendaFamiliar,
                        criancas_0a3: Number(criancas0a3),
                        criancas_4a6: Number(criancas4a6),
                        criancas_7a11: Number(criancas7a11),
                        adolescentes_12a18: Number(adolescentes12a18),
                        adultos_19a59: Number(adultos19a59),
                        idosos_60: Number(idosos60),
                        pessoas_com_deficiencia_cronica: Number(pessoasComDeficienciaCronica),
                        gestantes: Number(gestantes),
                        pessoas_imigrantes: Number(pessoasImigrantes),
                        nacionalidades_imigrantes: 0, // ajuste se necessário
                        nao_sabe_informar: true,
                        nao_tem_informacao: true,
                    },
                },
            };

            try {
                console.log("Payload Informacao Familia:", JSON.stringify(payload, null, 2));
                await survey_resource.SendFormToArrolamentoInformacaoFamilia(API_BASE_URL, arrolamentoId, payload);
            } catch (error) {
                console.error("Erro ao enviar dados de informacao_familia:", error);
                showErrorMessage("Erro ao enviar os dados da família");
            }
        }
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
                totalPessoas,
                rendaFamiliar,
                criancas0a3,
                criancas4a6,
                criancas7a11,
                adolescentes12a18,
                adultos19a59,
                idosos60,
                pessoasComDeficienciaCronica,
                gestantes,
                pessoasImigrantes,
            };

            let shouldFetch = false;

            for (const [fieldName, currentValue] of Object.entries(fields)) {
                const prevValue = prevValuesRef.current[fieldName];

                if (currentValue !== prevValue && activeFieldName !== fieldName) {
                    shouldFetch = true;
                    prevValuesRef.current[fieldName] = currentValue;
                }
            }

            if (shouldFetch) {
                const seiNumber = localStorage.getItem("seiNumber");
                const request = {
                    numero_sei: Number(seiNumber),
                    initial_date: initialDate,
                    end_date: endDate,
                };

                const hasData = await hasArrolamento(request);

                if (!hasData) {
                    showErrorMessage("Nenhum Arrolamento Cadastrado");
                    return;
                }

                triggeredByBlurRef.current = true;

                await fetchData(); // agora deve chamar handleInformacaoFamiliaResponse
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        totalPessoas,
        rendaFamiliar,
        criancas0a3,
        criancas4a6,
        criancas7a11,
        adolescentes12a18,
        adultos19a59,
        idosos60,
        pessoasComDeficienciaCronica,
        gestantes,
        pessoasImigrantes,
    ]);

    useEffect(() => {
        const { nacionalidadesSelecionadas = [], numerosPorPais = {} } = formValues;

        if (!nacionalidadesSelecionadas || !numerosPorPais) {
            return;
        }
        const totalImmigrants = nacionalidadesSelecionadas.reduce((total: number, pais: string) => {
            const key = pais.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
            const value = Number(numerosPorPais[key]) || 0;
            return total + value;
        }, 0);

        const currentValue = form.getValues(`families[${familyIndex}].pessoasImigrantes`);

        if (totalImmigrants !== currentValue) {
            form.setValue(`families[${familyIndex}].pessoasImigrantes`, totalImmigrants);
        }
    }, [formValues.nacionalidadesSelecionadas, formValues.numerosPorPais, familyIndex, form]);

    useEffect(() => {
        const nacionalidadesSelecionadas = form.getValues(`families[${familyIndex}].nacionalidadesSelecionadas`) || [];

        nacionalidadesSelecionadas.forEach((pais: string) => {
            const key = pais.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
            const path = `families[${familyIndex}].numerosPorPais.${key}`;
            const currentValue = form.getValues(path);

            if (currentValue === undefined || currentValue === null) {
                form.setValue(path, 1);
            }
        });
    }, [familyIndex, form]);

    // Casas decimais
    useEffect(() => {
        const campos = [
            'criancas0a3',
            'criancas4a6',
            'criancas7a11',
            'adolescentes12a18',
            'adultos19a59',
            'idosos60',
            'pessoasComDeficiencia',
            'pessoasComDoencasCronicas',
            'gestantes',
        ];

        campos.forEach(campo => {
            const valor = formValues[campo];
            if (valor !== undefined && valor !== null) {
                const formatado = formatarNumeroComDoisDecimais(valor);
                if (formatado !== valor) {
                    form.setValue(`families[${familyIndex}].${campo}`, formatado, { shouldDirty: true });
                }
            }
        });
    }, [
        formValues.criancas0a3,
        formValues.criancas4a6,
        formValues.criancas7a11,
        formValues.adolescentes12a18,
        formValues.adultos19a59,
        formValues.idosos60,
        formValues.pessoasComDeficiencia,
        formValues.pessoasComDoencasCronicas,
        formValues.gestantes,
        familyIndex,
        form
    ]);

    // Format currency when rendaFamiliar changes
    useEffect(() => {
        const renda = formValues?.rendaFamiliar;

        if (renda !== undefined && renda !== null) {
            const formatted = formatCurrency(renda);
            const current = form.getValues(`families[${familyIndex}].rendaFamiliar`);

            if (formatted !== current) {
                form.setValue(`families[${familyIndex}].rendaFamiliar`, formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        }
    }, [formValues?.rendaFamiliar, familyIndex, form]);

    const handleCountryCountChange = (country: string, count: number) => {
        const currentCounts = formValues.numerosPorPais || {};
        form.setValue(`families[${familyIndex}].numerosPorPais`, {
            ...currentCounts,
            [country]: count
        });
    };
    console.log(handleCountryCountChange);

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {/* Regular form fields using FormSectionRenderer */}
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

                    {/* Custom renderer for nationality selection */}
                    {/* Note: This part would need to be implemented using the UI components of your project */}
                    {/* 
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                            <label>Selecione as nacionalidades</label>
                            <select
                                multiple
                                className="w-full"
                                value={selectedCountries}
                                onChange={(e) => {
                                    const options = Array.from(e.target.selectedOptions, option => option.value);
                                    handleNationalityChange(options);
                                }}
                            >
                                {Object.values(countries).map(country => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedCountries.map(country => (
                            <div key={country}>
                                <label>{`Quantidade de pessoas do país: ${country}`}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formValues.numerosPorPais?.[country] || 0}
                                    onChange={(e) => handleCountryCountChange(country, parseInt(e.target.value) || 0)}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                    */}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default InfoFamiliaForm; 