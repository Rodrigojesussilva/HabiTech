import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/residencial/definitions/animalEstimacao.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"; // ou os ícones que preferir

interface AnimalEstimacaoFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const AnimalEstimacaoForm = ({ sectionIndex: sectionNumber, familyIndex }: AnimalEstimacaoFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    // Estado para controlar qual animal está expandido
    const [animaisExpandidos, setAnimaisExpandidos] = useState<number[]>([]);
    const form = useFormContext();

    // 🔁 Reage a mudanças em todos os campos da família
    const formValues = form.watch(`families[${familyIndex}]`) || {};
    const formSections = getMergedFormSections(formValues);
    const section = formSections[0]; // único grupo "Animal de Estimação"

    // ✅ Função para agrupar campos por animal
    const getCamposPorAnimal = () => {
        const campos = section.fields || [];
        const animais = [];

        // Animal 1 - sempre existe se possuiAnimalEstimacao === "sim"
        if (formValues.possuiAnimalEstimacao === "sim") {
            const camposAnimal1 = campos.filter(f =>
                f.name.includes('1') &&
                !f.name.includes('ativarAnimal')
            );
            if (camposAnimal1.length > 0) {
                animais.push({
                    numero: 1,
                    nome: formValues.nomeAnimal1 || "Animal 1",
                    campos: camposAnimal1,
                    temEspecifique: formValues.tipoAnimal1 === "outros"
                });
            }
        }

        // Animal 2 - se ativado
        if (formValues.ativarAnimal2 === true) {
            const camposAnimal2 = campos.filter(f =>
                f.name.includes('2') &&
                !f.name.includes('ativarAnimal')
            );
            if (camposAnimal2.length > 0) {
                animais.push({
                    numero: 2,
                    nome: formValues.nomeAnimal2 || "Animal 2",
                    campos: camposAnimal2,
                    temEspecifique: formValues.tipoAnimal2 === "outros"
                });
            }
        }

        // Animal 3 - se ativado
        if (formValues.ativarAnimal3 === true) {
            const camposAnimal3 = campos.filter(f =>
                f.name.includes('3') &&
                !f.name.includes('ativarAnimal')
            );
            if (camposAnimal3.length > 0) {
                animais.push({
                    numero: 3,
                    nome: formValues.nomeAnimal3 || "Animal 3",
                    campos: camposAnimal3,
                    temEspecifique: formValues.tipoAnimal3 === "outros"
                });
            }
        }

        return animais;
    };

    // ✅ Função para obter checkboxes de adicionar animais
    const getCheckboxesAnimais = () => {
        return section.fields.filter(f =>
            f.name === "ativarAnimal2" ||
            f.name === "ativarAnimal3"
        );
    };

    const animais = getCamposPorAnimal();
    const checkboxesAnimais = getCheckboxesAnimais();

    // ✅ Funções para controlar o estado dos accordions
    const toggleAnimal = (numeroAnimal: number) => {
        setAnimaisExpandidos(prev =>
            prev.includes(numeroAnimal)
                ? prev.filter(n => n !== numeroAnimal)
                : [...prev, numeroAnimal]
        );
    };

    const isAnimalExpandido = (numeroAnimal: number) => {
        return animaisExpandidos.includes(numeroAnimal);
    };

    // ✅ Ícones para cada tipo de animal
    const getAnimalIcon = (tipoAnimal: string) => {
        const icons: Record<string, string> = {
            cachorro: "🐕",
            gato: "🐈",
            passaro: "🐦",
            peixe: "🐠",
            tartaruga: "🐢",
            coelho: "🐇",
            porquinho_da_india: "🐹",
            hamster: "🐹",
            camundongo: "🐭",
            cobra: "🐍",
            ra: "🐸",
            galinha: "🐔",
            cabra: "🐐",
            bode: "🐐",
            porco: "🐖",
            boi: "🐄",
            vaca: "🐄",
            cavalo: "🐎",
            outros: "🐾",
            select: "❓"
        };
        return icons[tipoAnimal] || "🐾";
    };

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    {/* ✅ CABEÇALHO REDUZIDO - FONTE MENOR, ALTURA MENOR, CINZA CLARO */}
                    <div className="section-header cursor-pointer bg-gray-100 p-2 mb-2 rounded-xl">
                        <h4 className="text-xl font-semibold mb-1" data-secao={section.title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${section.title}`}
                        </h4>
                        {/* ✅ CONTADOR DE ANIMAIS COM FONTE MENOR */}
                        <p className="text-gray-600 text-xs">
                            {formValues.possuiAnimalEstimacao === "sim"
                                ? `${animais.length} animal(is) cadastrado(s)`
                                : "Clique para expandir"}
                        </p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6">
                    {/* ✅ Campo principal - Possui Animal? */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <FormSectionRenderer
                            section={{
                                id: section.id,
                                title: "Informações Gerais",
                                fields: section.fields.filter(f => f.name === "possuiAnimalEstimacao"),
                            }}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                            sectionIndex={0}
                            formValues={formValues}
                            showSectionLabel={false}
                            familyIndex={familyIndex}
                        />
                    </div>

                    {/* ✅ Quadros modernos para cada animal COMO ACCORDIONS */}
                    {animais.map((animal, index) => (
                        <Collapsible
                            key={`animal-${animal.numero}`}
                            open={isAnimalExpandido(animal.numero)}
                            onOpenChange={() => toggleAnimal(animal.numero)}
                            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Header do quadro do animal - AGORA É CLICÁVEL */}
                            <CollapsibleTrigger asChild>
                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="text-xl">
                                                {getAnimalIcon(
                                                    formValues[`tipoAnimal${animal.numero}` as keyof typeof formValues] as string || "select"
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-base text-gray-900">
                                                    {animal.nome || `Animal ${animal.numero}`}
                                                </h3>
                                                <p className="text-gray-700 text-xs">
                                                    {formValues[`tipoAnimal${animal.numero}`] && formValues[`tipoAnimal${animal.numero}`] !== "select"
                                                        ? `Tipo: ${formValues[`tipoAnimal${animal.numero}`]}`
                                                        : "Complete as informações"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-300 rounded-full px-2 py-1">
                                                <span className="text-gray-800 font-semibold text-xs">
                                                    #{animal.numero}
                                                </span>
                                            </div>
                                            {/* Ícone de expandir/recolher */}
                                            {isAnimalExpandido(animal.numero) ? (
                                                <ChevronUpIcon className="h-4 w-4 text-gray-600" />
                                            ) : (
                                                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            
                            {/* Campos do animal - AGORA DENTRO DO COLLAPSIBLE CONTENT */}
                            <CollapsibleContent className="p-4 space-y-4">
                                <FormSectionRenderer
                                    section={{
                                        id: `animal-${animal.numero}`,
                                        title: "",
                                        fields: animal.campos,
                                    }}
                                    formControl={form.control}
                                    getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${index + 1}.${fieldIndex + 1}`}
                                    sectionIndex={0}
                                    formValues={formValues}
                                    showSectionLabel={false}
                                    familyIndex={familyIndex}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    ))}

                    {/* ✅ Mensagem quando não há animais mas selecionou "Sim" */}
                    {formValues.possuiAnimalEstimacao === "sim" && animais.length === 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border-2 border-blue-200 p-6 text-center">
                            <div className="text-3xl mb-3">🐾</div>
                            <h5 className="text-base font-semibold text-blue-800 mb-2">
                                Nenhum animal cadastrado
                            </h5>
                            <p className="text-blue-600 mb-3 text-sm">
                                Preencha os campos do primeiro animal para começar
                            </p>

                            {/* ✅ Checkbox para segundo animal mesmo sem animais cadastrados */}
                            {checkboxesAnimais.length > 0 && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200 max-w-md mx-auto">
                                    <FormSectionRenderer
                                        section={{
                                            id: "checkboxes-iniciais",
                                            title: "",
                                            fields: checkboxesAnimais.filter(f => f.name === "ativarAnimal2"),
                                        }}
                                        formControl={form.control}
                                        getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.I${fieldIndex + 1}`}
                                        sectionIndex={0}
                                        formValues={formValues}
                                        showSectionLabel={false}
                                        familyIndex={familyIndex}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ Checkboxes para adicionar mais animais */}
                    {formValues.possuiAnimalEstimacao === "sim" && checkboxesAnimais.length > 0 && (
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <span>➕</span>
                                Adicionar mais animais
                            </h5>
                            <div className="space-y-2">
                                <FormSectionRenderer
                                    section={{
                                        id: "checkboxes-animais",
                                        title: "",
                                        fields: checkboxesAnimais,
                                    }}
                                    formControl={form.control}
                                    getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.C${fieldIndex + 1}`}
                                    sectionIndex={0}
                                    formValues={formValues}
                                    showSectionLabel={false}
                                    familyIndex={familyIndex}
                                />

                                {/* Mensagem informativa mais discreta */}
                                <div className="bg-gray-100 rounded-lg p-2 border border-gray-300">
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                        <span>💡</span>
                                        Marque para adicionar mais animais
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default AnimalEstimacaoForm;