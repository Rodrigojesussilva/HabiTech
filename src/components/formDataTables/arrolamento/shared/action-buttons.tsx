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
    ? "h-12 flex flex-col items-center gap-1" 
    : "cursor-pointer";
  
  const buttonSize = size === 'sm' ? 'sm' : undefined;
  const iconSize = "w-4 h-4";
  const padding = layout === 'horizontal' ? "p-0.5 md:p-1" : "";
  
  const containerClass = layout === 'grid' 
    ? "grid grid-cols-2 gap-2" 
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
        {layout === 'grid' && <span className="text-xs">Visualizar</span>}
      </Button>
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding}`}
        onClick={() => onEdit?.(item)}
        disabled={item.completed}
        title={item.completed ? 'Edição indisponível para visitas concluídas' : 'Editar'}
      >
        <PencilIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs">Editar</span>}
      </Button>
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding}`}
        onClick={() => onNewVisit?.(item)}
        disabled={!item.completed}
        title={!item.completed ? 'Finalize a visita atual para liberar nova visita' : 'Criar nova visita'}
      >
        <PlusIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs">Nova Visita</span>}
      </Button>
      
      <Button
        size={buttonSize}
        variant={layout === 'grid' ? 'outline' : 'ghost'}
        className={`${baseButtonClass} ${padding} ${layout === 'grid' ? 'text-red-600 hover:text-red-700' : ''}`}
        onClick={() => onDelete?.(item)}
        title="Deletar"
      >
        <TrashIcon className={iconSize} />
        {layout === 'grid' && <span className="text-xs">Deletar</span>}
      </Button>
    </div>
  );
} 