import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getMergedFormSections,
} from "@/components/forms/residencial/definitions/integraçãoUrbanaSocial.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface IntegraçãoUrbanaSocialFormProps {
  sectionIndex?: number;
  familyIndex: number;
}

const IntegraçãoUrbanaSocialForm = ({
  sectionIndex: sectionNumber,
  familyIndex,
}: IntegraçãoUrbanaSocialFormProps) => {
  const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);

  const form = useFormContext();

  // ✅ Watch dos campos necessários para renderização condicional
  const servicosSelecionados = form.watch(`families[${familyIndex}].servicosSelecionados`) || [];
  const localizacao_servicos = form.watch(`families[${familyIndex}].localizacao_servicos`) || {};
  const aspectos_positivos = form.watch(`families[${familyIndex}].aspectos_positivos`) || [];
  const aspectos_negativos = form.watch(`families[${familyIndex}].aspectos_negativos`) || [];

  // ✅ Todos os valores necessários para gerar os campos condicionais
  const formValues = {
    servicosSelecionados,
    localizacao_servicos,
    aspectos_positivos,
    aspectos_negativos,
  };

  // ✅ Atualiza os campos dinamicamente com base no formulário
  const formSections = useMemo(() => {
    return getMergedFormSections(formValues);
  }, [
    servicosSelecionados,
    localizacao_servicos,
    aspectos_positivos,
    aspectos_negativos,
  ]);

  return (
    <div className="text-left">
      <Collapsible
        open={mostrarDocumentacao}
        onOpenChange={setMostrarDocumentacao}
      >
        <CollapsibleTrigger asChild>
          <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
            <h4
              className="text-xl font-semibold mb-4"
              data-secao={formSections[0].title}
            >
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
              getFieldNumber={(_, fieldIndex) =>
                `${sectionNumber ? sectionNumber + 1 : 2}.${fieldIndex + 1}`
              }
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

export default IntegraçãoUrbanaSocialForm;
