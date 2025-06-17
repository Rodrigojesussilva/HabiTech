import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections, situUsoUniDefinition
} from "@/components/forms/arrolamento/definitions/situUsoUni.definition";
import { ensureValidSelectValue, formatCurrency, formatarTelefone } from "@/components/forms/arrolamento/helpers/situUsoUni.helper";


// Import FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface SituUsoUniFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const SituUsoUniForm = ({ sectionIndex: sectionNumber, familyIndex }: SituUsoUniFormProps) => {
    const [mostrarSituacaoUso, setMostrarSituacaoUso] = useState(false);

    const form = useFormContext();

    // Get form values for conditional logic
    const formValues = (() => {
        try {
            return form.watch(`families[${familyIndex}]`) || {};
        } catch (err) {
            console.error("Erro ao acessar form values:", err);
            return {};
        }
    })();

  useEffect(() => {
    const nsiValor = formValues.nsi_valor_locacao;
    const valorLocacao = formValues?.valor_locacao;
    const campoPath = `families[${familyIndex}].valor_locacao`;
    const current = form.getValues(campoPath);

    if (nsiValor) {
        if (current) {
            form.setValue(campoPath, "");
        }
    } else if (valorLocacao !== undefined && valorLocacao !== null) {
        const formatted = formatCurrency(valorLocacao);
        if (formatted !== current) {
            form.setValue(campoPath, formatted, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }
}, [formValues.nsi_valor_locacao, formValues?.valor_locacao, familyIndex, form]);


    useEffect(() => {
        if (formValues.tempoMoradiaNaoSabe) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].tempoMoradiaAnos`);


            if (email) {
                form.setValue(`families[${familyIndex}].tempoMoradiaAnos`, "");

            }
        }
    }, [formValues.tempoMoradiaNaoSabe, form, familyIndex]);

    useEffect(() => {
        if (formValues.tempoMoradiaNaoSabe1) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].tempoMoradiaMeses`);


            if (email) {
                form.setValue(`families[${familyIndex}].tempoMoradiaMeses`, "");

            }
        }
    }, [formValues.tempoMoradiaNaoSabe1, form, familyIndex]);

    

    useEffect(() => {
        if (formValues.nsi_contato_proprietario) {
            // Verifica se os valores já não estão vazios antes de setar
            const email = form.getValues(`families[${familyIndex}].contato_proprietario`);


            if (email) {
                form.setValue(`families[${familyIndex}].contato_proprietario`, "");

            }
        }
    }, [formValues.nsi_contato_proprietario, form, familyIndex]);

    useEffect(() => {
        const valor = formValues.contato_proprietario;
        if (valor) {
            const formatted = formatarTelefone(valor);
            if (formatted !== valor) {
                form.setValue(`families[${familyIndex}].contato_proprietario`, formatted);
            }
        }
    }, [
        formValues.contato_proprietario,
        familyIndex,
        form
    ]);

    // Get merged form sections with conditional fields included
    const formSections = (() => {
        try {
            // Certifique-se de que os valores passados para getMergedFormSections são válidos
            const safeFormValues = { ...formValues };

            // Garantir que todos os campos select tenham valores válidos
            const selectFields = ['regime_ocupacao', 'separaResiduos', 'cozinhaCompartilhada',
                'banheiroCompartilhado', 'contrato_locacao', 'documentoComprovacao',
                'destinoReciclavel', 'destinoOrganico', 'destinoDomestico'];

            selectFields.forEach(field => {
                if (field in safeFormValues) {
                    safeFormValues[field] = ensureValidSelectValue(safeFormValues[field]);
                }
            });

            const sections = getMergedFormSections(safeFormValues);
            return sections;
        } catch (err) {
            console.error("Erro ao obter as seções do formulário:", err);
            return [situUsoUniDefinition.sections[0]]; // Fallback para seção básica
        }
    })();


    return (
        <div className="text-left">
            <Collapsible open={mostrarSituacaoUso} onOpenChange={setMostrarSituacaoUso}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 3} - Situação e Uso da Unidade`}
                        </h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {Array.isArray(formSections) && formSections.length > 0 && formSections[0].fields && (
                        formSections.map((section, sectionIndex) => (
                            <FormSectionRenderer
                                key={section.id}
                                section={section}
                                formControl={form.control}
                                getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 3}.${fieldIndex + 1}`}
                                sectionIndex={sectionIndex}
                                formValues={formValues}
                                showSectionLabel={false}
                                familyIndex={familyIndex}
                            />
                        ))
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default SituUsoUniForm; 