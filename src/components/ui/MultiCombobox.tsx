import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

interface MultiComboboxProps {
  options: Option[];
  value: string[] | undefined | null; // Pode receber undefined ou null
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiCombobox({
  options,
  value,
  onChange,
  placeholder = "Selecione uma ou mais opções",
  disabled = false,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);

  // Garantindo que "value" sempre seja um array para evitar erros
  const safeValue = Array.isArray(value) ? value : [];

  // Opções selecionadas, filtrando as opções que estão no safeValue
  const selectedOptions = options.filter((option) => safeValue.includes(option.value));

  // Alterna a seleção de um valor
  const toggleValue = (val: string) => {
    if (disabled) return;
    if (safeValue.includes(val)) {
      onChange(safeValue.filter((v) => v !== val));
    } else {
      onChange([...safeValue, val]);
    }
  };

  // Remove um valor da seleção
  const removeValue = (val: string) => {
    if (disabled) return;
    onChange(safeValue.filter((v) => v !== val));
  };

  // Handle para seleção pelo comando
  const handleSelect = (val: string) => {
    if (disabled) return;
    toggleValue(val);
    setOpen(false);
  };

  // Fechar popover se "disabled" mudar para true
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <Popover open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "flex w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            disabled && "opacity-60 cursor-not-allowed pointer-events-none"
          )}
          aria-expanded={open}
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  {opt.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(opt.value);
                      }}
                      className="hover:text-foreground"
                      aria-label={`Remover ${opt.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <div className="p-2 border-b">
              <CommandInput placeholder="Pesquisar..." className="h-9" />
            </div>

            <CommandEmpty className="py-4 px-2">Nenhuma opção encontrada.</CommandEmpty>

            <CommandList className="max-h-[240px] overflow-y-auto overflow-x-hidden">
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = safeValue.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "flex items-center cursor-pointer hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 flex-shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
