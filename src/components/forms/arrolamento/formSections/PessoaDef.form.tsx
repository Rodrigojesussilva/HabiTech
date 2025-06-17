import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/pessoaDef.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
interface PessoaDefFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const PessoaDefForm = ({ sectionIndex: sectionNumber, familyIndex }: PessoaDefFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    useEffect(() => {
        
        const currentValueFisica = form.getValues(`families[${familyIndex}].quantFisica`);
        const currentValueVisual = form.getValues(`familVisualies[${familyIndex}].quantVisual`);
        const currentValueAuditiva = form.getValues(`familVisualies[${familyIndex}].quantAuditiva`);
        const currentValueIntelectual = form.getValues(`families[${familyIndex}].quantIntelectual`);
        const currentValueMultiplas = form.getValues(`families[${familyIndex}].quantMultiplas`);
        const currentValueMobilidade = form.getValues(`families[${familyIndex}].quantMobilidade`);
        const currentValueSurdo = form.getValues(`families[${familyIndex}].quantSurdo`);

        if (currentValueFisica === undefined || currentValueFisica === null) {
            form.setValue(`families[${familyIndex}].quantFisica`, 1); // ou o valor padrão desejado
        }
        if (currentValueVisual === undefined || currentValueVisual === null) {
            form.setValue(`families[${familyIndex}].quantVisual`, 1); // ou o valor padrão desejado
        }
        if (currentValueAuditiva === undefined || currentValueAuditiva === null) {
            form.setValue(`families[${familyIndex}].quantAuditiva`, 1); // ou o valor padrão desejado
        }
        if (currentValueIntelectual === undefined || currentValueIntelectual === null) {
            form.setValue(`families[${familyIndex}].quantIntelectual`, 1); // ou o valor padrão desejado
        }
        if (currentValueMultiplas === undefined || currentValueMultiplas === null) {
            form.setValue(`families[${familyIndex}].quantMultiplas`, 1); // ou o valor padrão desejado
        }
        if (currentValueMobilidade === undefined || currentValueMobilidade === null) {
            form.setValue(`families[${familyIndex}].quantMobilidade`, 1); // ou o valor padrão desejado
        }
        if (currentValueSurdo === undefined || currentValueSurdo === null) {
            form.setValue(`families[${familyIndex}].quantSurdo`, 1); // ou o valor padrão desejado
        }
    }, []);


    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
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

export default PessoaDefForm; 