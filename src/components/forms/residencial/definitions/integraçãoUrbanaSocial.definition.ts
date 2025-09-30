import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Constantes
export const SERVICOS_DISPONIVEIS = [
  "Postos de saúde",
  "Escolas",
  "Creches",
  "Transporte",
  "Lazer",
];

export const LOCALIZACAO_OPCOES = [
  { label: "Na área", value: "Na área" },
  { label: "Em outro lugar", value: "Em outro lugar" },
  { label: "Não sabe", value: "Não sabe" },
  { label: "Outros", value: "Outros" },
];

export const SATISFACAO_OPTIONS = [
  { label: "Muito insatisfeito", value: "Muito insatisfeito" },
  { label: "Insatisfeito", value: "Insatisfeito" },
  { label: "Neutro", value: "Neutro" },
  { label: "Satisfeito", value: "Satisfeito" },
  { label: "Muito satisfeito", value: "Muito satisfeito" },
];

export const ASPECTOS_POSITIVOS = [
  "Segurança",
  "Infraestrutura",
  "Comunidade",
  "Acesso a serviços",
  "Natureza",
  "Outros",
];

export const ASPECTOS_NEGATIVOS = [
  "Violência",
  "Falta de transporte",
  "Desemprego",
  "Poluição",
  "Falta de lazer",
  "Outros",
];

// Schema de validação
export const integraçãoUrbanaSocialSchema = z.object({
  servicosSelecionados: z.array(z.string()).optional(),
  localizacao_servicos: z.record(z.string(), z.string()).optional(),
  outros_servicos: z.record(z.string(), z.string()).optional(),

  satisfacao_morar_territorio: z.enum([
    "Muito insatisfeito",
    "Insatisfeito",
    "Neutro",
    "Satisfeito",
    "Muito satisfeito",
  ]).optional(),

  aspectos_positivos: z.array(z.string()).optional(),
  outros_aspectos_positivos: z.string().optional(),

  aspectos_negativos: z.array(z.string()).optional(),
  outros_aspectos_negativos: z.string().optional(),
});

export type FormValues = z.infer<typeof integraçãoUrbanaSocialSchema>;

export const defaultValues: Partial<FormValues> = {
  servicosSelecionados: [],
  localizacao_servicos: {},
  outros_servicos: {},

  satisfacao_morar_territorio: undefined,
  aspectos_positivos: [],
  outros_aspectos_positivos: "",
  aspectos_negativos: [],
  outros_aspectos_negativos: "",
};

// Definição fixa dos campos
export const integraçãoUrbanaSocialDefinition: FormConfig = {
  title: "Serviços e Equipamentos Utilizados pela Família",
  sections: [
    {
      id: "servicosEquipamentos",
      title: "Serviços e Equipamentos Utilizados pela Família",
      fields: [
        {
          name: "servicosSelecionados",
          label: "Serviços/equipamentos utilizados",
          type: "multicombobox",
          required: false,
          placeholder: "Selecione os serviços utilizados",
          options: SERVICOS_DISPONIVEIS.map((s) => ({ label: s, value: s })),
        },
        {
          name: "satisfacao_morar_territorio",
          label: "Satisfação por morar no território",
          type: "select",
          required: false,
          placeholder: "Selecione uma opção",
          options: SATISFACAO_OPTIONS,
        },
        {
          name: "aspectos_positivos",
          label: "Principais aspectos positivos",
          type: "multicombobox",
          required: false,
          placeholder: "Selecione os aspectos positivos",
          options: ASPECTOS_POSITIVOS.map((a) => ({ label: a, value: a })),
        },
        {
          name: "aspectos_negativos",
          label: "Principais aspectos negativos",
          type: "multicombobox",
          required: false,
          placeholder: "Selecione os aspectos negativos",
          options: ASPECTOS_NEGATIVOS.map((a) => ({ label: a, value: a })),
        },
      ],
    },
  ],
};

// Insere campos após um campo específico
function insertAfter(fields: FormField[], targetName: string, toInsert: FormField[]) {
  const index = fields.findIndex((f) => f.name === targetName);
  if (index === -1) return [...fields, ...toInsert];
  return [
    ...fields.slice(0, index + 1),
    ...toInsert,
    ...fields.slice(index + 1),
  ];
}

// Campos condicionais
export function getConditionalFields(formValues: Partial<FormValues>) {
  const camposCondicionais: FormField[] = [];

  const servicosSelecionados = Array.isArray(formValues.servicosSelecionados)
    ? formValues.servicosSelecionados
    : [];

  const localizacoes = formValues.localizacao_servicos || {};

  for (const servico of servicosSelecionados) {
    const dropdownField: FormField = {
      name: `localizacao_servicos.${servico}`,
      label: `Localização de ${servico}`,
      type: "select",
      required: true,
      options: LOCALIZACAO_OPCOES,
    };
    camposCondicionais.push(dropdownField);

    if (localizacoes[servico] === "Outros") {
      camposCondicionais.push({
        name: `outros_servicos.${servico}`,
        label: `Especifique outro local de ${servico}`,
        type: "text",
        required: true,
        placeholder: `Digite o local de ${servico}`,
      });
    }
  }

  // Aspectos positivos - campo "Outros"
  if (
    Array.isArray(formValues.aspectos_positivos) &&
    formValues.aspectos_positivos.includes("Outros")
  ) {
    camposCondicionais.push({
      name: "outros_aspectos_positivos",
      label: "Especifique outros aspectos positivos",
      type: "text",
      required: true,
      placeholder: "Digite outros aspectos positivos",
    });
  }

  // Aspectos negativos - campo "Outros"
  if (
    Array.isArray(formValues.aspectos_negativos) &&
    formValues.aspectos_negativos.includes("Outros")
  ) {
    camposCondicionais.push({
      name: "outros_aspectos_negativos",
      label: "Especifique outros aspectos negativos",
      type: "text",
      required: true,
      placeholder: "Digite outros aspectos negativos",
    });
  }

  return { camposCondicionais };
}

// ✅ MANTIDA: inserção após "servicosSelecionados"
export function getMergedFormSections(formValues: Partial<FormValues>) {
  try {
    const baseFields = [...integraçãoUrbanaSocialDefinition.sections[0].fields];
    const condFields = getConditionalFields(formValues);

    const camposCondicionais = condFields.camposCondicionais;

    // Separar por tipo
    const camposLocalizacao: FormField[] = [];
    const camposOutrosPositivos: FormField[] = [];
    const camposOutrosNegativos: FormField[] = [];

    for (const field of camposCondicionais) {
      if (field.name?.startsWith("localizacao_servicos") || field.name?.startsWith("outros_servicos")) {
        camposLocalizacao.push(field);
      } else if (field.name === "outros_aspectos_positivos") {
        camposOutrosPositivos.push(field);
      } else if (field.name === "outros_aspectos_negativos") {
        camposOutrosNegativos.push(field);
      }
    }

    // Inserir cada grupo de campos condicionais após o campo correspondente
    let fieldsWithLocalizacao = insertAfter(baseFields, "servicosSelecionados", camposLocalizacao);
    let fieldsWithPositivos = insertAfter(fieldsWithLocalizacao, "aspectos_positivos", camposOutrosPositivos);
    let finalFields = insertAfter(fieldsWithPositivos, "aspectos_negativos", camposOutrosNegativos);

    return [
      {
        ...integraçãoUrbanaSocialDefinition.sections[0],
        fields: finalFields,
      },
    ];
  } catch (error) {
    console.error("Erro em getMergedFormSections:", error);
    return [integraçãoUrbanaSocialDefinition.sections[0]];
  }
}

