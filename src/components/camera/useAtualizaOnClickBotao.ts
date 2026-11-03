import { useMemo } from "react";
import { FormField } from "@/utils/formUtils"; // seu tipo

export function useAtualizaOnClickBotao(
  campos: FormField[],
  familyIndex: number,
  abrirCamera: (campoNome: string) => void
) {
  return useMemo(() => {
    return campos.map((field) => {
      if (field.type === "button" && field.insertAfterField) {
        const nomeCampoCompleto = `families[${familyIndex}].${field.insertAfterField}`;
        return {
          ...field,
          onClick: () => abrirCamera(nomeCampoCompleto),
        };
      }
      return field;
    });
  }, [campos, familyIndex, abrirCamera]);
}
