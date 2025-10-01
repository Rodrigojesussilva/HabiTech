import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import type { FormField } from "@/utils/formUtils";
import { X } from "lucide-react"; // 👈 Ícone de fechar (caso use Lucide)

interface IntegranteDialogProps {
  integranteName: string;
  familyIndex: number;
  sectionIndex: number;
  allFields: FormField[];
}

function slugify(nome: string) {
  return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

const IntegranteDialog = ({
  integranteName,
  familyIndex,
  sectionIndex,
  allFields,
}: IntegranteDialogProps) => {
  const { control, watch } = useFormContext();
  const formValues = watch(`families[${familyIndex}]`);
  const key = slugify(integranteName);
  const integranteFields = allFields.filter((f) => f.name?.includes(`.${key}`));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          ⋮
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-3xl w-full p-0 overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Cabeçalho fixo */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Detalhes de {integranteName}</h2>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fechar">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Corpo com scroll */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(90vh - 136px)" }}>
          <FormSectionRenderer
            section={{
              id: `integrante_${key}`,
              title: "",
              fields: integranteFields,
            }}
            formControl={control}
            getFieldNumber={(_, fieldIndex) => `${sectionIndex + 1}.${fieldIndex + 1}`}
            sectionIndex={sectionIndex}
            formValues={formValues}
            showSectionLabel={false}
            familyIndex={familyIndex}
          />
        </div>

        {/* Rodapé fixo */}
        <div className="flex justify-end items-center gap-2 px-6 py-4 border-t sticky bottom-0 bg-white z-10">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegranteDialog;
