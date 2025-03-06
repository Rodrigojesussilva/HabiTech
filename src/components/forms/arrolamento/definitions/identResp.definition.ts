import { z } from "zod";
import { FormConfig } from "@/utils/formUtils";

// Form validation schema
export const formSchema = z.object({
    responsavel: z.string().optional(),
    relacaoResponsavel: z.string().optional(),
    nomeCompletoResp: z.string().optional(),
    nomeCompletoEntrevistado: z.string().optional(),
    dataNascimentoResp: z.string().optional(),
    idadeResp: z.string().optional(),
    sexoResp: z.string().optional(),
    cpf: z.string().optional(),
    celular: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    respDocs: z.string().optional(),
    DescrevParentesco: z.string().optional(),
    idLocal: z.string().optional(),
    arrolamento_id: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    responsavel: "",
    relacaoResponsavel: "",
    nomeCompletoResp: "",
    nomeCompletoEntrevistado: "",
    dataNascimentoResp: "",
    idadeResp: "",
    sexoResp: "",
    cpf: "",
    celular: "",
    whatsapp: "",
    email: "",
    respDocs: "",
    DescrevParentesco: "",
    idLocal: "not",
};

// Base form structure (without conditional fields)
export const identRespDefinition: FormConfig = {
    title: "Identificação",
    sections: [
        {
            id: "identificacaoResponsavel",
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
                    name: "nomeCompletoResp",
                    label: "Nome Completo da pessoa responsável pela unidade residencial",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "dataNascimentoResp",
                    label: "Data de Nascimento",
                    type: "text" as const,
                    required: false,
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA"
                },
                {
                    name: "idadeResp",
                    label: "Idade",
                    type: "display" as const,
                    required: false,
                    displayValue: (data: Partial<FormValues>) => data?.idadeResp || ""
                },
                {
                    name: "sexoResp",
                    label: "Sexo",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Feminino", value: "feminino" },
                        { label: "Masculino", value: "masculino" }
                    ]
                },
                {
                    name: "cpf",
                    label: "CPF",
                    type: "text" as const,
                    required: false,
                    mask: "999.999.999-99"
                },
                {
                    name: "celular",
                    label: "Celular",
                    type: "text" as const,
                    required: false,
                    mask: "(99) 99999-9999"
                },
                {
                    name: "whatsapp",
                    label: "Este celular tem WhatsApp?",
                    type: "select" as const,
                    required: false,
                    options: [
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" }
                    ]
                },
                {
                    name: "email",
                    label: "E-mail",
                    type: "text" as const,
                    required: false
                }
            ]
        }
    ]
}; 