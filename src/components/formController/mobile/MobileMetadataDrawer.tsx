import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FormSection } from "@/utils/formUtils";
import { useFormMetadata } from '@/hooks/useFormMetadata';

interface MobileMetadataDrawerProps {
  open: boolean;
  onClose: () => void;
  formName: string;
}

export function MobileMetadataDrawer({ 
  open, 
  onClose, 
  formName 
}: MobileMetadataDrawerProps) {
  const { form, metadata } = useFormMetadata();

  if (!form || !metadata) return null;

  const sidebarFields = metadata.fields.filter(field => field.sidebarform);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] lg:hidden md:hidden">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">
            📋 Dados de Controle - {formName}
          </SheetTitle>
          <SheetDescription className="text-left">
            Visualize e acesse os dados principais do formulário
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {sidebarFields.map(field => {
              const value = form.getValues(field.name);
              const displayValue = value || '-';
              
              return (
                <div key={field.name} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm font-medium text-gray-700">
                    {field.sidebarlabel || field.label || field.name}
                  </label>
                  <div className="text-sm text-gray-900 p-2 bg-white rounded border font-mono">
                    {field.name === 'firstVisitStart' || field.name === 'firstVisitEnd' 
                      ? displayValue 
                      : displayValue
                    }
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Botão para abrir modal completo */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-3">
              Para editar estes dados, use o modal completo:
            </p>
            <Button 
              className="w-full" 
              onClick={() => {
                onClose();
                // O modal será aberto pelo componente pai
                setTimeout(() => {
                  // Trigger para abrir o modal principal
                  const event = new CustomEvent('openMetadataModal');
                  window.dispatchEvent(event);
                }, 100);
              }}
            >
              ✏️ Abrir Editor Completo
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 