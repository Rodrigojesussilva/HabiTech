import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { FilterState } from "../shared/types";

interface MobileFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onFilter: () => void;
  onClear: () => void;
  loading?: boolean;
}

export function MobileFilters({ 
  filters, 
  onFiltersChange, 
  onFilter, 
  onClear, 
  loading = false 
}: MobileFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const hasAdvancedFilters = filters.createdBy || filters.initialDate || filters.endDate;

  return (
    <div className="space-y-4">
      {/* SEARCH BAR PRINCIPAL */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          placeholder="Nome criador, SEI ou ID..."
          value={filters.searchQuery}
          onChange={(e) => handleInputChange('searchQuery', e.target.value)}
        />
      </div>
      
      {/* BOTÕES PRINCIPAIS */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex-1 relative"
        >
          <FilterIcon className="w-4 h-4 mr-2" />
          Filtros {showAdvanced ? '▼' : '▶'}
          {hasAdvancedFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
          )}
        </Button>
        
        <Button
          onClick={onFilter}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Carregando..." : "Buscar"}
        </Button>
      </div>
      
      {/* FILTROS AVANÇADOS COLLAPSIBLE */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-md border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Criado por
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Nome do criador"
              value={filters.createdBy}
              onChange={(e) => handleInputChange('createdBy', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.initialDate}
                onChange={(e) => handleInputChange('initialDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onClear}
            className="w-full"
          >
            🗑️ Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
} 