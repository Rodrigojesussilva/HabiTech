import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/identResp.definition";
import {  calcularIdade } from "@/components/forms/arrolamento/helpers/identResp.helper";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const IdentRespForm = ({  sectionIndex: sectionNumber, familyIndex }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(true);

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    const formSections = getMergedFormSections(formValues);
    
     useEffect(() => {
        if (formValues.naoSeAplicaEntrevistado) {
            // Verifica se os valores já não estão vazios antes de setar
            const nomeResponsavel = form.getValues(`families[${familyIndex}].nomeSocialEntrevistado`);
           
    
            if (nomeResponsavel) {
                form.setValue(`families[${familyIndex}].nomeSocialEntrevistado`, "");
               
            }
        }
    }, [formValues.naoSeAplicaEntrevistado, form, familyIndex]);
    
    useEffect(() => {
        const dataNascimento = formValues.dataNascimentoResp;
        if (dataNascimento) {
            const idade = calcularIdade(dataNascimento);
            form.setValue(`families[${familyIndex}].idadeResp`, idade);
        }
    }, [formValues.dataNascimentoResp]);

    // Get merged form sections with conditional fields included
   

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

export default IdentRespForm; 