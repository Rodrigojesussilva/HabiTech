import { useState, useRef, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/residencial/definitions/rendaResponsaveis.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

// Função para transformar texto em chave (slug) - mesma usada no schema
function slugify(nome: string) {
    return nome.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

interface RendaResponsaveisFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const RendaResponsaveisForm = ({ sectionIndex: sectionNumber, familyIndex }: RendaResponsaveisFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [integrantesOptions, setIntegrantesOptions] = useState<Array<{label: string, value: string}>>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const form = useFormContext();
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Buscar todos os campos relevantes
    const status = form.watch(`families[${familyIndex}].status`);
    const justificativa = form.watch(`families[${familyIndex}].justificativa`);
    const nomeSupervisor = form.watch(`families[${familyIndex}].nomeSupervisor`);
    const observacao = form.watch(`families[${familyIndex}].observacao`);
    const nomeCompletoRespR = form.watch(`families[${familyIndex}].nomeCompletoRespR`);
    
    // Buscar TODOS os campos relevantes
    const integrantesFamilia = form.watch(`families[${familyIndex}].integrantesFamilia`) || [];
    const nomeIntegrante = form.watch(`families[${familyIndex}].nomeIntegrante`) || {};
    const nomeSocialIntegrante = form.watch(`families[${familyIndex}].nomeSocialIntegrante`) || {};
    const dataNascimentoIntegrante = form.watch(`families[${familyIndex}].dataNascimentoIntegrante`) || {};
    const idadeIntegrante = form.watch(`families[${familyIndex}].idadeIntegrante`) || {};
    const relacaoResponsavel = form.watch(`families[${familyIndex}].relacaoResponsavel`) || {};
    const outraRelacaoResponsavel = form.watch(`families[${familyIndex}].outraRelacaoResponsavel`) || {};

    // useEffect para carregar opções baseadas nos campos do formulário
    useEffect(() => {
        const loadIntegrantesOptions = () => {
            console.log("Carregando opções de integrantes...");
            
            let opcoesFinais: Array<{label: string, value: string}> = [];

            // ADICIONAR O RESPONSÁVEL PRINCIPAL
            if (nomeCompletoRespR && typeof nomeCompletoRespR === 'string' && nomeCompletoRespR.trim() !== '') {
                opcoesFinais.push({
                    label: `Responsável: ${nomeCompletoRespR}`,
                    value: `responsavel_${slugify(nomeCompletoRespR)}`
                });
            }

            // ADICIONAR OS INTEGRANTES DO ARRAY integrantesFamilia
            if (Array.isArray(integrantesFamilia) && integrantesFamilia.length > 0) {
                integrantesFamilia.forEach((integrante) => {
                    if (integrante && typeof integrante === 'string' && integrante.trim() !== '') {
                        // Para cada integrante no array, buscar o nome real no objeto nomeIntegrante
                        // A chave no objeto nomeIntegrante é o slug do nome do integrante
                        const key = slugify(integrante);
                        const nomeReal = nomeIntegrante[key];
                        
                        if (nomeReal && typeof nomeReal === 'string' && nomeReal.trim() !== '') {
                            // Buscar informações adicionais deste integrante
                            const nomeSocial = nomeSocialIntegrante[key] || '';                   
                            const idade = idadeIntegrante[key] || '';
                            const relacao = relacaoResponsavel[key] || '';
                            
                            let label = nomeReal;
                            
                            // Adicionar informações extras se disponíveis
                            const infoExtras = [];
                            if (nomeSocial) infoExtras.push(`Nome social: ${nomeSocial}`);
                            if (idade) infoExtras.push(`Idade: ${idade}`);
                            if (relacao) infoExtras.push(`Parentesco: ${relacao}`);
                            
                            if (infoExtras.length > 0) {
                                label += ` (${infoExtras.join(', ')})`;
                            }
                            
                            opcoesFinais.push({
                                label: label,
                                value: `integrante_${key}`
                            });
                        } else {
                            // Se não encontrou nome real, usar o que está no array
                            opcoesFinais.push({
                                label: integrante,
                                value: `integrante_${slugify(integrante)}`
                            });
                        }
                    }
                });
            }

            // ADICIONAR INTEGRANTES DO OBJETO nomeIntegrante QUE NÃO ESTÃO NO ARRAY
            if (nomeIntegrante && typeof nomeIntegrante === 'object') {
                Object.entries(nomeIntegrante).forEach(([key, nome]) => {
                    // Verificar se este integrante já foi adicionado pelo array
                    const jaExiste = opcoesFinais.some(opcao => 
                        opcao.value === `integrante_${key}`
                    );
                    
                    if (!jaExiste && nome && typeof nome === 'string' && nome.trim() !== '') {
                        const nomeSocial = nomeSocialIntegrante[key] || '';                   
                        const idade = idadeIntegrante[key] || '';
                        const relacao = relacaoResponsavel[key] || '';
                        
                        let label = nome;
                        
                        const infoExtras = [];
                        if (nomeSocial) infoExtras.push(`Nome social: ${nomeSocial}`);
                        if (idade) infoExtras.push(`Idade: ${idade}`);
                        if (relacao) infoExtras.push(`Parentesco: ${relacao}`);
                        
                        if (infoExtras.length > 0) {
                            label += ` (${infoExtras.join(', ')})`;
                        }
                        
                        opcoesFinais.push({
                            label: label,
                            value: `integrante_${key}`
                        });
                    }
                });
            }

            setIntegrantesOptions(opcoesFinais);
            setLoadingOptions(false);
            
            console.log("Opções carregadas:", opcoesFinais);
            console.log("Detalhes dos campos:", {
                integrantesFamilia,
                nomeIntegrante,
                nomeSocialIntegrante,
                nomeCompletoRespR
            });
        };

        const timer = setTimeout(loadIntegrantesOptions, 300);
        
        return () => clearTimeout(timer);
    }, [
        nomeCompletoRespR,
        integrantesFamilia,
        nomeIntegrante,
        nomeSocialIntegrante,
        dataNascimentoIntegrante,
        idadeIntegrante,
        relacaoResponsavel,
        status
    ]);

    // Modifica as formSections para incluir as opções carregadas
    const formSections = useMemo(() => {
        const sections = getMergedFormSections(formValues);
        
        if (integrantesOptions.length > 0) {
            return sections.map(section => ({
                ...section,
                fields: section.fields.map(field => {
                    // Atualizar o multicombobox com as opções dinâmicas
                    if (field.name === "integrantesFamilia") {
                        return { 
                            ...field, 
                            options: integrantesOptions,
                            loading: loadingOptions,
                            placeholder: nomeCompletoRespR 
                                ? `Selecionar integrantes (${integrantesOptions.length} disponíveis)`
                                : "Selecionar integrantes da família"
                        };
                    }
                    
                    return field;
                })
            }));
        }
        
        return sections;
    }, [
        formValues, 
        integrantesOptions, 
        loadingOptions,
        nomeCompletoRespR
    ]);

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>
                            {`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}
                            {loadingOptions && " (Carregando...)"}
                        </h4>
                        {/* Exibir contagem de opções disponíveis */}
                        {!loadingOptions && (
                            <div className="text-sm text-gray-600">
                                {integrantesOptions.length} integrantes disponíveis
                            </div>
                        )}
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
                            formValues={{
                                ...formValues,
                                // Garantir que todos os campos watchados estão disponíveis
                                status,
                                justificativa,
                                nomeSupervisor,
                                observacao,
                                nomeCompletoRespR,
                                integrantesFamilia,
                                nomeIntegrante,
                                nomeSocialIntegrante,
                                dataNascimentoIntegrante,
                                idadeIntegrante,
                                relacaoResponsavel,
                                outraRelacaoResponsavel
                            }}
                            showSectionLabel={false}
                            familyIndex={familyIndex}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default RendaResponsaveisForm;