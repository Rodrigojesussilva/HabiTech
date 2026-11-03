import { useState, useRef, useEffect } from "react";
import { formatarTelefoneAuto } from "@/components/forms/residencial/helpers/infContato.helper"
import { useFormContext } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/infContato.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../../service/constants"

interface CaractUnidadeFormProps {
  sectionIndex?: number;
  familyIndex: number;
}

const InfContatoForm = ({
  sectionIndex: sectionNumber,
  familyIndex,
}: CaractUnidadeFormProps) => {
  const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);
  const [initialDate] = useState("")
  const [endDate] = useState("")
  //const [ok, setOk] = useState(false);
  const ok = false;

  const form = useFormContext();
  const formValues = form.watch(`families[${familyIndex}]`) || {};

  const [formSections] = useState(getMergedFormSections(formValues));

  const numeroComodos = form.watch(`families[${familyIndex}].numeroComodos`);
  const numeroPavimentos = form.watch(`families[${familyIndex}].numeroPavimentos`);
  const numeroSanitarios = form.watch(`families[${familyIndex}].numeroSanitarios`);

  const triggeredByBlurRef = useRef(false);

  const prevValuesRef = useRef<Record<string, any>>({
    numero_comodos: numeroComodos,
    numero_pavimentos: numeroPavimentos,
    numero_sanitarios: numeroSanitarios,
  });

  function isGetSelagemResponse(response: any): response is { selagens: any[] } {
    return response && Array.isArray(response.selagens);
  }

  const fetchSelagem = async (request: any) => {
    return await survey_resource.GetSelagem(request, async (req: any) => {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      }

      const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const res = await fetch(url, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...(req.headers || {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      return res.json();
    });
  };

  const fetchSelagemData = async () => {
    const seiFromStorageRaw = localStorage.getItem("seiNumberS");
    const seiFromStorage = seiFromStorageRaw;

    try {
      const selagemIdFromStorage = localStorage.getItem('selagemId') || '';
      const hasSelagemId = Boolean(selagemIdFromStorage);
      const numeroSei = hasSelagemId ? undefined : (seiFromStorage || undefined);

      const request: any = {
        initial_date: initialDate,
        end_date: endDate,
      };
      if (hasSelagemId) {
        request.id = selagemIdFromStorage;
      } else if (numeroSei) {
        request.numero_sei = numeroSei;
      }
      console.log('[CaractUnidade] GET selagem request', request);

      const response = await fetchSelagem(request);

      if (isGetSelagemResponse(response)) {
        await handleSelagemResponse(response);
      } else {
        console.warn("Resposta NÃO é do tipo GetSelagemResponse", response);
      }
    } catch (error) {
      console.error("Erro ao buscar selagens:", error);
      showErrorMessage("Erro ao buscar dados da selagem");
    }
  };

  const handleSelagemResponse = async (response: any) => {
    const selagem = response.selagens?.[0];
    if (selagem) {
      const selagemId = selagem.id;
      const criadoPor = selagem.created_by;

      localStorage.setItem("selagemId", selagemId);
      localStorage.setItem("selagemCreated_by", criadoPor);

      //console.log('Valores antes do envio:', { numeroComodos, numeroPavimentos, numeroSanitarios });

      const sanitizeField = (value: any) => {
        if (value === undefined || value === null) {
          return "";
        }
        return String(value);
      };

      const payload = {
        created_by: criadoPor,
        caracteristicas_unidade: {
          numero_comodos: sanitizeField(numeroComodos),
          numero_pavimentos: sanitizeField(numeroPavimentos),
          numero_sanitarios: sanitizeField(numeroSanitarios),
        },
      };

      try {
        await survey_resource.SendFormToSelagemCaracteristicasUnidade(SURVEY_RESOURCE_BASE_URL, selagemId, payload);
      } catch (error) {
        console.error("Erro ao enviar características da unidade:", error);
        showErrorMessage("Erro ao enviar os dados de características da unidade");
      }
    }
  };

  const hasSelagem = async (request: any): Promise<boolean> => {
    try {
      const response = await fetchSelagem(request);
      const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);
      return !isEmpty;
    } catch (error) {
      console.error("Erro ao verificar selagens:", error);
      return false;
    }
  };

  const showErrorMessage = (message: string) => {
    Swal.fire({
      icon: "error",
      html: `<div class="text-lg text-center break-words w-full -translate-y-2">${message}<br/><span class="text-sm">Veja o console para mais detalhes.</span></div>`,
      showConfirmButton: true,
      customClass: {
        popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
      },
    });
  };

  useEffect(() => {
    const camposTelefone = ['telefoneCelular', 'telefoneAdicional'];

    camposTelefone.forEach((campo) => {
      const valor = form.watch(`families[${familyIndex}].${campo}`);

      if (valor) {
        const formatted = formatarTelefoneAuto(valor);
        if (formatted !== valor) {
          form.setValue(`families[${familyIndex}].${campo}`, formatted);
        }
      }
    });
  }, [
    form.watch(`families[${familyIndex}].telefoneCelular`),
    form.watch(`families[${familyIndex}].telefoneAdicional`),
    familyIndex,
    form,
  ]);

  useEffect(() => {
    const handleBlur = async () => {
      const activeFieldName = document.activeElement?.getAttribute("name");
      const sanitizeField = (value: any) => {
        if (value == null || value === "") return "string"; // valor padrão aceito pela API
        return String(value);
      };
      const fields = {
        numero_comodos: sanitizeField(numeroComodos),
        numero_pavimentos: sanitizeField(numeroPavimentos),
        numero_sanitarios: sanitizeField(numeroSanitarios),
      };

      let shouldFetch = false;

      for (const [fieldKey, currentValue] of Object.entries(fields)) {
        const prevValue = prevValuesRef.current[fieldKey];

        // Só dispara se o campo mudou e não é o campo atualmente ativo
        if (currentValue !== prevValue && activeFieldName !== `families[${familyIndex}].${fieldKey}`) {
          shouldFetch = true;
          prevValuesRef.current[fieldKey] = currentValue;
        }
      }

      if (shouldFetch) {
        const selagemIdFromStorage = localStorage.getItem('selagemId') || '';
        const hasSelagemId = Boolean(selagemIdFromStorage);
        const seiNumber = hasSelagemId ? undefined : localStorage.getItem("seiNumberS") || undefined;
        const request: any = {
          initial_date: initialDate,
          end_date: endDate,
        };
        if (hasSelagemId) {
          request.id = selagemIdFromStorage;
        } else if (seiNumber) {
          request.numero_sei = seiNumber;
        }

        const hasData = await hasSelagem(request);
        if (!hasData) {
          console.log("Nenhuma Selagem Cadastrada");
          return;
        }

        triggeredByBlurRef.current = true;
        fetchSelagemData();
      }
    };

    window.addEventListener("blur", handleBlur, true);
    return () => {
      window.removeEventListener("blur", handleBlur, true);
    };
  }, [
    numeroComodos,
    numeroPavimentos,
    numeroSanitarios,
  ]);

  return (
    <div className="text-left">
      <Collapsible
        open={mostrarDocumentacao}
        onOpenChange={setMostrarDocumentacao}
      >
        <CollapsibleTrigger asChild>
          <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
            <h4
              className="text-xl font-semibold mb-4"
              data-secao={formSections[0].title}
            >
              {`Seção ${sectionNumber ? sectionNumber + 1 : 2} - ${formSections[0].title
                }${ok ? " ✅" : ""}`}
            </h4>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {formSections.map((section, sectionIndex) => (
            <FormSectionRenderer
              key={section.id}
              section={section}
              formControl={form.control}
              getFieldNumber={(_, fieldIndex) =>
                `${sectionNumber ? sectionNumber + 1 : 2}.${fieldIndex + 1}`
              }
              sectionIndex={sectionIndex}
              formValues={formValues}
              showSectionLabel={false}
              familyIndex={familyIndex}
            />
          ))}

          {/* 
<div className="mt-4 w-full flex justify-start">
  <button
    type="button"
    className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
    onClick={() => {
      console.log("Botão clicado!");
    }}
  >
    Salvar
  </button>
</div> 
*/}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default InfContatoForm;
