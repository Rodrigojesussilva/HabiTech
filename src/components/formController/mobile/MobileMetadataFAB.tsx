import { Button } from "@/components/ui/button";

interface MobileMetadataFABProps {
  setIsMetadataModalOpen: (open: boolean) => void;
  hasUnsavedChanges?: boolean;
}

export function MobileMetadataFAB({ 
  setIsMetadataModalOpen, 
  hasUnsavedChanges = false 
}: MobileMetadataFABProps) {
  return (
    <div className="lg:hidden md:hidden fixed bottom-20 right-4 z-50">
      <Button
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 relative"
        onClick={() => setIsMetadataModalOpen(true)}
      >
        {/* Indicador de mudanças não salvas */}
        {hasUnsavedChanges && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
        
        {/* Ícone principal */}
        <span className="text-lg">📋</span>
      </Button>
      
      {/* Tooltip opcional */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Dados de Controle
      </div>
    </div>
  );
} 