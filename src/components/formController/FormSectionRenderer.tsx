import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { Combobox } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FormField as FormFieldType,
  evaluateConditions,
  FormSection,
} from "@/utils/formUtils";

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
  return (
    <div className="section mb-6">
      {showSectionLabel && section.title && (
        <h5 className="text-lg font-medium mb-4">{section.title}</h5>
      )}
      <div className="grid grid-cols-1 gap-4">
        {section.fields.map((field, fieldIndex) => {
          // Skip field if it doesn't meet its conditions
          if (handleModalFields && !field.showinmodal) {
            return null;
          }
          if (
            field.conditions &&
            !evaluateConditions(field.conditions, formValues)
          ) {
            return null;
          }

          const key =
            familyIndex !== null
              ? `family.${familyIndex}.${field.name}`
              : field.name;
          const name =
            familyIndex !== null
              ? `families[${familyIndex}].${field.name}`
              : field.name;
          // Check if this field should be disabled by a checkbox
          let isDisabled = field.readonly || false;

          // Find if this field is controlled by any checkbox in the section
          const controllingCheckbox = section.fields.find(
            (f) => f.type === "checkbox" && f.disableField === field.name
          );

          if (controllingCheckbox) {
            isDisabled = !!formValues[controllingCheckbox.name];
          }

          const isDependent = field.dependent;

          // Special handling for checkbox fields
          if (field.type === "checkbox") {
            return (
              <FormField
                key={key}
                control={formControl}
                name={name}
                render={({ field: JSONformField }) => (
                  <FormItem
                    className={`flex flex-row items-start space-x-3 space-y-0 ${
                      isDependent ? "ml-6" : ""
                    }`}
                  >
                    <FormControl>
                      <Checkbox
                        checked={JSONformField.value}
                        onCheckedChange={JSONformField.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {!isDependent &&
                          getFieldNumber(sectionIndex, fieldIndex) && (
                            <span className="mr-2">
                              {getFieldNumber(sectionIndex, fieldIndex)}
                            </span>
                          )}
                        {field.label}
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          // Special handling for label fields
          if (field.type === "label") {
            return (
              <FormItem key={key}>
                <FormLabel className="flex items-center">
                  <span className="mr-2">
                    {getFieldNumber(sectionIndex, fieldIndex)}
                  </span>
                  {field.label}
                </FormLabel>
              </FormItem>
            );
          }

          return (
            <FormField
              key={key}
              control={formControl}
              name={name}
              render={({ field: JSONformField }) => (
                <FormItem>
                  <FormLabel
                    className={`flex items-center ${isDependent ? "ml-6" : ""}`}
                  >
                    <span className="mr-2">
                      {!isDependent
                        ? getFieldNumber(sectionIndex, fieldIndex)
                        : ""}
                    </span>
                    {field.label}
                  </FormLabel>

                  <FormControl>
                    <div className={isDependent ? "ml-6" : ""}>
                      {renderFormField(
                        field,
                        {
                          ...JSONformField,
                          disabled: isDisabled,
                        },
                        formValues
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

// Helper function to render different field types
function renderFormField(
  field: FormFieldType,
  formField: any,
  formValues: Record<string, any>
) {
  switch (field.type) {
    case "label":
      return null; // Label fields are rendered directly in the form item, not in the form control

    case "numberSpinner":
      return (
        <Input
          type="number"
          {...formField}
          placeholder={field.placeholder}
          disabled={formField.disabled}
          min={0}
          max={field.max || undefined}
          step={field.step || 0.01}
          value={formField.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;

            // Permite limpar o campo
            if (rawValue === "") {
              formField.onChange("");
              return;
            }

            // Impede valores negativos e mais de duas casas decimais
            const numericRegex = /^(?:\d+|\d+\.\d{0,2})$/;

            // Se valor inválido (negativo ou mais de 2 decimais), ignora
            if (!numericRegex.test(rawValue)) {
              return;
            }

            // Converte para número e envia
            const value = Number(rawValue);
            formField.onChange(value);
          }}
          onKeyDown={(e) => {
            // Impede digitação de "-" e "e", que são permitidos por padrão em <input type="number">
            if (["-", "e", "E"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          className="flex w-[800px] rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      );

    case "textarea":
      return (
        <textarea
          {...formField}
          placeholder={field.placeholder}
          disabled={formField.disabled}
          value={formField.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            formField.onChange(e.target.value);
          }}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      );

    case "file":
      return (
        <Input
          type="file"
          disabled={formField.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            formField.onChange(file);
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      );

    case "text":
      return (
        <Input
          {...formField}
          placeholder={field.placeholder}
          disabled={formField.disabled}
          inputMode={field.inputMode}
          pattern={field.pattern}
          autoComplete={field.autoComplete}
          value={formField.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            const value = field.onChange ? field.onChange(raw) : raw;
            formField.onChange(value);
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      );

    case "select":
      return (
        <Select
          onValueChange={formField.onChange}
          value={formField.value || ""}
          disabled={formField.disabled}
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            checked={formField.value || false} // O valor pode ser um booleano
            disabled={formField.disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              formField.onChange(e.target.checked); // Retorna um valor booleano (checked)
            }}
            className="h-4 w-4 rounded border border-input bg-background"
          />
          <label htmlFor={field.name} className="text-sm">
            {field.placeholder}
          </label>
        </div>
      );

    case "radio":
      return (
        <RadioGroup
          defaultValue={formField.value}
          onValueChange={formField.onChange}
          disabled={formField.disabled}
        >
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${field.name}-${option.value}`}
              />
              <Label htmlFor={`${field.name}-${option.value}`}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "display":
      let displayValue = "";
      if (field.displayValue) {
        displayValue = field.displayValue(formValues);
      }
      return (
        <div className="p-2 border rounded bg-gray-50">{displayValue}</div>
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder={field.placeholder}
          disabled={formField.disabled}
          min={field.min}
          value={formField.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value =
              e.target.value === "" ? undefined : parseInt(e.target.value, 10);
            formField.onChange(value);
          }}
          className="w-32"
        />
      );

    case "email":
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex simples para validar o email

      // Função para verificar se o email é válido
      const isValidEmail = (email: string) => emailPattern.test(email);

      return (
        <div>
          <Input
            {...formField}
            type="email"
            placeholder={field.placeholder}
            disabled={formField.disabled}
            value={formField.value ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const email = e.target.value;
              formField.onChange(email);
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              // Aqui você pode implementar alguma ação quando o campo perde o foco
              if (!isValidEmail(e.target.value) && e.target.value !== "") {
                // Exibir algum erro se o email não for válido
                alert("Por favor, insira um email válido.");
              }
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            autoComplete="email" // Ajuda no preenchimento automático
          />
          {/* Mensagem de erro se o email não for válido */}
          {formField.value && !isValidEmail(formField.value) && (
            <div className="text-red-600 text-xs mt-1">
              Por favor, insira um email válido.
            </div>
          )}
        </div>
      );

    case "date":
      return (
        <input
          type="date"
          placeholder={field.placeholder || "aaaa-mm-dd"}
          disabled={formField.disabled}
          value={formField.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            formField.onChange(e.target.value);
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      );

    case "combobox":
      return (
        <Combobox
          options={field.options || []}
          value={formField.value}
          onChange={formField.onChange}
          placeholder={field.placeholder || "Selecione uma opção"}
        />
      );

    default:
      return null;
  }
}

export default FormSectionRenderer;
