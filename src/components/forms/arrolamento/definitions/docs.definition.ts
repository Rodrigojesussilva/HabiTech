import { z } from "zod";
import dayjs from "dayjs";
import { FormConfig, FormField } from "@/utils/formUtils";

function validarCpf(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) {
    return false;
  }

  const calcularDigito = (base: string, pesoInicial: number): number => {
    const soma = base
      .split("")
      .map((num, i) => parseInt(num, 10) * (pesoInicial - i))
      .reduce((acc, curr) => acc + curr, 0);

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = cpfLimpo.slice(0, 9);
  const digito1 = calcularDigito(base, 10);
  const digito2 = calcularDigito(base + digito1, 11);

  return cpfLimpo === base + digito1.toString() + digito2.toString();
}

export const docsSchema = z
  .object({
    paisOrigem: z.string().optional(),
    documentacao: z.string().optional(),
    numeroProtocolo: z.string().optional(),
    numeroRnm: z.string().optional(),
    statusRnm: z.string().optional(),
    numeroCrnm: z.string().optional(),
    statusCrnm: z.string().optional(),
    numeroPassaporte: z.string().optional(),
    uf: z.string().optional(),
    cidade: z.string().optional(),
    fonteRg: z.string().optional(),
    rg: z.string().optional(),
    orgaoExpedidor: z.string().optional(),
    estadoEmissaoRg: z.string().optional(),
    dataExpedicaoRg: z.string().optional(),
    cpf: z.string().optional().refine((cpf) => !cpf || validarCpf(cpf), {
      message: "CPF inválido",
    }),
    fonteCpf: z.string().optional(),
    arrolamento_id: z.string().optional(),
    idLocal: z.string().optional(),
    tempoExpedicao: z.object({ anos: z.number(), meses: z.number() }).optional(),
    dataExpedicaoCpf: z.string().optional(),
    tempoExpedicaoCpf: z.object({ anos: z.number(), meses: z.number() }).optional(),
    dataNascimento: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const nascimento = dayjs(data.dataNascimento, "DD/MM/YYYY", true);
    const expedicaoRg = dayjs(data.dataExpedicaoRg, "DD/MM/YYYY", true);

    if (nascimento.isValid() && expedicaoRg.isValid()) {
      const minExpedicao = nascimento.add(16, "year");

      if (expedicaoRg.isBefore(minExpedicao)) {
        ctx.addIssue({
          path: ["dataExpedicaoRg"],
          code: z.ZodIssueCode.custom,
          message: "A expedição do RG deve ocorrer após os 16 anos de idade",
        });
      }
    }
  });

export type FormValues = z.infer<typeof docsSchema>;

export const defaultValues: Partial<FormValues> = {
  paisOrigem: "Brazil",
  documentacao: "",
  numeroProtocolo: "",
  numeroRnm: "",
  statusRnm: "",
  numeroCrnm: "",
  statusCrnm: "",
  numeroPassaporte: "",
  uf: "",
  cidade: "",
  fonteRg: "",
  rg: "",
  orgaoExpedidor: "",
  estadoEmissaoRg: "",
  dataExpedicaoRg: "",
  cpf: "",
  fonteCpf: "",
  idLocal: "not",
  tempoExpedicao: { anos: 0, meses: 0 },
  dataExpedicaoCpf: "",
  tempoExpedicaoCpf: { anos: 0, meses: 0 },
};

export const docsDefinition: FormConfig = {
  title: "Documentação",
  sections: [
    {
      id: "documentacaoPessoalResponsavel",
      title: "Documentação da Pessoa Responsável",
      fields: [
        {
          name: "paisOrigem",
          label: "País de Origem",
          type: "combobox" as const,
          required: true,
          options: [
            { label: "Brasil", value: "Brazil" },
            { label: "Angola", value: "Angola" },
            { label: "Portugal", value: "Portugal" },
            { label: "Estados Unidos", value: "United States" },
            { label: "Canadá", value: "Canada" },
            { label: "Moçambique", value: "Mozambique" },
          ],
        },
      ],
    },
  ],
};

export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
  const conditionalFields: FormField[] = [];

  const pais = formValues.paisOrigem?.toLowerCase();
  const doc = formValues.documentacao?.toLowerCase();

  if (pais === "brazil") {
    conditionalFields.push(
      { name: "uf", label: "Estado (UF)", type: "select", required: true, options: [] },
      { name: "cidade", label: "Cidade", type: "select", required: true, options: [] },
      {
        name: "fonteRg",
        label: "Fonte para RG",
        type: "select",
        required: true,
        options: [
          { label: "CNH", value: "CNH" },
          { label: "RG", value: "RG" },
        ],
      },
      { name: "rg", label: "Número do RG", type: "text", required: true },
      { name: "orgaoExpedidor", label: "Órgão Expedidor", type: "text", required: true },
      { name: "estadoEmissaoRg", label: "Estado de Emissão do RG", type: "select", required: true, options: [] },
      { name: "dataExpedicaoRg", label: "Data de Expedição do RG", type: "text", required: true, mask: "99/99/9999", placeholder: "DD/MM/AAAA" },
      { name: "cpf", label: "CPF", type: "text", required: true, mask: "999.999.999-99" },
      {
        name: "fonteCpf",
        label: "Fonte para CPF",
        type: "select",
        required: true,
        options: [
          { label: "CIN", value: "CIN" },
          { label: "CPF", value: "CPF" },
        ],
      }
    );
  } else if (pais && pais !== "brazil") {
    conditionalFields.push({
      name: "documentacao",
      label: "Documentação",
      type: "select",
      required: true,
      options: [
        { label: "Protocolo", value: "Protocolo" },
        { label: "RNM", value: "RNM" },
        { label: "CRNM", value: "CRNM" },
        { label: "Passaporte", value: "Passaporte" },
      ],
    });

    if (doc === "protocolo") {
      conditionalFields.push({ name: "numeroProtocolo", label: "Número do Protocolo", type: "text", required: true });
    } else if (doc === "rnm") {
      conditionalFields.push(
        { name: "numeroRnm", label: "Número do RNM", type: "text", required: true },
        {
          name: "statusRnm",
          label: "Status do RNM",
          type: "select",
          required: true,
          options: [
            { label: "Válido", value: "Válido" },
            { label: "Inválido", value: "Inválido" },
            { label: "Pendente", value: "Pendente" },
          ],
        }
      );
    } else if (doc === "crnm") {
      conditionalFields.push(
        { name: "numeroCrnm", label: "Número do CRNM", type: "text", required: true },
        {
          name: "statusCrnm",
          label: "Status do CRNM",
          type: "select",
          required: true,
          options: [
            { label: "Válido", value: "Válido" },
            { label: "Inválido", value: "Inválido" },
            { label: "Pendente", value: "Pendente" },
          ],
        }
      );
    } else if (doc === "passaporte") {
      conditionalFields.push({ name: "numeroPassaporte", label: "Número do Passaporte", type: "text", required: true });
    }
  }

  return conditionalFields;
}

export function getMergedFormSections(formValues: Partial<FormValues>) {
  const conditionalFields = getConditionalFields(formValues);
  return [
    {
      ...docsDefinition.sections[0],
      fields: [...docsDefinition.sections[0].fields, ...conditionalFields],
    },
  ];
}
