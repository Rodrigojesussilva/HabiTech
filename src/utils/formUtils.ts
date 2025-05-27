import * as z from "zod";

// Tipos genéricos e utilitários para formulários dinâmicos

// Tipagem para condições de exibição de campos
export type FormCondition = {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
  value: any;
};

// Tipagem principal dos campos de formulário
export type FormField = {
  name: string;
  label: string;
  type:
    | "text"
    | "select"
    | "checkbox"
    | "radio"
    | "display"
    | "number"
    | "label"
    | "textarea"
    | "file"
    | "numberSpinner"
    | "email"
    | "date"
    | "combobox";
  required: boolean;

  // Campos adicionais opcionais
  readonly?: boolean;
  options?: { label: string; value: string }[];
  mask?: string;
  max?: number;
  min?: number;
  step?: number;
  placeholder?: string;
  inputMode?: string;           // ← NOVO: restringe tipo de teclado (ex: "numeric")
  pattern?: string;             // ← NOVO: regex HTML para validação (ex: CPF)
  autoComplete?: string;        // ← NOVO: controla preenchimento automático
  dependent?: boolean;
  disableField?: string;
  displayValue?: (data: Record<string, any>) => string;
  conditions?: FormCondition[];
  sidebarform?: boolean;
  sidebarlabel?: string;
  showinmodal?: boolean;
  insertAfterField?: string;

  // Expansível para novos campos sem quebrar tipagem
  [key: string]: any;
};

// Estrutura de seção do formulário
export type FormSection = {
  id: string;
  title?: string;
  fields: FormField[];
  conditions?: FormCondition[];
};

// Configuração geral do formulário
export type FormConfig = {
  title: string;
  sections: FormSection[];
};

/**
 * Avalia condições para exibir campos dinamicamente
 */
export function evaluateConditions(
  conditions: FormCondition[],
  formValues: Record<string, any>
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((condition) => {
    const fieldValue = formValues[condition.field];

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "notEquals":
        return fieldValue !== condition.value;
      case "contains":
        return String(fieldValue || "").includes(String(condition.value));
      case "greaterThan":
        return Number(fieldValue) > Number(condition.value);
      case "lessThan":
        return Number(fieldValue) < Number(condition.value);
      default:
        return true;
    }
  });
}

/**
 * Gera valores padrão para um formulário com base em um schema Zod
 */
export function getDefaultValuesFromSchema(schema: z.ZodObject<any>): Record<string, any> {
  const defaultValues: Record<string, any> = {};
  for (const key in schema.shape) {
    const field = schema.shape[key];
    if (field instanceof z.ZodString) {
      defaultValues[key] = "";
    } else if (field instanceof z.ZodNumber) {
      defaultValues[key] = 0;
    } else if (field instanceof z.ZodBoolean) {
      defaultValues[key] = false;
    } else if (field instanceof z.ZodArray) {
      defaultValues[key] = [];
    } else if (field instanceof z.ZodObject) {
      defaultValues[key] = getDefaultValuesFromSchema(field); // suporte para objetos aninhados
    } else {
      defaultValues[key] = null;
    }
  }
  return defaultValues;
}
