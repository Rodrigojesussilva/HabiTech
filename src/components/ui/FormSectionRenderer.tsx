import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
        }[];
    };
    formControl: any;
    getFieldNumber: (sectionIndex: number, fieldIndex: number) => string;
    sectionIndex: number;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({ section, formControl, getFieldNumber, sectionIndex }) => {
    return (
        <div key={section.id}>
            <h4 className="text-xl font-semibold mb-4">{sectionIndex + 1} - {section.title}</h4>
            <div className="grid grid-cols-1 gap-6">
                {section.fields.map((field, fieldIndex) => (
                    <FormField
                        key={field.name}
                        control={formControl}
                        name={field.name}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>{getFieldNumber(sectionIndex, fieldIndex)}. {field.label} *</FormLabel>
                                <FormControl>
                                    <div>
                                        {field.type === 'text' && (
                                            <Input
                                                {...formField}
                                                readOnly={field.readonly}
                                                className={field.readonly ? "bg-gray-100 cursor-not-allowed" : ""}
                                            />
                                        )}
                                        {field.type === 'select' && (
                                            <Select
                                                onValueChange={formField.onChange}
                                                defaultValue={formField.value}
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
                                            <Checkbox
                                                checked={formField.value}
                                                onCheckedChange={formField.onChange}
                                            />
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
                ))}
            </div>
        </div>
    );
};

export default FormSectionRenderer; 