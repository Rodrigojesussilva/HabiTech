import { useForm } from "react-hook-form";
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

// Define the form schema with Zod - combining metadata and regFundiaria fields
const formSchema = z.object({
    processoAdm: z.string(),
    dataVisita: z.string(),
    tecnicoResponsavel: z.string().min(1, { message: "Nome do técnico responsável é obrigatório" }),
    enderecoImovel: z.string(),
    metadataQuadra: z.string(),
    metadataLote: z.string(),
    nucleo: z.string(),
    municipio: z.string(),
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
            processoAdm: "",
            dataVisita: new Date().toLocaleDateString('pt-BR'),
            tecnicoResponsavel: "",
            enderecoImovel: "",
            metadataQuadra: "",
            metadataLote: "",
            nucleo: "",
            municipio: "",
            // Add all regFundiaria default values
            ...regFundiariaDefaultValues
        },
    });

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
            id: "identificacao",
            title: "",
            fields: [
                {
                    name: "processoAdm",
                    label: "Processo Administrativo",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    sidebarlabel: "Processo",
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "dataVisita",
                    label: "Data da Visita",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    sidebarlabel: "Data",
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "tecnicoResponsavel",
                    label: "Técnico Responsável",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    sidebarlabel: "Técnico",
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "enderecoImovel",
                    label: "Endereço do Imóvel",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    sidebarlabel: "Endereço",
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "metadataQuadra",
                    label: "Quadra",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "metadataLote",
                    label: "Lote",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "nucleo",
                    label: "Núcleo",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "municipio",
                    label: "Município",
                    type: "text",
                    required: true,
                    sidebarform: true,
                    showinmodal: true,
                } as FormFieldType,
                {
                    name: "quantidadeDomicilios",
                    label: "Quantidade de domicílios no lote",
                    type: "number",
                    required: false,
                    sidebarform: true,
                    sidebarlabel: "Qtd. Domicílios",
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

                    <div className="flex flex-row justify-between gap-2">
                        <div className="text-left text-lg font-bold">
                            Regularização Fundiária
                        </div>
                        <div className="text-right flex flex-row gap-2">
                            <h3>Preenchimento:</h3>
                            <p className="text-primary">
                                0%
                            </p>
                        </div>
                    </div>
                    <div className="w-full border-t border-gray-300 my-4"></div>
                    
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