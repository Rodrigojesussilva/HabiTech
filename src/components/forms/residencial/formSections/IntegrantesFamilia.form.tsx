import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/integrantesFamilia.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import IntegranteDialog from "../IntegranteDialog"; // ajuste o caminho conforme sua estrutura

interface integrantesFamiliaFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const integrantesFamiliaForm = ({ sectionIndex: sectionNumber, familyIndex }: integrantesFamiliaFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const form = useFormContext();
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues);
    const section = formSections[0]; // Assume só 1 seção

    // Lista dos integrantes selecionados
    const integrantesSelecionados: string[] = formValues?.integrantesFamilia || [];

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={section.title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${section.title}`}
                        </h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                    {/* Renderiza campos gerais */}
                    <FormSectionRenderer
                        section={{
                            id: section.id,
                            title: section.title,
                            fields: section.fields.filter(f => f.name === "integrantesFamilia"),
                        }}
                        formControl={form.control}
                        getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                        sectionIndex={0}
                        formValues={formValues}
                        showSectionLabel={false}
                        familyIndex={familyIndex}
                    />

                    {/* Lista dos integrantes com botão para abrir o dialog */}
                    {integrantesSelecionados.length > 0 && (
                        <div className="border border-muted rounded-xl p-6 bg-background shadow-sm space-y-4">
                            <h5 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                👨‍👩‍👧‍👦 Lista de Integrantes da Família
                                <span className="text-muted-foreground text-sm font-normal">
                                    ({integrantesSelecionados.length})
                                </span>
                            </h5>

                            <div className="grid gap-3">
                                {integrantesSelecionados.map((integrante) => (
                                    <div
                                        key={integrante}
                                        className="flex items-center justify-between rounded-lg border bg-muted/50 hover:bg-muted transition-colors px-4 py-3 group"
                                    >
                                        <span className="font-medium text-foreground">{integrante}</span>

                                        <IntegranteDialog
                                            integranteName={integrante}
                                            familyIndex={familyIndex}
                                            sectionIndex={sectionNumber ?? 0}
                                            allFields={section.fields}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default integrantesFamiliaForm;
