import { SelagemListProps } from "../shared/types";
import { CardItem } from "./card-item";

export function CardList({ data, onView, onEdit, onNewVisit, onDelete }: SelagemListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium mb-2">Nenhuma selagem encontrada</h3>
        <p className="text-sm text-center">
          Tente ajustar os filtros ou criar uma nova selagem.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {data.map((item) => (
        <CardItem
          key={item.id}
          item={item}
          onView={onView}
          onEdit={onEdit}
          onNewVisit={onNewVisit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 