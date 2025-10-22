import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/residencial/definitions/rendaResponsaveis.definition";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";


interface RendaResponsaveisFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const RendaResponsaveisForm = ({ sectionIndex: sectionNumber, familyIndex }: RendaResponsaveisFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
 

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    const status = form.watch(`families[${familyIndex}].status`);
    const justificativa = form.watch(`families[${familyIndex}].justificativa`);
    const nomeSupervisor = form.watch(`families[${familyIndex}].nomeSupervisor`);
    const observacao = form.watch(`families[${familyIndex}].observacao`);

  



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
                    {/* 
<div className="mt-4 w-full flex justify-start">
  <button
    type="button"
    className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
    onClick={() => {
      console.log("Botão clicado!");
    }}
  >
    Salvar
  </button>
</div> 
*/}

                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default RendaResponsaveisForm; 