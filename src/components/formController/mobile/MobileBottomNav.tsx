import { Button } from "@/components/ui/button";

interface FormSection {
  id: string;
  label: string;
}

interface MobileBottomNavProps {
  formDomSections: FormSection[];
  activeSection: string | null;
  handleSectionClick: (sectionId: string) => void;
}

export function MobileBottomNav({ 
  formDomSections, 
  activeSection, 
  handleSectionClick 
}: MobileBottomNavProps) {
  if (formDomSections.length === 0) return null;

  return (
    <div className="lg:hidden md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-40 shadow-lg">
      <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hide">
        {formDomSections.map((section, index) => {
          const isActive = activeSection === section.id;
          return (
            <Button
              key={section.id}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => handleSectionClick(section.id)}
              className={`flex-shrink-0 text-xs px-3 py-2 whitespace-nowrap ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary'
              }`}
            >
              {index + 1}. {section.id}
            </Button>
          );
        })}
      </div>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white via-gray-200 to-white"></div>
    </div>
  );
} 