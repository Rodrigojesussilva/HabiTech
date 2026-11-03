import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Ref } from "react";


import { Form } from "@/components/ui/form"
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormMetadata } from '@/hooks/useFormMetadata';

import RegFundiariaForm from "./formSections/RegFundiaria.form";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

// Import the types from formUtils
import { FormField as FormFieldType, FormSection } from "@/utils/formUtils";
import {
    regFundiariaSchema,
    defaultValues as regFundiariaDefaultValues
} from "./definitions/regFundiaria.definition";
import FormCompletionProgress from "@/components/forms/FormCompletionProgress";
import FormPageHeader from "@/components/forms/FormPageHeader";

// Define the form schema with Zod - combining metadata and regFundiaria fields
const formSchema = z.object({
    cadastrador: z.string().min(1, { message: "Nome do cadastrador é obrigatório" }),
    dataVisita: z.string(),
    qtdeDomicilios: z.number(),
    // Include all regFundiaria fields directly at root level
    ...regFundiariaSchema.shape
});

// Define the form data type from the schema
type FormValues = z.infer<typeof formSchema>;

interface FormRegFundiariaProps {
    ref: Ref<HTMLDivElement>;
    defaultValues?: Partial<FormValues>;
    onSubmit?: (data: FormValues) => void;
    isMetadataModalOpen: boolean;
    setIsMetadataModalOpen: (open: boolean) => void;
}

const FormRegFundiaria = ({
    ref,
    defaultValues,
    onSubmit,
    isMetadataModalOpen,
    setIsMetadataModalOpen
}: FormRegFundiariaProps) => {
    // Initialize the form with react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            cadastrador: "",
            dataVisita: new Date().toLocaleDateString('pt-BR'),
            qtdeDomicilios: 1,
            // Add all regFundiaria default values
            ...regFundiariaDefaultValues
        },
    });
    const progressValues = useWatch({ control: form.control });

    const { setForm, setMetadata } = useFormMetadata();

    // Share the form and metadata once on mount
    useEffect(() => {
        setForm(form);
        setMetadata(metaDataSections[0]);

        return () => {
            setForm(null);
            setMetadata(null);
        };
    }, []);

    // Handle form submission
    const handleSubmit = (data: FormValues) => {
        if (onSubmit) {
            onSubmit(data);
        }
        console.log(data);
    };

    // Define the metadata form structure
    const metaDataSections: FormSection[] = [
        {
            id: "dadosControle",
            title: "",
            fields: [
                {
                    name: "cadastrador",
                    label: "Cadastrador",
                    type: "text",
                    disabled: true,
                    required: false,
                    sidebarform: false,
                    sidebarlabel: "Cadastrador",
                    showinmodal: true,
                } as FormFieldType,

                {
                    name: "dataVisita",
                    label: "Data da Visita",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    sidebarlabel: "Visita",
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "qtdeDomicilios",
                    label: "Quantidade de Domicílios",
                    type: "number",
                    required: true,
                    sidebarform: true,
                    sidebarlabel: "Domicílios",
                    showinmodal: true,
                } as FormFieldType,
                
            ]
        },

    ];

    // Function to generate section and field numbers
    const getFieldNumber = (sectionIndex: number, fieldIndex: number) => {
        return `${sectionIndex + 1}.${fieldIndex + 1}`;
    };

    return (
        <div ref={ref} className="text-left" nome-form="Regularização Fundiária" descr-form="Este formulário tem como objetivo coletar informações para regularização fundiária">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Dialog for metadata fields */}
                    <Dialog open={isMetadataModalOpen} onOpenChange={setIsMetadataModalOpen}>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Regularização Fundiária</DialogTitle>
                                <DialogDescription>
                                    Preencha os campos de identificação:
                                </DialogDescription>
                            </DialogHeader>

                            {/* Render metaDataSections inside the Dialog */}
                            {metaDataSections.map((section, sectionIndex) => (
                                <div key={section.id} data-secao={section.id} data-label={section.title}>
                                    <h3 className="font-bold text-lg mt-4 mb-2">{section.title}</h3>
                                    <FormSectionRenderer
                                        section={section}
                                        formControl={form.control}
                                        getFieldNumber={getFieldNumber}
                                        sectionIndex={sectionIndex}
                                        handleModalFields={true}
                                        showSectionLabel={false}
                                    />
                                </div>
                            ))}

                            <Button
                                type="button"
                                onClick={() => setIsMetadataModalOpen(false)}
                                className="mt-4"
                            >
                                Concluir
                            </Button>
                        </DialogContent>
                    </Dialog>

                    <FormPageHeader
                        title="Regularização Fundiária"
                        description="Levantamento de informações para cadastro e regularização fundiária."
                    >
                        <FormCompletionProgress schema={formSchema} values={progressValues} />
                    </FormPageHeader>

                    {/* Render RegFundiariaForm directly without family index */}
                    <div data-family-index="0">
                        <RegFundiariaForm sectionIndex={0} familyIndex={null} />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default FormRegFundiaria; 