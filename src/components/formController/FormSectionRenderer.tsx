import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
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
}

export const FormSectionRenderer = ({
    section,
    formControl,
    getFieldNumber,
    sectionIndex,
    formValues = {},
	handleModalFields = false,
    showSectionLabel = true
}: FormSectionRendererProps) => {
    const { getValues, setValue, watch } = useFormContext();
    const [refreshCounter, setRefreshCounter] = useState(0);

    // Create a mapping of fields to their controlling checkboxes
    const fieldToCheckboxMap: Record<string, string> = {};
    section.fields.forEach(field => {
        if (field.type === 'checkbox' && field.disableField) {
            fieldToCheckboxMap[field.disableField] = field.name;
        }
    });

    // Look for display fields that might need to be refreshed when other fields change
    const displayFields = section.fields.filter(field => field.type === 'display');

    // Set up watchers for fields that could affect display fields
    useEffect(() => {
        // Watch for date of birth changes to update age display
        const dataNascimentoSubscription = watch((value, { name }) => {
            if (name === 'dataNascimento') {
                // Trigger refresh of display fields
                setRefreshCounter(prev => prev + 1);
            }
        });

        return () => {
            dataNascimentoSubscription.unsubscribe();
        };
    }, [watch]);

    return (
        <div className="section mb-6">
            {showSectionLabel && section.title && <h5 className="text-lg font-medium mb-4">{section.title}</h5>}
            <div className="grid grid-cols-1 gap-4">
                {section.fields.map((field, fieldIndex) => {
                    // Skip field if it doesn't meet its conditions
                    if (handleModalFields && !field.showinmodal ) {
                        return null;
                    }
                    if (field.conditions && !evaluateConditions(field.conditions, formValues)) {
                        return null;
                    }

                    return (
                        <FormField
                            key={field.name}
                            control={formControl}
                            name={field.name}
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <span className="mr-2">{getFieldNumber(sectionIndex, fieldIndex)}</span>
                                        {field.label}
                                    </FormLabel>

                                    <FormControl>
                                        {renderFormField(field, formField, formValues)}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formField.onChange(e.target.value);
                    }}
                />
            );

        case "select":
            return (
                <Select
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
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

        default:
            return null;
    }
}

export default FormSectionRenderer; 