import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { FormSectionRenderer } from "@/components/formController/FormSectionRenderer";
import type { FormField } from "@/utils/formUtils";
import { X } from "lucide-react";

interface AnimalDialogProps {
  animalName: string;
  familyIndex: number;
  sectionIndex: number;
  allFields: FormField[];
}

function slugify(nome: string) {
  return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

const AnimalDialog = ({
  animalName,
  familyIndex,
  sectionIndex,
  allFields,
}: AnimalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { control, watch } = useFormContext();
  const formValues = watch(`families[${familyIndex}]`);
  const key = slugify(animalName);

  const animalFields = allFields.filter((f) => f.name?.includes(`.${key}`));

  // 🎯 Watch no campo tipoAnimal do animal atual
  const tipoAnimalMap = watch(`families[${familyIndex}].tipoAnimal`);
  const tipoAnimal = tipoAnimalMap?.[key];

  // ✅ useEffect para reagir quando o dialog for aberto e o campo tiver valor
  useEffect(() => {
    if (isOpen && tipoAnimal) {
      console.log(`🐶 Tipo do animal "${animalName}":`, tipoAnimal);
      // Coloque aqui qualquer lógica adicional
    }
  }, [isOpen, tipoAnimal, animalName]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          ⋮
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden" style={{ maxHeight: "90vh" }}>
        {/* Cabeçalho fixo com acessibilidade */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <DialogTitle className="text-lg font-semibold">Detalhes de {animalName}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fechar">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Conteúdo do formulário */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(90vh - 136px)" }}>
          <FormSectionRenderer
            section={{
              id: `animal_${key}`,
              title: "",
              fields: animalFields,
            }}
            formControl={control}
            getFieldNumber={(_, fieldIndex) => `${sectionIndex + 1}.${fieldIndex + 1}`}
            sectionIndex={sectionIndex}
            formValues={formValues}
            showSectionLabel={false}
            familyIndex={familyIndex}
          />
        </div>

        {/* Rodapé */}
        <div className="flex justify-end items-center gap-2 px-6 py-4 border-t sticky bottom-0 bg-white z-10">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnimalDialog;
