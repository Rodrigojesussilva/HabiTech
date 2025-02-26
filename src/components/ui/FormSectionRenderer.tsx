import React from 'react';
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
            type: 'text' | 'select' | 'checkbox' | 'radio';
            readonly?: boolean;
            options?: { label: string; value: string }[];
            dependent?: boolean;
            parentField?: string;
            disableField?: string;
        }[];
    };
    formControl: any;
    getFieldNumber: (sectionIndex: number, fieldIndex: number) => string;
    sectionIndex: number;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({ section, formControl, getFieldNumber, sectionIndex }) => {
    const { getValues, setValue } = useFormContext();

    return (
        <div key={section.id}>
            <div className="grid grid-cols-1 gap-6">
                {section.fields.map((field, fieldIndex) => {
                    const isDependent = field.dependent;
                    const parentFieldName = field.parentField;
                    const parentField = section.fields.find(f => f.name === parentFieldName);
                    const disableFieldName = field.disableField;

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
                                                    disabled={disableFieldName && getValues(`${disableFieldName}_disabled`)}
                                                />
                                            )}
                                            {field.type === 'select' && (
                                                <Select
                                                    onValueChange={formField.onChange}
                                                    defaultValue={formField.value}
                                                    disabled={disableFieldName && getValues(disableFieldName)}
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
                                                <div>
                                                    <Checkbox
                                                        id={`checkbox-${field.name}`}
                                                        checked={formField.value}
                                                        onCheckedChange={(checked) => {
                                                            formField.onChange(checked);
                                                            if (parentFieldName) {
                                                                const parentValue = getValues(parentFieldName);
                                                                setValue(parentFieldName, checked ? "" : parentValue);
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`checkbox-${field.name}`}>{field.label}</label>
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