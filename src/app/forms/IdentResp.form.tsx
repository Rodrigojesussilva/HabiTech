import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import FormSectionRenderer from "@/components/ui/FormSectionRenderer";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { isValid, parse, isBefore, isAfter, differenceInYears } from 'date-fns';

// Define the form schema with Zod
const formSchema = z.object({
    responsavel: z.string(),
    nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
    nomeSocial: z.string().optional(),
    dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    naoSeAplica: z.boolean().default(false),
    relacaoResponsavel: z.string().optional(),
    nomeCompletoEntrevistado: z.string().optional(),
    nomeSocialEntrevistado: z.string().optional(),
    naoSeAplicaEntrevistado: z.boolean().default(false),
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
    handleShowSectsResp?: (show: boolean) => void;
    id?: string;
}

const IdentRespForm = ({ defaultValues, onSubmit, handleShowSectsResp, id }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [errorBirthDate, setErrorBirthDate] = useState('Digite a data no formato DD/MM/AAAA');

    // Initialize the form with react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...defaultValues,
            arrolamento_id: id,
            idLocal: defaultValues?.idLocal || "not",
        },
    });

    const watchResponsavel = form.watch("responsavel");

    useEffect(() => {
        if (handleShowSectsResp) {
            handleShowSectsResp(watchResponsavel === "sim");
        }
    }, [watchResponsavel, handleShowSectsResp]);

    const calcularIdade = (dataNascimento: string) => {
        const dataParse = parse(dataNascimento, 'dd/MM/yyyy', new Date());

        if (!isValid(dataParse)) {
            throw new Error('Data inválida. Por favor, use o formato DD/MM/AAAA.');
        }

        const hoje = new Date();
        let idade = 0;

        if (isBefore(dataParse, hoje)) {
            idade = differenceInYears(new Date(), dataParse);
        } else {
            throw new Error('Data inválida. Por favor informe uma data anterior a atual.');
        }

        return idade;
    };

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
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "nomeCompleto",
                    label: "Nome Completo do Responsável",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "nomeSocial",
                    label: "Nome Social Responsável",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "naoSeAplica",
                    label: "Não se aplica",
                    type: "checkbox" as const,
                    required: false,
                    dependent: true
                },
                {
                    name: "dataNascimento",
                    label: "Data de Nascimento",
                    type: "text" as const,
                    required: false,
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA"
                }
            ]
        }
    ];

    // Conditional fields when responsavel is "nao"
    if (watchResponsavel === "nao") {
        formSections[0].fields.push(
            {
                name: "relacaoResponsavel",
                label: "Qual a sua relação de parentesco com a pessoa responsável?",
                type: "select" as const,
                required: false,
                options: [
                    { label: "Conjugê/Campanheiro", value: "conjuge_campanheiro" },
                    { label: "Filho", value: "filho" },
                    { label: "Filha", value: "filha" },
                    { label: "Enteado", value: "enteado" },
                    { label: "Enteada", value: "enteada" },
                    { label: "Irmão", value: "irmao" },
                    { label: "Irmã", value: "irma" },
                    { label: "Pai", value: "pai" },
                    { label: "Mãe", value: "mae" },
                    { label: "Sogra", value: "sogra" },
                    { label: "Sogro", value: "sogro" },
                    { label: "Neta", value: "neta" },
                    { label: "Neto", value: "neto" },
                    { label: "Genro", value: "genro" },
                    { label: "Madrasta", value: "madrasta" },
                    { label: "Padrasto", value: "padrasto" },
                    { label: "Bisneta", value: "bisneta" },
                    { label: "Bisneto", value: "bisneto" },
                    { label: "Sobrinha", value: "sobrinha" },
                    { label: "Sobrinho", value: "sobrinho" },
                    { label: "Sem Relação de Parentesco", value: "sem_parentesco" },
                    { label: "Não Sabe Informar", value: "nsi" },
                    { label: "Outra Relação de Parentesco", value: "outro" }
                ]
            },
            {
                name: "nomeCompletoEntrevistado",
                label: "Nome Completo da Pessoa Entrevistada",
                type: "text" as const,
                required: false
            },
            {
                name: "nomeSocialEntrevistado",
                label: "Nome Social Pessoa Entrevistada",
                type: "text" as const,
                required: false
            },
            {
                name: "naoSeAplicaEntrevistado",
                label: "Não se aplica",
                type: "checkbox" as const,
                required: false,
                dependent: true
            }
        );
    }

    // Add DescrevParentesco field if relacaoResponsavel is "outro"
    if (form.watch("relacaoResponsavel") === "outro") {
        formSections[0].fields.push({
            name: "DescrevParentesco",
            label: "Descreva a Relação de Parentesco",
            type: "text" as const,
            required: false
        });
    }

    return (
        <div className="text-left">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                        <CollapsibleTrigger asChild>
                            <div
                                className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl"
                            >
                                <h4 className="text-xl font-semibold mb-4"> 2 - {formSections[0].title}</h4>
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
                                />
                            ))}

                            <div className="flex justify-end mt-4">
                                <Button type="submit">Salvar</Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </div>
    );
};

export default IdentRespForm; 