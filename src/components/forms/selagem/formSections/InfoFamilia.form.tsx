import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections,
    FormValues
} from "@/components/forms/selagem/definitions/infoFamilia.definition";
import {
    formatInteger,
    formatCurrency,
    calculateTotalImmigrants
} from "@/components/forms/selagem/helpers/infoFamilia.helper";

// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";

// Optional: Import country data if used in the component
import { countries } from "countries-list";
import Cleave from "cleave.js"; // <-- versão pura do Cleave.js
interface InfoFamiliaFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}

const InfoFamiliaForm = ({ sectionIndex: sectionNumber, familyIndex }: InfoFamiliaFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);

    // Update immigrants count when country data changes
    useEffect(() => {
        if (formValues.numerosPorPais) {
            const totalImmigrants = calculateTotalImmigrants(formValues.numerosPorPais);
            form.setValue(`families[${familyIndex}].pessoasImigrantes`, totalImmigrants);
        }
    }, [formValues.numerosPorPais, familyIndex, form]);

    // Format currency when rendaFamiliar changes
    useEffect(() => {
        if (formValues.rendaFamiliar) {
            const formattedValue = formatCurrency(formValues.rendaFamiliar);
            if (formattedValue !== formValues.rendaFamiliar) {
                form.setValue(`families[${familyIndex}].rendaFamiliar`, formattedValue);
            }
        }
    }, [formValues.rendaFamiliar, familyIndex, form]);

    useEffect(() => {
        const fieldsToFormat = [
            'criancas0a3',
            'criancas4a6',
            'criancas7a11',
            'adolescentes12a18',
            'adultos19a59',
            'idosos60',
            'pessoasComDeficiencia',
            'pessoasComDoencasCronicas',
            'gestantes',
            'pessoasImigrantes'
        ];
    
        fieldsToFormat.forEach((field) => {
            if (formValues[field]) {
                // Formata o valor de cada campo
                const formattedValue = formatInteger(formValues[field], 2);
        
                // Se o valor formatado for diferente do valor original no form, atualize
                if (formattedValue !== formValues[field]) {
                    form.setValue(`families[${familyIndex}].${field}`, formattedValue);
                }
            }
        });
    }, [
        formValues.criancas0a3,
        formValues.criancas4a6,
        formValues.criancas7a11,
        formValues.adolescentes12a18,
        formValues.adultos19a59,
        formValues.idosos60,
        formValues.pessoasComDeficiencia,
        formValues.pessoasComDoencasCronicas,
        formValues.gestantes,
        formValues.pessoasImigrantes,
        familyIndex,
        form
    ]);
    
    
   
    
    // Handle nationality selection changes
    const handleNationalityChange = (selectedOptions: string[]) => {
        setSelectedCountries(selectedOptions);
        form.setValue(`families[${familyIndex}].nacionalidadesSelecionadas`, selectedOptions);
        
        // Initialize country counts for newly selected countries
        const currentCounts = formValues.numerosPorPais || {};
        const updatedCounts = { ...currentCounts };
        
        // Add new countries with 0 count
        selectedOptions.forEach(country => {
            if (!updatedCounts[country]) {
                updatedCounts[country] = 0;
            }
        });
        
        // Remove countries that are no longer selected
        Object.keys(updatedCounts).forEach(country => {
            if (!selectedOptions.includes(country)) {
                delete updatedCounts[country];
            }
        });
        
        form.setValue(`families[${familyIndex}].numerosPorPais`, updatedCounts);
    };

    // Handle change in country-specific person count
    const handleCountryCountChange = (country: string, count: number) => {
        const currentCounts = formValues.numerosPorPais || {};
        form.setValue(`families[${familyIndex}].numerosPorPais`, {
            ...currentCounts,
            [country]: count
        });
    };

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {/* Regular form fields using FormSectionRenderer */}
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
                    
                    {/* Custom renderer for nationality selection */}
                    {/* Note: This part would need to be implemented using the UI components of your project */}
                    {/* 
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                            <label>Selecione as nacionalidades</label>
                            <select
                                multiple
                                className="w-full"
                                value={selectedCountries}
                                onChange={(e) => {
                                    const options = Array.from(e.target.selectedOptions, option => option.value);
                                    handleNationalityChange(options);
                                }}
                            >
                                {Object.values(countries).map(country => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedCountries.map(country => (
                            <div key={country}>
                                <label>{`Quantidade de pessoas do país: ${country}`}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formValues.numerosPorPais?.[country] || 0}
                                    onChange={(e) => handleCountryCountChange(country, parseInt(e.target.value) || 0)}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                    */}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default InfoFamiliaForm; 