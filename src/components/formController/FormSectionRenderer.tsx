import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from "@/components/ui/label";
import { FormField as FormFieldType, evaluateConditions, FormSection } from "@/utils/formUtils";

interface FormSectionRendererProps {
    section: FormSection;
    formControl: any;
    getFieldNumber: (sectionIndex: number, fieldIndex: number) => string | null;
    sectionIndex: number;
    formValues?: Record<string, any>;
    handleModalFields?: boolean;
    showSectionLabel?: boolean;
    familyIndex?: number | null;
}

export const FormSectionRenderer = ({
    section,
    formControl,
    getFieldNumber,
    sectionIndex,
    formValues = {},
    handleModalFields = false,
    showSectionLabel = true,
    familyIndex = null,
}: FormSectionRendererProps) => {


    // Create a mapping of fields to their controlling checkboxes
    const fieldToCheckboxMap: Record<string, string> = {};
    section.fields.forEach(field => {
        if (field.type === 'checkbox' && field.disableField) {
            fieldToCheckboxMap[field.disableField] = field.name;
        }
    });
    

    return (
        <div className="section mb-6">
            {showSectionLabel && section.title && <h5 className="text-lg font-medium mb-4">{section.title}</h5>}
            <div className="grid grid-cols-1 gap-4">
                {section.fields.map((field, fieldIndex) => {
                    // Skip field if it doesn't meet its conditions
                    if (handleModalFields && !field.showinmodal) {
                        return null;
                    }
                    if (field.conditions && !evaluateConditions(field.conditions, formValues)) {
                        return null;
                    }

                    const key = familyIndex !== undefined && familyIndex !== null ? `family.${familyIndex}.${field.name}` : field.name;
                    const name = familyIndex !== undefined && familyIndex !== null ? `families[${familyIndex}].${field.name}` : field.name;
                   
                    return (
                        <FormField
                            key={key}
                            control={formControl}
                            name={name} // esse campo é o que faz a relação com o campo do array de familia no form principal
                            render={({ field: JSONformField }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <span className="mr-2">{getFieldNumber(sectionIndex, fieldIndex)}</span>
                                        {field.label}
                                    </FormLabel>

                                    <FormControl>
                                        {renderFormField(field, JSONformField, formValues)}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// Helper function to render different field types
function renderFormField(field: FormFieldType, formField: any, formValues: Record<string, any>) {
    switch (field.type) {
        case "text":
            if (field.mask) {
                return (
                    <Input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder={field.placeholder}
                        {...formField}
                        value={formField.value ?? ""}
                        disabled={field.readonly}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formField.onChange(e.target.value);
                        }}
                    />
                );
            }
            return (
                    <Input
                    {...formField}
                    placeholder={field.placeholder}
                    disabled={field.readonly}
                    value={formField.value ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formField.onChange(e.target.value);
                    }}
                />
            );

        case "select":
            return (
                <Select
                    onValueChange={formField.onChange}
                    value={formField.value || ""}
                    disabled={field.readonly}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case "checkbox":
            return (
                <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                    disabled={field.readonly}
                />
            );

        case "radio":
            return (
                <RadioGroup
                    defaultValue={formField.value}
                    onValueChange={formField.onChange}
                    disabled={field.readonly}
                >
                    {field.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                            <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            );

        case "display":
            let displayValue = "";
            if (field.displayValue) {
                displayValue = field.displayValue(formValues);
            }
            return <div className="p-2 border rounded bg-gray-50">{displayValue}</div>;

        case "number":
            return (
                <Input
                    type="number"
                    {...formField}
                    placeholder={field.placeholder}
                    disabled={field.readonly}
                    min={field.min}
                    value={formField.value || field.min || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value ? parseInt(e.target.value, 10) : field.min || "";
                        formField.onChange(value);
                    }}
                    className="w-32"
                />
            );

        default:
            return null;
    }
}

export default FormSectionRenderer; 