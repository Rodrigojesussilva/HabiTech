import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';

interface FormSectionRendererProps {
    section: {
        id: string;
        title: string;
        fields: {
            name: string;
            label: string;
            type: 'text' | 'select' | 'checkbox' | 'radio' | 'display';
            readonly?: boolean;
            options?: { label: string; value: string }[];
            dependent?: boolean;
            parentField?: string;
            displayValue?: (data: any) => string;
        }[];
    };
    formControl: any;
    getFieldNumber: (sectionIndex: number, fieldIndex: number) => string;
    sectionIndex: number;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({ section, formControl, getFieldNumber, sectionIndex }) => {
    const { getValues, setValue, watch } = useFormContext();
    const [refreshCounter, setRefreshCounter] = useState(0);
    
    // Create a mapping of parent fields to their dependent checkbox fields
    const parentToCheckboxMap: Record<string, string> = {};
    section.fields.forEach(field => {
        if (field.parentField && field.type === 'checkbox') {
            parentToCheckboxMap[field.parentField] = field.name;
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
        <div key={section.id}>
            <div className="grid grid-cols-1 gap-6">
                {section.fields.map((field, fieldIndex) => {
                    const isDependent = field.dependent;
                    const parentFieldName = field.parentField;
                    const parentField = section.fields.find(f => f.name === parentFieldName);
                    
                    // Check if this field has a checkbox that controls it
                    const controllingCheckbox = parentToCheckboxMap[field.name];
                    const isDisabled = controllingCheckbox ? watch(controllingCheckbox) : false;

                    // For display fields, we'll create a special case
                    if (field.type === 'display') {
                        return (
                            <div key={`${field.name}-${refreshCounter}`} className={isDependent ? "ml-6 -mt-4" : ""}>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">{field.label}:</span>
                                    <span className="text-sm">
                                        {field.displayValue ? field.displayValue(getValues()) : ""}
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <FormField
                            key={field.name}
                            control={formControl}
                            name={field.name}
                            render={({ field: formField }) => (
                                <FormItem>
                                    {!isDependent && (
                                        <FormLabel>{getFieldNumber(sectionIndex, fieldIndex)}. {field.label} *</FormLabel>
                                    )}
                                    <FormControl>
                                        <div className={isDependent ? "ml-6" : ""}>
                                            {field.type === 'text' && (
                                                <Input
                                                    {...formField}
                                                    readOnly={field.readonly || (parentField && getValues(parentField.name))}
                                                    className={field.readonly ? "bg-gray-100 cursor-not-allowed" : ""}
                                                    disabled={isDisabled}
                                                />
                                            )}
                                            {field.type === 'select' && (
                                                <Select
                                                    onValueChange={formField.onChange}
                                                    defaultValue={formField.value}
                                                    disabled={isDisabled}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={`Selecione ${field.label}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {field.type === 'checkbox' && (
                                                <div className="flex items-center -mt-4 space-x-2">
                                                    <Checkbox
                                                        id={`checkbox-${field.name}`}
                                                        checked={formField.value}
                                                        onCheckedChange={(checked) => {
                                                            formField.onChange(checked);
                                                            
                                                            // If this checkbox is meant to disable a parent field
                                                            if (parentFieldName) {
                                                                // Get the current value
                                                                const parentValue = getValues(parentFieldName);
                                                                // When checkbox is checked, clear and disable parent field
                                                                // When unchecked, restore the parent field's value
                                                                setValue(parentFieldName, checked ? "" : parentValue);
                                                            }
                                                        }}
                                                    />
                                                    <FormLabel htmlFor={`checkbox-${field.name}`} className="font-normal cursor-pointer">
                                                        {field.label}
                                                    </FormLabel>
                                                </div>
                                            )}
                                            {field.type === 'radio' && (
                                                <RadioGroup
                                                    onValueChange={formField.onChange}
                                                    defaultValue={formField.value}
                                                >
                                                    {field.options?.map((option) => (
                                                        <div key={option.value} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={option.value} />
                                                            <FormLabel>{option.label}</FormLabel>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        </div>
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

export default FormSectionRenderer; 