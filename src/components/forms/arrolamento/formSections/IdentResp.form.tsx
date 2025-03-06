import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
    formSchema, 
    FormValues, 
    defaultValues as defaultFormValues,
    identRespDefinition
} from "@/components/forms/arrolamento/definitions/identResp.definition";
import { getConditionalFields, calcularIdade } from "@/components/forms/arrolamento/helpers/identResp.helper";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

interface IdentRespFormProps {
    defaultValues?: Partial<FormValues>;
    id?: string;
}

const IdentRespForm = ({ defaultValues, id }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    
    // Initialize the form with react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...defaultFormValues,
            ...defaultValues,
            arrolamento_id: id,
            idLocal: defaultValues?.idLocal || "not",
        },
    });
    
    // Get form values for conditional logic
    const formValues = form.watch();
    
    // Update age when date of birth changes
    useEffect(() => {
        const dataNascimento = formValues.dataNascimentoResp;
        if (dataNascimento) {
            const idade = calcularIdade(dataNascimento);
            form.setValue("idadeResp", idade);
        }
    }, [formValues.dataNascimentoResp, form]);
    
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
            <Form {...form}>
                <form className="space-y-6">
                    <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                        <CollapsibleTrigger asChild>
                            <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                                <h4 className="text-xl font-semibold mb-4"> 2 - Identificação</h4>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {formSections.map((section, sectionIndex) => (
                                <FormSectionRenderer
                                    key={section.id}
                                    section={section}
                                    formControl={form.control}
                                    getFieldNumber={(sectionIndex, fieldIndex) => `${sectionIndex + 2}.${fieldIndex + 1}`}
                                    sectionIndex={sectionIndex}
                                    formValues={formValues}
                                />
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </div>
    );
};

export default IdentRespForm; 