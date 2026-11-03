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
import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
      <PopoverTrigger asChild>
        <button
          className={cn("flex w-full justify-between items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm", disabled && "opacity-60 cursor-not-allowed pointer-events-none")}
          aria-expanded={open}
          type="button"
          disabled={disabled}
        >
          <span className="flex-1 truncate text-left">
            {selectedOption ? selectedOption.label : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>

          <div className="flex items-center gap-1">
            {selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange("");
                  }
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Limpar seleção"
              >
                <X className="w-4 h-4" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </button>

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
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      option.value === value && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        option.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
