import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/selagem/definitions/identEspacoHabitado.definition";

// Import your FormSectionRenderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { formatarNumeroComTresDecimais, formatarNumeroComQuatroDecimais, formatarNumeroComDoisDecimais } from "@/components/forms/selagem/helpers/identEspacoHabitado.helper";

interface IdentRespFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const IdentEspacoHabitadoForm = ({ sectionIndex: sectionNumber, familyIndex }: IdentRespFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(true);
const { watch, setValue } = useFormContext();
    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    const formSections = getMergedFormSections(formValues);

    const seloSetor = watch(`families[${familyIndex}].identificacaoSeloSetor`);
    const seloLote = watch(`families[${familyIndex}].identificacaoSeloLote`);
    const seloUnidade = watch(`families[${familyIndex}].identificacaoSeloUnidade`);
    const seloComplemento = watch(`families[${familyIndex}].identificacaoSeloComplemento`);
    const numeroSelo = watch(`families[${familyIndex}].numeroSelo`);

    useEffect(() => {
        // Se todos os campos forem undefined, não faz nada
        if (
            seloSetor === undefined &&
            seloLote === undefined &&
            seloUnidade === undefined &&
            seloComplemento === undefined
        ) {
            return;
        }

        // Formatação dos números, removendo qualquer caractere não numérico
        const setorNumeros = String(seloSetor || "").replace(/[^\d]/g, "").padStart(3, "0").slice(0, 3);
        const loteNumeros = String(seloLote || "").replace(/[^\d]/g, "").padStart(4, "0").slice(0, 4);
        const unidadeNumeros = String(seloUnidade || "").replace(/[^\d]/g, "").padStart(2, "0").slice(0, 2);

        // A parte fixa do número do selo
        let numeroSeloFormatado = `${setorNumeros}/${loteNumeros}${unidadeNumeros}-`;

        // Se o complemento for fornecido, inclui no número do selo
        const complemento = seloComplemento || "";
        numeroSeloFormatado += complemento;

        // Atualiza o valor do número do selo, se ele tiver mudado
        if (numeroSelo !== numeroSeloFormatado) {
            setValue(`families[${familyIndex}].numeroSelo`, numeroSeloFormatado, { shouldDirty: true });
        }

    }, [seloSetor, seloLote, seloUnidade, seloComplemento, numeroSelo, familyIndex, setValue]);
   
    useEffect(() => {
        if (seloSetor === undefined || seloSetor === null) return;
    
        const formatado = formatarNumeroComTresDecimais(seloSetor);
    
        // Só atualiza se for diferente para evitar loop
        if (seloSetor !== formatado) {
            setValue(`families[${familyIndex}].identificacaoSeloSetor`, formatado, { shouldDirty: true });
        }
    }, [seloSetor, familyIndex, setValue]);

    useEffect(() => {
        if (seloLote === undefined || seloLote === null) return;
    
        const formatado = formatarNumeroComQuatroDecimais(seloLote);
    
        // Só atualiza se for diferente para evitar loop
        if (seloLote !== formatado) {
            setValue(`families[${familyIndex}].identificacaoSeloLote`, formatado, { shouldDirty: true });
        }
    }, [seloLote, familyIndex, setValue]);

    useEffect(() => {
        if (seloUnidade === undefined || seloUnidade === null) return;
    
        const formatado = formatarNumeroComDoisDecimais(seloUnidade);
    
        // Só atualiza se for diferente para evitar loop
        if (seloUnidade !== formatado) {
            setValue(`families[${familyIndex}].identificacaoSeloUnidade`, formatado, { shouldDirty: true });
        }
    }, [seloUnidade, familyIndex, setValue]);

   
    return (
        <div className="text-left">


            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formSections.map((section, sectionIndex) => (
                        <FormSectionRenderer
                            key={section.id}
                            section={section}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                            sectionIndex={sectionIndex}
                            formValues={formValues}
                            showSectionLabel={false}
                            familyIndex={familyIndex}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default IdentEspacoHabitadoForm; 