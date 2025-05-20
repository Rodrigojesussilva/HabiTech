import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/arrolamento/definitions/pessoaDef.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface PessoaDefFormProps {
  id?: string;
  sectionIndex?: number;
  familyIndex: number;
}

const PessoaDefForm = ({ sectionIndex, familyIndex }: PessoaDefFormProps) => {
  const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
  const form = useFormContext();

  // useWatch para garantir reatividade nas mudanças
  const formValues = useWatch({
    control: form.control,
    name: `families[${familyIndex}]`,
  }) || {};

  const formSections = getMergedFormSections(formValues);
  const sectionNumber = sectionIndex ?? 0;

  // Forçar reatividade no FormSectionRenderer
  const reactiveKey = JSON.stringify({
    paisOrigem: formValues.paisOrigem || "",
    documentacao: formValues.documentacao || "",
    tipos: formValues.tiposDeficiencia || [],
    tecnologias: formValues.tecnologiasAssistivas || [],
    responsavel: formValues.responsavelTemDeficiencia || "",
  });

  return (
    <div className="text-left">
      <Collapsible
        open={mostrarIdentificacao}
        onOpenChange={setMostrarIdentificacao}
      >
        <CollapsibleTrigger asChild>
          <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
            <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
              {`Seção ${sectionNumber + 1} - ${formSections[0].title}`}
            </h4>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {formSections.map((section, sectionIndex) => (
            <FormSectionRenderer
              key={`${section.id}-${reactiveKey}`} // chave reativa com campos monitorados
              section={section}
              formControl={form.control}
              getFieldNumber={(_, fieldIndex) => `${sectionNumber + 1}.${fieldIndex + 1}`}
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
