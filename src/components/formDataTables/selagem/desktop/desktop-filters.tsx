import { Button } from "@/components/ui/button";
import { FilterState } from "../shared/types";

interface DesktopFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onFilter: () => void;
  onClear: () => void;
  loading?: boolean;
}

export function DesktopFilters({ 
  filters, 
  onFiltersChange, 
  onFilter, 
  onClear, 
  loading = false 
}: DesktopFiltersProps) {
  const handleInputChange = (field: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex flex-col">
        <label htmlFor="created-by" className="text-sm font-medium text-gray-700">
          Criado por
        </label>
        <input
          type="text"
          id="created-by"
          className="border border-gray-300 rounded px-3 py-1 mt-1"
          value={filters.createdBy}
          onChange={(e) => handleInputChange('createdBy', e.target.value)}
          placeholder="Nome do criador"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="initial-date" className="text-sm font-medium text-gray-700">
          Data Inicial
        </label>
        <input
          type="date"
          id="initial-date"
          className="border border-gray-300 rounded px-3 py-1 mt-1"
          value={filters.initialDate}
          onChange={(e) => handleInputChange('initialDate', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
          Data Final
        </label>
        <input
          type="date"
          id="end-date"
          className="border border-gray-300 rounded px-3 py-1 mt-1"
          value={filters.endDate}
          onChange={(e) => handleInputChange('endDate', e.target.value)}
        />
      </div>

      <Button
        onClick={onFilter}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Carregando..." : "Filtrar"}
      </Button>

      <Button
        onClick={onClear}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        🗑️ Limpar
      </Button>
    </div>
  );
} 