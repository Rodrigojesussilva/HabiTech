import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/selagem/definitions/CaracInfraUrbUnid.definition";
// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { API_BASE_URL } from "../../../../service/constants"

interface IdentEticRacGeneFormProps {
  id?: string;
  sectionIndex?: number;
  familyIndex: number;
}

const CaracInfraUrbUnidForm = ({
  sectionIndex: sectionNumber,
  familyIndex,
}: IdentEticRacGeneFormProps) => {
  const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
  const [initialDate] = useState("")
  const [endDate] = useState("")
  const form = useFormContext();
  // Get form values for conditional logic
  const formValues = form.watch(`families[${familyIndex}]`) || {};

  // Get merged form sections with conditional fields included
  const formSections = getMergedFormSections(formValues);

  // Supondo que você já capturou todos esses campos com form.watch conforme exemplo anterior:
  const materialPredominante = form.watch(`families[${familyIndex}].materialPredominante`);
  const outroMaterialPredominante = form.watch(`families[${familyIndex}].outroMaterialPredominante`);
  const unidadeInsalubre = form.watch(`families[${familyIndex}].unidadeInsalubre`);
  const peDireitoAtendente230 = form.watch(`families[${familyIndex}].peDireitoAtendente230`);
  const iluminicaoNatural = form.watch(`families[${familyIndex}].iluminicaoNatural`);
  const areaVentilacao = form.watch(`families[${familyIndex}].areaVentilacao`);
  const infiltracaoMofo = form.watch(`families[${familyIndex}].infiltracaoMofo`);
  const cozinhaVentilacaoNatural = form.watch(`families[${familyIndex}].cozinhaVentilacaoNatural`);
  const cozinhaSalubridade = form.watch(`families[${familyIndex}].cozinhaSalubridade`);
  const banheiroVentilacaoNatural = form.watch(`families[${familyIndex}].banheiroVentilacaoNatural`);
  const banheiroSalubridade = form.watch(`families[${familyIndex}].banheiroSalubridade`);
  const demaisComodosVentilacaoNatural = form.watch(`families[${familyIndex}].demaisComodosVentilacaoNatural`);
  const demaisComodosSalubridade = form.watch(`families[${familyIndex}].demaisComodosSalubridade`);
  const abastecimentoAgua = form.watch(`families[${familyIndex}].abastecimentoAgua`);
  const outroAbastecimentoAgua = form.watch(`families[${familyIndex}].outroAbastecimentoAgua`);
  const esgotamentoSanitario = form.watch(`families[${familyIndex}].esgotamentoSanitario`);
  const outroEsgotamentoSanitario = form.watch(`families[${familyIndex}].outroEsgotamentoSanitario`);
  const ligacaoEletrica = form.watch(`families[${familyIndex}].ligacaoEletrica`);
  const outroLigacaoEletrica = form.watch(`families[${familyIndex}].outroLigacaoEletrica`);

  const triggeredByBlurRef = useRef(false);

  // Inicializa prevValuesRef com todos os campos para monitorar mudanças
  const prevValuesRef = useRef<Record<string, any>>({
    materialPredominante,
    outroMaterialPredominante,
    unidadeInsalubre,
    peDireitoAtendente230,
    iluminicaoNatural,
    areaVentilacao,
    infiltracaoMofo,
    cozinhaVentilacaoNatural,
    cozinhaSalubridade,
    banheiroVentilacaoNatural,
    banheiroSalubridade,
    demaisComodosVentilacaoNatural,
    demaisComodosSalubridade,
    abastecimentoAgua,
    outroAbastecimentoAgua,
    esgotamentoSanitario,
    outroEsgotamentoSanitario,
    ligacaoEletrica,
    outroLigacaoEletrica,
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

      const url = `${API_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
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

  const fetchSelagemData = async () => {
    const seiFromStorageRaw = localStorage.getItem("seiNumberS");
    const seiFromStorage = Number(seiFromStorageRaw);

    try {
      const request = {
        numero_sei: seiFromStorage,
        initial_date: initialDate,
        end_date: endDate,
      };

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

      const sanitizeField = (value: any) => {
        if (value === undefined || value === null) return "";
        return String(value);
      };

      // Mapeie suas variáveis atuais para os nomes esperados pela API:
      const payload = {
        created_by: criadoPor,
        caracteristicas_infra_urbana: {
          abastecimento_agua: sanitizeField(abastecimentoAgua),
          banheiro: sanitizeField(banheiroVentilacaoNatural),
          cozinha: sanitizeField(cozinhaVentilacaoNatural),
          demais_comodos: sanitizeField(demaisComodosVentilacaoNatural),
          descricao_banheiro: sanitizeField(banheiroSalubridade),
          descricao_cozinha: sanitizeField(cozinhaSalubridade),
          descricao_demais_comodos: sanitizeField(demaisComodosSalubridade),
          descricao_infiltracao_mofo: "",  // ajustar se tiver um campo específico
          descricao_ligacao_eletrica: sanitizeField(outroLigacaoEletrica),
          descricao_material: "",
          descricao_pe_direito: "",
          destino_domestico: "",
          destino_organico: "",
          destino_reciclavel: "",
          esgotamento_sanitario: sanitizeField(esgotamentoSanitario),
          iluminacao_natural: sanitizeField(iluminicaoNatural),
          infiltracao_mofo: sanitizeField(infiltracaoMofo),
          insalubridade: sanitizeField(unidadeInsalubre),
          janelas_externas: "",
          ligacao_eletrica: sanitizeField(ligacaoEletrica),
          material_parede: sanitizeField(materialPredominante),
          outro_abastecimento_agua: sanitizeField(outroAbastecimentoAgua),
          outro_destino_domestico: "",
          outro_destino_organico: "",
          outro_destino_reciclavel: "",
          outro_esgoto: sanitizeField(outroEsgotamentoSanitario),
          pe_direito: sanitizeField(peDireitoAtendente230),
          separacao_residuos: "",
        },
      };

      try {
        await survey_resource.SendFormToSelagemInfraUrbana(API_BASE_URL, selagemId, payload);
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

  useEffect(() => {
    const handleBlur = async () => {
      const activeFieldName = document.activeElement?.getAttribute("name");
      const sanitizeField = (value: any) => {
        if (value == null || value === "") return "string"; // valor padrão aceito pela API
        return String(value);
      };

      const fields = {
        materialPredominante: sanitizeField(materialPredominante),
        outroMaterialPredominante: sanitizeField(outroMaterialPredominante),
        unidadeInsalubre: sanitizeField(unidadeInsalubre),
        peDireitoAtendente230: sanitizeField(peDireitoAtendente230),
        iluminicaoNatural: sanitizeField(iluminicaoNatural),
        areaVentilacao: sanitizeField(areaVentilacao),
        infiltracaoMofo: sanitizeField(infiltracaoMofo),
        cozinhaVentilacaoNatural: sanitizeField(cozinhaVentilacaoNatural),
        cozinhaSalubridade: sanitizeField(cozinhaSalubridade),
        banheiroVentilacaoNatural: sanitizeField(banheiroVentilacaoNatural),
        banheiroSalubridade: sanitizeField(banheiroSalubridade),
        demaisComodosVentilacaoNatural: sanitizeField(demaisComodosVentilacaoNatural),
        demaisComodosSalubridade: sanitizeField(demaisComodosSalubridade),
        abastecimentoAgua: sanitizeField(abastecimentoAgua),
        outroAbastecimentoAgua: sanitizeField(outroAbastecimentoAgua),
        esgotamentoSanitario: sanitizeField(esgotamentoSanitario),
        outroEsgotamentoSanitario: sanitizeField(outroEsgotamentoSanitario),
        ligacaoEletrica: sanitizeField(ligacaoEletrica),
        outroLigacaoEletrica: sanitizeField(outroLigacaoEletrica),
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
        const seiNumber = localStorage.getItem("seiNumberS");
        const request = {
          numero_sei: Number(seiNumber),
          initial_date: initialDate,
          end_date: endDate,
        };

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
    materialPredominante,
    outroMaterialPredominante,
    unidadeInsalubre,
    peDireitoAtendente230,
    iluminicaoNatural,
    areaVentilacao,
    infiltracaoMofo,
    cozinhaVentilacaoNatural,
    cozinhaSalubridade,
    banheiroVentilacaoNatural,
    banheiroSalubridade,
    demaisComodosVentilacaoNatural,
    demaisComodosSalubridade,
    abastecimentoAgua,
    outroAbastecimentoAgua,
    esgotamentoSanitario,
    outroEsgotamentoSanitario,
    ligacaoEletrica,
    outroLigacaoEletrica,
  ]);

  return (
    <div className="text-left">
      <Collapsible
        open={mostrarIdentificacao}
        onOpenChange={setMostrarIdentificacao}
      >
        <CollapsibleTrigger asChild>
          <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
            <h4
              className="text-xl font-semibold mb-4"
              data-secao={formSections[0].title}
            >{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title
              }`}</h4>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {formSections.map((section, sectionIndex) => (
            <FormSectionRenderer
              key={section.id}
              section={section}
              formControl={form.control}
              getFieldNumber={(_, fieldIndex) =>
                `${sectionNumber ? sectionNumber + 1 : 4}.${fieldIndex + 1}`
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

export default CaracInfraUrbUnidForm;
