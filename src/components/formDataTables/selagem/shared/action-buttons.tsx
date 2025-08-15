import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Selagem } from "./types";

interface ActionButtonsProps {
  item: Selagem;
  onView?: (item: Selagem) => void;
  onEdit?: (item: Selagem) => void;
  onNewVisit?: (item: Selagem) => void;
  onDelete?: (item: Selagem) => void;
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
        title="Visualizar selagem"
      >
        <EyeIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs leading-tight">Visualizar</span>}
      </Button>
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding}`}
        onClick={() => onEdit?.(item)}
        disabled={item.completed}
        title={item.completed ? 'Esta selagem já foi concluída e não pode ser editada' : 'Editar selagem'}
      >
        <PencilIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs leading-tight">Editar</span>}
      </Button>
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding}`}
        onClick={() => onNewVisit?.(item)}
        disabled={!item.completed}
        title={!item.completed ? 'Disponível somente quando concluída' : 'Nova visita'}
      >
        <PlusIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs leading-tight">Nova Visita</span>}
      </Button>
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding} ${layout === 'grid' ? 'text-red-600 hover:text-red-700' : ''}`}
        onClick={() => onDelete?.(item)}
        title="Deletar"
      >
        <TrashIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs leading-tight">Deletar</span>}
      </Button>
    </div>
  );
} 