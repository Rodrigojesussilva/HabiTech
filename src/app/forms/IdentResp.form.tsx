import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import FormSectionRenderer from "@/components/ui/FormSectionRenderer";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

// Define the form schema with Zod
const formSchema = z.object({
    responsavel: z.string(),
    nomeCompleto: z.string().optional(),
    nomeSocial: z.string().optional(),
    dataNascimento: z.string().optional(),
    naoSeAplica: z.boolean().optional(),
    relacaoResponsavel: z.string().optional(),
    nomeCompletoEntrevistado: z.string().optional(),
    nomeSocialEntrevistado: z.string().optional(),
    naoSeAplicaEntrevistado: z.boolean().optional(),
    idade: z.number().optional(),
    DescrevParentesco: z.string().optional(),
    arrolamento_id: z.string().optional(),
    idLocal: z.string().optional(),
});

// Define the form data type from the schema
type FormValues = z.infer<typeof formSchema>;

interface IdentRespFormProps {
    defaultValues?: Partial<FormValues>;
    onSubmit?: (data: FormValues) => void;
}

const IdentRespForm = ({ defaultValues, onSubmit }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    // Initialize the form with react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {},
    });

    // Handle form submission
    const handleSubmit = (data: FormValues) => {
        if (onSubmit) {
            onSubmit(data);
        }
        console.log(data);
    };

    // Define the form structure
    const formSections = [
        {
            id: "identificacao",
            title: "Identificação da(o) Responsável",
            fields: [
                {
                    name: "responsavel",
                    label: "Você é a pessoa responsável da unidade residencial?",
                    type: "select" as const,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                }
            ]
        }
    ];

    // Function to generate section and field numbers based on position
    const getFieldNumber = (sectionIndex: number, fieldIndex: number) => {
        return `${sectionIndex + 1}.${fieldIndex + 1}`;
    };

    return (
        <div className="text-left">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                        <CollapsibleTrigger asChild>
                            <div
                                className="section-header"
                                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', borderRadius: '15px' }}
                            >
                                1. IDENTIFICAÇÃO DA(O) RESPONSÁVEL
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {formSections.map((section, sectionIndex) => (
                                <FormSectionRenderer
                                    key={section.id}
                                    section={section}
                                    formControl={form.control}
                                    getFieldNumber={getFieldNumber}
                                    sectionIndex={sectionIndex}
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