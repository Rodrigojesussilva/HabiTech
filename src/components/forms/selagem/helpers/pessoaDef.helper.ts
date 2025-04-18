import { FormValues } from "../definitions/pessoaDef.definition";

/**
 * Validate the form data for the PessoaDef section
 * @param data Form data to validate
 * @returns Boolean indicating if the data is valid
 */
export function validatePessoaDefData(data: Partial<FormValues>): boolean {
    // Check if the basic required field is filled
    if (!data.temPessoaDeficienciaFam) {
        return false;
    }
    
    // If there are people with disabilities, validate related fields
    if (data.temPessoaDeficienciaFam === 'sim') {
        // Must have quantity of people with disabilities
        if (!data.qtdPessoasComDefFam || data.qtdPessoasComDefFam < 1) {
            return false;
        }
        
        // Must specify if responsible person has disabilities
        if (!data.responsavelTemDeficiencia) {
            return false;
        }
        
        // Must have at least one type of disability
        if (!data.tiposDeficiencia || data.tiposDeficiencia.length === 0) {
            return false;
        }
        
        // If responsible has disability, must specify if they have medical report
        if (data.responsavelTemDeficiencia === 'sim' && !data.responsavelPossuiLaudo) {
            return false;
        }
        
        // If "Other" disability is selected, must specify what it is
        if (data.tiposDeficiencia.some(item => JSON.parse(item).deficiencia === 'Outra') && !data.deficienciaEspecifica) {
            return false;
        }
        
        // Must specify if uses assistive technology
        if (!data.utilizaTecnologiaAssistida) {
            return false;
        }
        
        // If uses assistive technology, must select at least one
        if (data.utilizaTecnologiaAssistida === 'sim' && (!data.tecnologiasAssistivas || data.tecnologiasAssistivas.length === 0)) {
            return false;
        }
        
        // If "Other" technology is selected, must specify what it is
        if (data.tecnologiasAssistivas?.some(item => JSON.parse(item).tecnologia === 'Outro') && !data.tecnologiaEspecifica) {
            return false;
        }
    }
    
    return true;
}

/**
 * Parse and process disability items from form data
 * @param tiposDeficiencia Array of stringified disability items
 * @returns Array of parsed disability items
 */
export function parseDeficiencias(tiposDeficiencia: string[] = []): Array<any> {
    return tiposDeficiencia.map(item => JSON.parse(item));
}

/**
 * Parse and process assistive technology items from form data
 * @param tecnologiasAssistivas Array of stringified technology items
 * @returns Array of parsed technology items
 */
export function parseTecnologias(tecnologiasAssistivas: string[] = []): Array<any> {
    return tecnologiasAssistivas.map(item => JSON.parse(item));
} 