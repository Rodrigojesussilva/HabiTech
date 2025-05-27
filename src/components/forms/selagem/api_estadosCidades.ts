// estadosCidades.ts
/**
 * Retorna lista de países via API REST Countries.
 * @returns Promise de objetos { nome, sigla }
 */
export async function paises(): Promise<{ nome: string; sigla: string }[]> {
  const response = await fetch('https://restcountries.com/v3.1/all');
  if (!response.ok) throw new Error('Erro ao buscar países na API REST Countries');

  const data = await response.json();

  return data
    .map((p: any) => ({
      nome: p.name.common,
      sigla: p.cca2 // Código ISO Alpha-2
    }))
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome));
}
/**
 * Retorna lista de estados via API IBGE.
 * @returns Promise de objetos { nome, sigla }
 */
export async function estados(): Promise<{ nome: string; sigla: string }[]> {
  const response = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  );
  if (!response.ok) throw new Error('Erro ao buscar estados na API IBGE');
  const data = await response.json();
  return data
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
    .map((e: any) => ({ nome: e.nome, sigla: e.sigla }));
}

/**
 * Retorna opções de cidades para uma UF via API IBGE.
 * @param uf Sigla do estado (ex: 'SP')
 * @returns Promise de objetos { label, value }
 */
export async function getCidadesOptions(
  uf: string
): Promise<{ label: string; value: string }[]> {
  if (!uf) return [];
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  );
  if (!response.ok) throw new Error('Erro ao buscar cidades na API IBGE');
  const data = await response.json();
  return data
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
    .map((c: any) => ({ label: c.nome, value: c.nome }));
}