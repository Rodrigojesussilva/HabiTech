import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections, situUsoUniDefinition
} from "@/components/forms/arrolamento/definitions/situUsoUni.definition";
import { formatCurrency, ensureValidSelectValue } from "@/components/forms/arrolamento/helpers/situUsoUni.helper";


// Import FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface SituUsoUniFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const SituUsoUniForm = ({ sectionIndex: sectionNumber, familyIndex }: SituUsoUniFormProps) => {
    const [mostrarSituacaoUso, setMostrarSituacaoUso] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);

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

    // Inicializar formulário apenas uma vez
    useEffect(() => {
        if (isFirstRender) {
            // Garantir que os selects tenham valores válidos para evitar erros de renderização
            try {
                // Lista de todos os campos select que precisam de valores não vazios
                const selectFields = [
                    'regime_ocupacao',
                    'cozinhaCompartilhada',
                    'banheiroCompartilhado',
                    'separaResiduos',
                    'contrato_locacao',
                    'documentoComprovacao',
                    'destinoReciclavel',
                    'destinoOrganico',
                    'destinoDomestico'
                ];
                
                // Inicializar cada campo select com um valor "select" se necessário
                selectFields.forEach(field => {
                    const currentValue = form.getValues(`families[${familyIndex}].${field}`);
                    if (currentValue === undefined || currentValue === null || currentValue === "") {
                        form.setValue(`families[${familyIndex}].${field}`, "select");
                    }
                });
            } catch (err) {
                console.error("Erro ao inicializar formulário:", err);
            }
            setIsFirstRender(false);
        }
    }, [isFirstRender, form, familyIndex]);

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
            setError(`Erro ao carregar formulário: ${err}`);
            return [situUsoUniDefinition.sections[0]]; // Fallback para seção básica
        }
    })();

    // Tratamento de erro
    if (error) {
        return (
            <div className="text-left">
                <div className="section-header bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                    <h4 className="text-xl font-semibold mb-4">
                        {`${sectionNumber ? sectionNumber + 1 : 4}. Situação e Uso da Unidade`}
                    </h4>
                    <div className="text-red-500 mt-2">{error}</div>
                </div>
            </div>
        );
    }

    // Só mostra o conteúdo se o formulário estiver pronto
    const renderContent = !isFirstRender;

    return (
        <div className="text-left">
            <Collapsible open={mostrarSituacaoUso} onOpenChange={setMostrarSituacaoUso}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`${sectionNumber ? sectionNumber + 1 : 3}. Situação e Uso da Unidade`}
                        </h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {renderContent && Array.isArray(formSections) && formSections.length > 0 && formSections[0].fields ? (
                        formSections.map((section, sectionIndex) => (
                            <FormSectionRenderer
                                key={section.id}
                                section={section}
                                formControl={form.control}
                                getFieldNumber={(sectionIndex, fieldIndex) => `${sectionIndex + 1}.${fieldIndex + 1}`}
                                sectionIndex={sectionIndex}
                                formValues={formValues}
                                showSectionLabel={false}
                                familyIndex={familyIndex}
                            />
                        ))
                    ) : (
                        <div className="p-4 border border-red-300 bg-red-50 rounded">
                            {isFirstRender ? "Carregando formulário..." : "Erro ao carregar campos do formulário."}
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default SituUsoUniForm; 