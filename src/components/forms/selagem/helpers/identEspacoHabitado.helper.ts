


export function formatarNumeroComTresDecimais(value: string | number): string {
    if (value === undefined || value === null || value === "") return "";

    // Remove tudo que não for número
    const cleaned = String(value).replace(/[^\d]/g, "");

    // Limita a 3 dígitos
    return cleaned.slice(0, 3);
}
export function formatarNumeroComDoisDecimais(value: string | number): string {
    if (value === undefined || value === null || value === "") return "";

    // Remove tudo que não for número
    const cleaned = String(value).replace(/[^\d]/g, "");

    // Limita a 3 dígitos
    return cleaned.slice(0, 2);
}

export function formatarNumeroComQuatroDecimais(value: string | number): string {
    if (value === undefined || value === null || value === "") return "";

    // Remove tudo que não for número
    const cleaned = String(value).replace(/[^\d]/g, "");

    // Limita a 3 dígitos
    return cleaned.slice(0, 4);
}

export function formatarAlfaNumericoComDoisCaracteres(value: string | number): string {
    if (value === undefined || value === null || value === "") return "";

    // Permite letras (com acentos) e dígitos; remove outros
    const cleaned = String(value).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\d]/g, "");

    // Limita a 2 caracteres
    return cleaned.slice(0, 2);
}







