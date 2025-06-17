import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections, situUsoUniDefinition
} from "@/components/forms/selagem/definitions/situUsoUni.definition";
import { formatCurrency, ensureValidSelectValue, formatarTelefone } from "@/components/forms/selagem/helpers/situUsoUni.helper";


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
    // Formata apenas o campo telefone_responsavel com helper
    useEffect(() => {
        if (formValues.telefone_responsavel) {
            const formatted = formatarTelefone(formValues.telefone_responsavel);
            if (formatted !== formValues.telefone_responsavel) {
                form.setValue(`families[${familyIndex}].telefone_responsavel`, formatted);
            }
        }
    }, [formValues.telefone_responsavel]);

    useEffect(() => {
        // Garante valor inicial do checkbox 'responsavel_nao_identificado'
        if (formValues.responsavel_nao_identificado === undefined) {
            form.setValue(`families[${familyIndex}].responsavel_nao_identificado`, false);
        }

    }, [
        formValues.responsavel_nao_identificado,
        form,
        familyIndex
    ]);

    useEffect(() => {
        if (formValues.responsavel_nao_identificado) {
            // Verifica se os valores já não estão vazios antes de setar
            const nomeResponsavel = form.getValues(`families[${familyIndex}].nome_responsavel`);
            const telefoneResponsavel = form.getValues(`families[${familyIndex}].telefone_responsavel`);

            if (nomeResponsavel || telefoneResponsavel) {
                form.setValue(`families[${familyIndex}].nome_responsavel`, "");
                form.setValue(`families[${familyIndex}].telefone_responsavel`, "");
            }
        }
    }, [formValues.responsavel_nao_identificado, form, familyIndex]);

    // Format values when they change
    useEffect(() => {
        // Format currency field (only if it exists and needs formatting)
        try {
            if (formValues.valor_locacao && typeof formValues.valor_locacao === 'string' && !formValues.valor_locacao.startsWith('R$')) {
                const formatted = formatCurrency(formValues.valor_locacao);
                form.setValue(`families[${familyIndex}].valor_locacao`, formatted);
            }
        } catch (error) {
            console.error("Error formatting currency:", error);
        }
    }, [formValues.valor_locacao, form, familyIndex]);

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