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
import { buscarEnderecoPorCep } from "../selagem/api_cep";
import { estados as fetchEstados } from "../../cidades_estados/api_estadosCidades";
import { estados as estadosFallback } from "@/components/cidades_estados/estados";
import { cidadesLocais } from "@/components/cidades_estados/cidade";
import { mask, unMask } from 'remask';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { formatarTelefoneAuto } from "@/components/forms/residencial/helpers/infContato.helper"
interface IntegranteDialogProps {
  integranteName: string;
  familyIndex: number;
  sectionIndex: number;
  allFields: FormField[];
}

function slugify(nome: string) {
  return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

type Uf = keyof typeof cidadesLocais;

const IntegranteDialog = ({
  integranteName,
  familyIndex,
  sectionIndex,
  allFields,
}: IntegranteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { control, watch, setValue, getValues, setError, clearErrors } = useFormContext();

  const [estadoOptions, setEstadoOptions] = useState<{ label: string; value: string }[]>([]);
  const [cidadeOptions, setCidadeOptions] = useState<{ label: string; value: string }[]>([]);
  const [cidadeOptionsTrabalho, setCidadeOptionsTrabalho] = useState<{ label: string; value: string }[]>([]);

  const key = slugify(integranteName);
  const formValues = watch(`families[${familyIndex}]`);
  const integranteFields = allFields.filter((f) => f.name?.includes(`.${key}`));

  const cep = watch(`families[${familyIndex}].cepI.${key}`) || "";
  const cepLimpo = cep.replace(/\D/g, "");
  // Pega o CEP do trabalho e limpa só os números
  const cepTrabalho = watch(`families[${familyIndex}].cepTrabalho.${key}`) || "";
  const cepTrabalhoLimpo = cepTrabalho.replace(/\D/g, "");
  const ufSelecionada = watch(`families[${familyIndex}].ufI.${key}`) as Uf | "";
  const cidadeSelecionada = watch(`families[${familyIndex}].cidadeI.${key}`) || "";

  const ufTrabalhoSelecionada = watch(`families[${familyIndex}].ufTrabalho.${key}`) as Uf | "";
  const cidadeTrabalhoSelecionada = watch(`families[${familyIndex}].cidadeTrabalho.${key}`) || "";


  // Apenas letras para nome
  useEffect(() => {
    const nome = watch(`families[${familyIndex}].nomeIntegrante.${key}`);
    if (nome) {
      const nomeSomenteLetras = nome.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
      if (nome !== nomeSomenteLetras) {
        setValue(`families[${familyIndex}].nomeIntegrante.${key}`, nomeSomenteLetras);
      }
    }
  }, [watch(`families[${familyIndex}].nomeIntegrante.${key}`)]);

  // Apenas letras para nome social
  useEffect(() => {
    const nomeSocial = watch(`families[${familyIndex}].nomeSocialIntegrante.${key}`);
    if (nomeSocial) {
      const nomeSocialSomenteLetras = nomeSocial.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
      if (nomeSocial !== nomeSocialSomenteLetras) {
        setValue(`families[${familyIndex}].nomeSocialIntegrante.${key}`, nomeSocialSomenteLetras);
      }
    }
  }, [watch(`families[${familyIndex}].nomeSocialIntegrante.${key}`)]);

  // Máscaras e rg
  useEffect(() => {
    const timeout = setTimeout(() => {
      const rgRaw = getValues(`families[${familyIndex}].numeroRGI.${key}`);
      if (!rgRaw) return;

      // Se tiver letras, não aplica máscara
      const hasLetters = /[A-Za-z]/.test(rgRaw);
      if (hasLetters) return;

      // Limpa e aplica a máscara se for só números
      let digits = rgRaw.replace(/\D/g, "").slice(0, 9);
      if (digits.length >= 2) {
        digits = digits.replace(/^(\d{2})(\d)/, "$1.$2");
      }
      if (digits.length >= 5) {
        digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      }
      if (digits.length === 9) {
        digits = digits.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      }

      setValue(`families[${familyIndex}].numeroRGI.${key}`, digits);
    }, 500); // Espera o usuário parar de digitar

    return () => clearTimeout(timeout);
  }, [watch(`families[${familyIndex}].numeroRGI.${key}`)]);

  // Máscara e validação de CPF
  useEffect(() => {
    const timeout = setTimeout(() => {
      const pathCpf = `families[${familyIndex}].numeroCPFI.${key}`;
      const cpfRaw = getValues(pathCpf);

      if (!cpfRaw) return;

      if (/[A-Za-z]/.test(cpfRaw)) return; // Não aplica máscara se tiver letras

      const onlyNumbers = unMask(cpfRaw);
      const maskedCpf = mask(onlyNumbers, ['999.999.999-99']);

      setValue(pathCpf, maskedCpf, { shouldValidate: false });

      clearErrors(pathCpf);

      if (!cpfValidator.isValid(onlyNumbers)) {
        setError(pathCpf, {
          type: 'manual',
          message: 'CPF inválido.',
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [watch(`families[${familyIndex}].numeroCPFI.${key}`)]);

  // Efeitos para limpar e desabilitar campos quando "não se aplica" é marcado
  useEffect(() => {
    const pathCheckbox = `families[${familyIndex}].filiacao1_naoSeAplica.${key}`;
    const pathInput = `families[${familyIndex}].filiacao1_nome.${key}`;
    const naoSeAplica = watch(pathCheckbox);

    if (naoSeAplica) {
      // Limpa o campo se checkbox estiver marcado
      setValue(pathInput, "");

      // Marca o campo como desabilitado (se necessário)
      const inputElement = document.querySelector<HTMLInputElement>(`[name="${pathInput}"]`);
      if (inputElement) inputElement.disabled = true;
    } else {
      // Reabilita o campo se checkbox for desmarcado
      const inputElement = document.querySelector<HTMLInputElement>(`[name="${pathInput}"]`);
      if (inputElement) inputElement.disabled = false;
    }
  }, [watch(`families[${familyIndex}].filiacao1_naoSeAplica.${key}`)]);

  // Efeitos para limpar e desabilitar campos quando "não se aplica" é marcado
  useEffect(() => {
    const pathCheckbox = `families[${familyIndex}].filiacao2_naoSeAplica.${key}`;
    const pathInput = `families[${familyIndex}].filiacao2_nome.${key}`;
    const naoSeAplica = watch(pathCheckbox);

    if (naoSeAplica) {
      // Limpa o campo se checkbox estiver marcado
      setValue(pathInput, "");

      // Desabilita o campo manualmente
      const inputElement = document.querySelector<HTMLInputElement>(`[name="${pathInput}"]`);
      if (inputElement) inputElement.disabled = true;
    } else {
      // Reabilita o campo se checkbox for desmarcado
      const inputElement = document.querySelector<HTMLInputElement>(`[name="${pathInput}"]`);
      if (inputElement) inputElement.disabled = false;
    }
  }, [watch(`families[${familyIndex}].filiacao2_naoSeAplica.${key}`)]);

  //carrega estados
  useEffect(() => {
    fetchEstados()
      .then((list) => {
        const options = list.map((e) => ({
          label: e.nome,
          value: e.sigla,
        }));
        const spIndex = options.findIndex((e) => e.label === "São Paulo");
        if (spIndex > -1) {
          const [sp] = options.splice(spIndex, 1);
          options.unshift(sp);
        }
        setEstadoOptions(options);
      })
      .catch((error) => {
        console.error("Erro ao buscar estados da API, usando fallback local:", error);
        const fallback = estadosFallback.map((e) => ({
          label: e.label,
          value: e.value,
        }));
        const spIndex = fallback.findIndex((e) => e.label === "São Paulo");
        if (spIndex > -1) {
          const [sp] = fallback.splice(spIndex, 1);
          fallback.unshift(sp);
        }
        setEstadoOptions(fallback);
      });
  }, []);

  function isUf(value: any): value is Uf {
    return value in cidadesLocais;
  }
  //cidade pra instituição de ensino
  useEffect(() => {
    if (!ufSelecionada || !isUf(ufSelecionada)) {
      setCidadeOptions([]);
      return;
    }

    const cidades = [...cidadesLocais[ufSelecionada]];
    if (ufSelecionada === "SP") {
      const spIndex = cidades.findIndex((c) => c.label === "São Paulo");
      if (spIndex > -1) {
        const [spCity] = cidades.splice(spIndex, 1);
        cidades.unshift(spCity);
      }
    }

    setCidadeOptions(cidades);
  }, [ufSelecionada]);

  //cidade pra instituição de trabalho
  useEffect(() => {
    if (!ufTrabalhoSelecionada || !isUf(ufTrabalhoSelecionada)) {
      setCidadeOptionsTrabalho([]);
      return;
    }

    const cidades = [...cidadesLocais[ufTrabalhoSelecionada]];
    if (ufTrabalhoSelecionada === "SP") {
      const spIndex = cidades.findIndex((c) => c.label === "São Paulo");
      if (spIndex > -1) {
        const [spCity] = cidades.splice(spIndex, 1);
        cidades.unshift(spCity);
      }
    }

    setCidadeOptionsTrabalho(cidades);
  }, [ufTrabalhoSelecionada]);

  //carrega cep para isntituição de ensino
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

  useEffect(() => {
    if (cepTrabalhoLimpo.length !== 8) return;

    const logradouro = getValues(`families[${familyIndex}].logradouroTrabalho.${key}`);
    const bairro = getValues(`families[${familyIndex}].bairroTrabalho.${key}`);
    const uf = getValues(`families[${familyIndex}].ufTrabalho.${key}`);
    const cidade = getValues(`families[${familyIndex}].cidadeTrabalho.${key}`);

    const limparCampos = () => {
      if (!logradouro && !bairro && !uf && !cidade) {
        setValue(`families[${familyIndex}].logradouroTrabalho.${key}`, "");
        setValue(`families[${familyIndex}].bairroTrabalho.${key}`, "");
        setValue(`families[${familyIndex}].complementoTrabalho.${key}`, "");
        setValue(`families[${familyIndex}].ufTrabalho.${key}`, "");
        setValue(`families[${familyIndex}].cidadeTrabalho.${key}`, "");
      }
    };

    const buscar = async () => {
      try {
        const endereco = await buscarEnderecoPorCep(cepTrabalhoLimpo);
        clearErrors(`families[${familyIndex}].cepTrabalho.${key}`);

        setValue(`families[${familyIndex}].logradouroTrabalho.${key}`, endereco.logradouro || "");
        setValue(`families[${familyIndex}].bairroTrabalho.${key}`, endereco.bairro || "");
        setValue(`families[${familyIndex}].complementoTrabalho.${key}`, endereco.complemento || "");
        setValue(`families[${familyIndex}].ufTrabalho.${key}`, endereco.uf || "");
        setValue(`families[${familyIndex}].cidadeTrabalho.${key}`, endereco.cidade || "");
      } catch (error) {
        console.error("❌ Erro ao buscar CEP do trabalho:", error);
        limparCampos();
        setError(`families[${familyIndex}].cepTrabalho.${key}`, {
          type: "manual",
          message: "CEP inválido ou não encontrado.",
        });
      }
    };

    buscar();
  }, [cepTrabalhoLimpo]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const valor = watch(`families[${familyIndex}].telefoneCelularIntegrante.${key}`);

      if (valor && typeof valor === 'string' && valor.trim() !== '') {
        try {
          // Remove caracteres não numéricos e limita a 11 dígitos
          const apenasNumeros = valor.replace(/\D/g, '');

          // Só formata se tiver pelo menos 3 dígitos (DDD + 1 número)
          if (apenasNumeros.length >= 3) {
            // Limita a 11 dígitos antes de formatar
            const numerosLimitados = apenasNumeros.slice(0, 11);
            const formatted = formatarTelefoneAuto(numerosLimitados);

            if (formatted !== valor) {
              setValue(`families[${familyIndex}].telefoneCelularIntegrante.${key}`, formatted);
            }
          }
        } catch (error) {
          console.error('❌ Erro na formatação do telefone:', error);
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    watch(`families[${familyIndex}].telefoneCelularIntegrante.${key}`),
    familyIndex,
    key
  ]);

  const mostrarSubprefEdf = ufSelecionada === "SP" && cidadeSelecionada === "São Paulo";
  const mostrarSubprefEdfTrabalho = ufTrabalhoSelecionada === "SP" && cidadeTrabalhoSelecionada === "São Paulo";

  const filteredFields = integranteFields.filter((field) => {
    if (!field.name) return true;
    const nameLower = field.name.toLowerCase();

    const isSubOrDist = nameLower.includes("subprefeitura") || nameLower.includes("distrito");
    const isTrabalho = nameLower.includes("trabalho");

    if (isSubOrDist && !isTrabalho && !mostrarSubprefEdf) return false;
    if (isSubOrDist && isTrabalho && !mostrarSubprefEdfTrabalho) return false;

    return true;
  });

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
              fields: filteredFields.map((field) => {
                if (field.name?.includes(`ufI.${key}`) || field.name?.includes(`ufTrabalho.${key}`)) {
                  return { ...field, options: estadoOptions };
                }
                if (field.name?.includes(`cidadeI.${key}`)) {
                  return { ...field, options: cidadeOptions };
                }
                if (field.name?.includes(`cidadeTrabalho.${key}`)) {
                  return { ...field, options: cidadeOptionsTrabalho };
                }
                return field;
              }),
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
