import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import type { FormField } from "@/utils/formUtils";
import { X } from "lucide-react";
import { buscarEnderecoPorCep } from '../selagem/api_cep'
import { estados as fetchEstados, getCidadesOptions } from '../../cidades_estados/api_estadosCidades'
import { estados } from '@/components/cidades_estados/estados';

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
  const [isOpen, setIsOpen] = useState(false);
  const { control, watch, setValue, getValues, setError, clearErrors } = useFormContext();
 const [estadoOptions, setEstadoOptions] = useState<{ label: string; value: string }[]>([]);

  const formValues = watch(`families[${familyIndex}]`);
  const key = slugify(integranteName);

  const integranteFields = allFields.filter((f) => f.name?.includes(`.${key}`));

  const cep = watch(`families[${familyIndex}].cepI.${key}`) || "";
  const cepLimpo = cep.replace(/\D/g, "");


  // 🔁 Carregar lista de estados (UFs) uma vez
  useEffect(() => {
    fetchEstados()
      .then((list) => {
        const options = list.map((e) => ({ label: e.nome, value: e.sigla }));
        const spIndex = options.findIndex((e) => e.label === "São Paulo");
        if (spIndex > -1) {
          const [sp] = options.splice(spIndex, 1);
          options.unshift(sp);
        }
        setEstadoOptions(options);
      })
      .catch((error) => {
        console.error("Erro ao buscar estados da API, usando fallback local:", error);
        const options = estados.map((e) => ({ label: e.label, value: e.value }));
        const spIndex = options.findIndex((e) => e.label === "São Paulo");
        if (spIndex > -1) {
          const [sp] = options.splice(spIndex, 1);
          options.unshift(sp);
        }
        setEstadoOptions(options);
      });
  }, []);

  useEffect(() => {
    if (cepLimpo.length !== 8) return;

    const logradouro = getValues(`families[${familyIndex}].logradouroI.${key}`);
    const bairro = getValues(`families[${familyIndex}].bairroI.${key}`);
    const uf = getValues(`families[${familyIndex}].ufI.${key}`);
    const cidade = getValues(`families[${familyIndex}].cidadeI.${key}`);

    const limparCampos = () => {
      if (!logradouro && !bairro && !uf && !cidade) {
        setValue(`families[${familyIndex}].logradouroI.${key}`, "");
        setValue(`families[${familyIndex}].bairroI.${key}`, "");
        setValue(`families[${familyIndex}].complementoI.${key}`, "");
        setValue(`families[${familyIndex}].ufI.${key}`, "");
        setValue(`families[${familyIndex}].cidadeI.${key}`, "");
      }
    };

    const buscar = async () => {
      try {
        const endereco = await buscarEnderecoPorCep(cepLimpo);
        clearErrors(`families[${familyIndex}].cepI.${key}`);

        setValue(`families[${familyIndex}].logradouroI.${key}`, endereco.logradouro || "");
        setValue(`families[${familyIndex}].bairroI.${key}`, endereco.bairro || "");
        setValue(`families[${familyIndex}].complementoI.${key}`, endereco.complemento || "");
        setValue(`families[${familyIndex}].ufI.${key}`, endereco.uf || "");
        setValue(`families[${familyIndex}].cidadeI.${key}`, endereco.cidade || "");
      } catch (error) {
        console.error("❌ Erro ao buscar CEP:", error);
        limparCampos();
        setError(`families[${familyIndex}].cepI.${key}`, {
          type: "manual",
          message: "CEP inválido ou não encontrado.",
        });
      }
    };

    buscar();
  }, [cepLimpo]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          ⋮
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden" style={{ maxHeight: "90vh" }}>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Detalhes de {integranteName}</h2>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fechar">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Conteúdo */}
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

export default IntegranteDialog;
