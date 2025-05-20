import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/selagem/definitions/identUnidade.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface InfoContatoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const InfoContatoForm = ({ sectionIndex: sectionNumber, familyIndex }: InfoContatoFormProps) => {
    const [mostrarContato, setMostrarContato] = useState(false);
    const form = useFormContext();
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].uf`, "SP");
        }
    }, []);

    useEffect(() => {
        const currentUf = form.getValues(`families[${familyIndex}].uf`);
        if (!currentUf) {
            form.setValue(`families[${familyIndex}].cidade`, "SP");
        }
    }, []);

    useEffect(() => {
        const cep = form.watch(`families[${familyIndex}].cep`);

        if (cep) {
            // Remove todos os caracteres não numéricos
            let cepMasked = cep.replace(/\D/g, "").slice(0, 8); // Limita a 8 dígitos
            if (cepMasked.length > 5) {
                cepMasked = `${cepMasked.slice(0, 5)}-${cepMasked.slice(5)}`; // Aplica a máscara
            }

            // Atualiza o valor do campo no formulário
            form.setValue(`families[${familyIndex}].cep`, cepMasked);
        }
    }, [form.watch(`families[${familyIndex}].cep`)]); 

    useEffect(() => {
        // Garante valor inicial do checkbox 'responsavel_nao_identificado'
        if (formValues.naoAplica === undefined) {
            form.setValue(`families[${familyIndex}].naoAplica`, false);
        }
        
    }, [
        formValues.naoAplica,   
        form,
        familyIndex
    ]);

    useEffect(() => {
        if (formValues.naoAplica) {
            // Verifica se os valores já não estão vazios antes de setar
            const nomeResponsavel = form.getValues(`families[${familyIndex}].cep`);
           
    
            if (nomeResponsavel) {
                form.setValue(`families[${familyIndex}].cep`, "");
               
            }
        }
    }, [formValues.naoAplica, form, familyIndex]);

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

export default InfoContatoForm;
