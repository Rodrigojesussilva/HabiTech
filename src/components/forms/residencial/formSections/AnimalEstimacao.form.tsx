import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/animalEstimacao.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import AnimalDialog from "@/components/forms/residencial/AnimalDialog"; // ajuste o caminho conforme necessário


// Utilitário para transformar nomes em slug


interface AnimalEstimacaoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const AnimalEstimacaoForm = ({ sectionIndex: sectionNumber, familyIndex }: AnimalEstimacaoFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const form = useFormContext();

    // 🔁 Reage a mudanças em todos os campos da família
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues);
    const section = formSections[0]; // único grupo "Animal de Estimação"

    // Lista de animais selecionados no campo multicombobox
    const animaisSelecionados: string[] = formValues?.animalEstimacao || [];

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
                    {/* Renderiza todos os campos da seção exceto os individuais de cada animal */}
                    <FormSectionRenderer
                        section={{
                            id: section.id,
                            title: section.title,
                            fields: section.fields.filter(f => f.name === "possuiAnimalEstimacao" || f.name === "animalEstimacao"),
                        }}
                        formControl={form.control}
                        getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                        sectionIndex={0}
                        formValues={formValues}
                        showSectionLabel={false}
                        familyIndex={familyIndex}
                    />

                    {/* Lista de animais adicionados + botões de editar */}
                    {formValues.possuiAnimalEstimacao === "sim" && animaisSelecionados.length > 0 && (
                        <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm space-y-3">
                            <h5 className="text-md font-semibold mb-2">🐾 Lista de Animais</h5>
                            <div className="grid gap-2">
                                {animaisSelecionados.map((animal) => (
                                    <div
                                        key={animal}
                                        className="flex items-center justify-between border rounded-md px-4 py-2 bg-gray-50"
                                    >
                                        <span className="font-medium">{animal}</span>
                                        <AnimalDialog
                                            animalName={animal}
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

export default AnimalEstimacaoForm;
