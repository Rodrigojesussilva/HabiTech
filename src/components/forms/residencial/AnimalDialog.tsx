import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { FormSectionRenderer } from "@/components/formController/FormSectionRenderer";
import type { FormField } from "@/utils/formUtils"; // ⚠️ ajuste o caminho conforme sua estrutura

interface AnimalDialogProps {
  animalName: string;
  familyIndex: number;
  sectionIndex: number;
  allFields: FormField[]; // ✅ agora recebe os campos da seção inteira
}

function slugify(nome: string) {
  return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

const AnimalDialog = ({ animalName, familyIndex, sectionIndex, allFields }: AnimalDialogProps) => {
  const { control, watch } = useFormContext();
  const formValues = watch(`families[${familyIndex}]`);
  const key = slugify(animalName);

  // ✅ Pega apenas os campos relacionados a este animal, na ordem correta
  const animalFields = allFields.filter(f =>
    f.name?.includes(`.${key}`)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          ⋮
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Detalhes de {animalName}</h2>
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
      </DialogContent>
    </Dialog>
  );
};

export default AnimalDialog;
