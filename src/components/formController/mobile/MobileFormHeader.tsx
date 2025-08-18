import { Button } from "@/components/ui/button";
import { useFormMetadata } from '@/hooks/useFormMetadata';

interface MobileFormHeaderProps {
  activeFamilyIndex: number;
  handleFamilyIndexChange: (index: number) => void;
  setIsMetadataModalOpen: (open: boolean) => void;
  formName: string;
}

export function MobileFormHeader({ 
  activeFamilyIndex, 
  handleFamilyIndexChange, 
  setIsMetadataModalOpen,
  formName 
}: MobileFormHeaderProps) {
  const { form } = useFormMetadata();

  if (!form) return null;

  const numberFamilies = form.getValues("numberFamilies") || 1;
  const isArrolamento = formName === "Arrolamento";

  return (
    <div className="lg:hidden md:hidden bg-white border-b p-3 sticky top-0 z-40 shadow-sm">
      {/* LINHA 1: DADOS PRINCIPAIS */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">SEI:</span>
            <span className="text-sm font-mono font-medium">
              {form.getValues('seiNumber') || '-'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Selo:</span>
            <span className="text-sm font-mono">
              {form.getValues('sealNumber') || '-'}
            </span>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setIsMetadataModalOpen(true)}
          className="text-xs px-3"
        >
          📋 Dados
        </Button>
      </div>
      
      {/* LINHA 2: NAVEGAÇÃO DE FAMÍLIA (só para Arrolamento) */}
      {isArrolamento && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Família:</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleFamilyIndexChange(Math.max(0, activeFamilyIndex - 1))}
              disabled={activeFamilyIndex <= 0}
              className="h-8 w-8 p-0"
            >
              ⬅️
            </Button>
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded min-w-[3rem] text-center">
              {activeFamilyIndex + 1}/{numberFamilies}
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleFamilyIndexChange(Math.min(numberFamilies - 1, activeFamilyIndex + 1))}
              disabled={activeFamilyIndex >= numberFamilies - 1}
              className="h-8 w-8 p-0"
            >
              ➡️
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Início:</span>
              <span className="font-mono">
                {form.getValues('firstVisitStart')?.split(' - ')[1] || '-'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 