import { Button } from "@/components/ui/button";
import { useFormMetadata } from '@/hooks/useFormMetadata';
import { useEffect, useState } from 'react';

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
  const { form: globalForm } = useFormMetadata();
  const [form, setForm] = useState(globalForm || null);
  // Force re-render on any form change (watch) so SEI/Selo update after form.reset
  const [formVersion, setFormVersion] = useState(0);
  useEffect(() => {
    if (!form) return;
    const subscription: any = (form as any).watch(() => {
      setFormVersion((v) => v + 1);
    });
    return () => {
      if (typeof subscription === 'function') subscription();
      else if (subscription && typeof subscription.unsubscribe === 'function') subscription.unsubscribe();
    };
  }, [form]);

  void formVersion;

  // Detect when the global form becomes available after mount (e.g., after navigation from list)
  useEffect(() => {
    if (form) return; // already set
    let tries = 0;
    const id = setInterval(() => {
      const { form: current } = useFormMetadata();
      if (current) {
        setForm(current);
        clearInterval(id);
      }
      if (++tries > 50) clearInterval(id); // ~5s max
    }, 100);
    return () => clearInterval(id);
  }, [form]);

  const numberFamilies = form?.getValues("numberFamilies") || 1;
  const isArrolamento = formName === "Arrolamento";
  const sei = form?.getValues('seiNumber') || '-';
  const selo = form?.getValues('sealNumber') || '-';

  return (
    <div className="lg:hidden md:hidden bg-white border-b p-3 sticky top-0 z-40 shadow-sm">
      {/* LINHA 1: DADOS PRINCIPAIS */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">SEI:</span>
            <span className="text-sm font-mono font-medium">{sei}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Selo:</span>
            <span className="text-sm font-mono">{selo}</span>
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
                {form?.getValues('firstVisitStart')?.split(' - ')[1] || '-'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 