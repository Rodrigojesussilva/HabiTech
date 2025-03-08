import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    identRespDefinition
} from "@/components/forms/arrolamento/definitions/identResp.definition";
import { getConditionalFields, calcularIdade } from "@/components/forms/arrolamento/helpers/identResp.helper";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const IdentRespForm = ({  sectionIndex: sectionNumber, familyIndex }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Update age when date of birth changes
    useEffect(() => {
        const dataNascimento = formValues.dataNascimentoResp;
        if (dataNascimento) {
            const idade = calcularIdade(dataNascimento);
            form.setValue(`families[${familyIndex}].idadeResp`, idade);
        }
    }, [formValues.dataNascimentoResp]);

    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);

    // Create a merged form structure with base fields and conditional fields
    const formSections = [
        {
            ...identRespDefinition.sections[0],
            fields: [
                ...identRespDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];

    return (
        <div className="text-left">

           
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`${sectionNumber ? sectionNumber + 1 : 1}. ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formSections.map((section, sectionIndex) => (
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
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default IdentRespForm; 