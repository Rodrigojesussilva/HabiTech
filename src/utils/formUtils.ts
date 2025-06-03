import * as z from "zod";

// Generic form utilities - not tied to any specific form

// Define condition type
export type FormCondition = {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
  value: any;
};

// Define generic FormField type
export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'display' | 'number' | 'label' | 'textarea' | 'file' | 'numberSpinner' | 'email'| 'date'|'combobox'| 'multicombobox';
  required: boolean;
  readonly?: boolean;
  options?: { label: string; value: string }[];
  mask?: string;
  max?: number;
  step?: number;
  placeholder?: string;
  dependent?: boolean;
  disableField?: string; // <-- Aqui!
  displayValue?: (data: Record<string, any>) => string;
  conditions?: FormCondition[]; // For conditional rendering
  sidebarform?: boolean;
  sidebarlabel?: string;
  showinmodal?: boolean;
  min?: number;
  insertAfterField?: string; // Campo após o qual este campo deve ser inserido
};

// Generic form section type
export type FormSection = {
  id: string;
  title?: string;
  fields: FormField[];
  conditions?: FormCondition[];
};

// Define the entire form configuration type
export type FormConfig = {
  title: string;
  sections: FormSection[];
};

/**
 * Evaluates a set of conditions against form values
 * Works with any form structure as long as it follows the condition format
 * 
 * @param conditions Array of conditions to evaluate
 * @param formValues Current form values
 * @returns true if all conditions are met, false otherwise
 */
export function evaluateConditions(conditions: FormCondition[], formValues: Record<string, any>): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every(condition => {
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

// Utility function to derive default values from a Zod schema
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
    } else {
      defaultValues[key] = null; // Default for other types
    }
  }
  return defaultValues;
}
