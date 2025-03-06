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
    type: 'text' | 'select' | 'checkbox' | 'radio' | 'display';
    required: boolean;
    readonly?: boolean;
    options?: { label: string; value: string }[];
    mask?: string;
    placeholder?: string;
    dependent?: boolean;
    disableField?: string;
    displayValue?: (data: Record<string, any>) => string;
    conditions?: FormCondition[]; // For conditional rendering
    sidebarform?: boolean;
	sidebarlabel?: string;
	showinmodal?: boolean;
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