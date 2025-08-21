import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Arrolamento } from "./types";

interface ActionButtonsProps {
  item: Arrolamento;
  onView?: (item: Arrolamento) => void;
  onEdit?: (item: Arrolamento) => void;
  onNewVisit?: (item: Arrolamento) => void;
  onDelete?: (item: Arrolamento) => void;
  layout?: 'horizontal' | 'grid';
  size?: 'sm' | 'default';
}

export function ActionButtons({ 
  item, 
  onView, 
  onEdit, 
  onNewVisit, 
  onDelete, 
  layout = 'horizontal',
  size = 'default'
}: ActionButtonsProps) {
  const baseButtonClass = layout === 'grid' 
    ? "h-11 flex flex-col items-center gap-1 text-xs" 
    : "cursor-pointer";
  
  const buttonSize = size === 'sm' ? 'sm' : undefined;
  const iconSize = "w-4 h-4";
  const padding = layout === 'horizontal' ? "p-0.5 md:p-1" : "";
  
  const containerClass = layout === 'grid' 
    ? "grid grid-cols-2 gap-1.5" 
    : "flex items-center justify-center gap-0.5 md:gap-1 px-1 py-1 md:px-2 md:py-1";

  return (
    <div className={containerClass}>
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding}`}
        onClick={() => onView?.(item)}
        title="Visualizar"
      >
        <EyeIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs leading-tight">Visualizar</span>}
      </Button>
      
      {(() => {
        const currentUserEmail = localStorage.getItem('userEmail') || '';
        const canEdit = item.created_by === currentUserEmail;
        return (
          <Button
            size={buttonSize}
            variant={layout === 'grid' ? 'outline' : 'ghost'}
            className={`${baseButtonClass} ${padding} ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => onEdit?.(item)}
            disabled={!canEdit}
            title={!canEdit ? 'Você não tem permissão para editar este arrolamento' : 'Editar'}
          >
            <PencilIcon className={iconSize} />
            {layout === 'grid' && <span className="text-xs leading-tight">Editar</span>}
          </Button>
        );
      })()}
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding}`}
        onClick={() => onNewVisit?.(item)}
        disabled={!item.completed}
        title={!item.completed ? 'Finalize a visita atual para liberar nova visita' : 'Criar nova visita'}
      >
        <PlusIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs leading-tight">Nova Visita</span>}
      </Button>
      
      {(() => {
        const currentUserEmail = localStorage.getItem('userEmail') || '';
        const canDelete = item.created_by === currentUserEmail;
        return (
          <Button
            size={buttonSize}
            variant={layout === 'grid' ? 'outline' : 'ghost'}
            className={`${baseButtonClass} ${padding} ${layout === 'grid' ? 'text-red-600 hover:text-red-700' : ''} ${!canDelete ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => onDelete?.(item)}
            disabled={!canDelete}
            title={!canDelete ? 'Você não tem permissão para deletar este arrolamento' : 'Deletar'}
          >
            <TrashIcon className={iconSize} />
            {layout === 'grid' && <span className="text-xs leading-tight">Deletar</span>}
          </Button>
        );
      })()}
    </div>
  );
} 