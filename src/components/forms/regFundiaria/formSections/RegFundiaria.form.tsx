import {  useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/regFundiaria/definitions/regFundiaria.definition";

// Import FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface RegFundiariaFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex?: number | null;
}

const RegFundiariaForm = ({ sectionIndex: sectionNumber }: RegFundiariaFormProps) => {
    const [mostrarSecao, setMostrarSecao] = useState(true);
    console.log(sectionNumber);
    const form = useFormContext();
    // Get form values for conditional logic - now directly from the root level
    const formValues = form.watch() || {};

    // Get merged form sections
    const formSections = getMergedFormSections(formValues);

    return (
        <div className="text-left">
            {formSections.map((section, idx) => (
                <Collapsible 
                    key={section.id} 
                    open={mostrarSecao} 
                    onOpenChange={setMostrarSecao}
                    data-secao={section.id}
                    data-label={section.title}
                >
                    <CollapsibleTrigger asChild>
                        <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                            <h4 className="text-xl font-semibold mb-4">{`Seção ${idx + 1} - ${section.title}`}</h4>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <FormSectionRenderer
                            key={section.id}
                            section={section}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${idx + 1}.${fieldIndex + 1}`}
                            sectionIndex={idx}
                            formValues={formValues}
                            showSectionLabel={false}
                            // No familyIndex needed anymore
                        />
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
};

export default RegFundiariaForm; 