import { Selagem } from "../shared/types";
import { StatusBadge } from "../shared/status-badge";
import { ActionButtons } from "../shared/action-buttons";

interface CardItemProps {
  item: Selagem;
  onView?: (item: Selagem) => void;
  onEdit?: (item: Selagem) => void;
  onNewVisit?: (item: Selagem) => void;
  onDelete?: (item: Selagem) => void;
}

export function CardItem({ item, onView, onEdit, onNewVisit, onDelete }: CardItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit", 
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg border p-3 shadow-sm w-full">
      {/* HEADER DO CARD */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {item.survey_id}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            SEI: {item.survey.main_metadata.numero_sei_nao_aplicavel ? 'N/A' : item.survey.main_metadata.numero_sei}
          </p>
        </div>
        <StatusBadge completed={item.completed} />
      </div>
      
      {/* INFORMAÇÕES PRINCIPAIS */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div>
          <span className="text-gray-500">Visita:</span>
          <span className="ml-1 font-medium">{item.visit_count}</span>
        </div>
        <div>
          <span className="text-gray-500">Criado:</span>
          <span className="ml-1">{formatDate(item.created_at)}</span>
        </div>
        {item.created_by && (
          <div className="col-span-2">
            <span className="text-gray-500">Por:</span>
            <span className="ml-1 truncate">{item.created_by}</span>
          </div>
        )}
      </div>
      
      {/* AÇÕES EM GRID 2x2 */}
      <ActionButtons
        item={item}
        onView={onView}
        onEdit={onEdit}
        onNewVisit={onNewVisit}
        onDelete={onDelete}
        layout="grid"
        size="sm"
      />
    </div>
  );
} 