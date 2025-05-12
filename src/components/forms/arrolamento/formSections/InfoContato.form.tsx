import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/infoContato.definition";
import { formatarTelefone } from "@/components/forms/arrolamento/helpers/infoContato.helper";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface InfoContatoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const InfoContatoForm = ({ sectionIndex: sectionNumber, familyIndex }: InfoContatoFormProps) => {
    const [mostrarContato, setMostrarContato] = useState(false);

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Initialize telefones array if it doesn't exist
    useEffect(() => {
        const currentTelefones = form.getValues(`families[${familyIndex}].telefones`);
        if (!currentTelefones || !Array.isArray(currentTelefones) || currentTelefones.length === 0) {
            form.setValue(`families[${familyIndex}].telefones`, [{ numero: "", isWhatsApp: false }]);
        }
    }, []);
    // Format telefone fields when they change
    useEffect(() => {
        // Format all possible phone fields
        const phoneFields = [
            'telefone1',
            'telefone2',
            'telefone3',
            'telefoneResidencial',
            'telefoneRecado',
            'telefoneComercial'
        ];

        phoneFields.forEach(field => {
            if (formValues[field]) {
                const formatted = formatarTelefone(formValues[field]);
                if (formatted !== formValues[field]) {
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
        formValues.telefoneComercial
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