// estadosCidades.ts

// Função auxiliar para aplicar timeout em fetch
async function fetchWithTimeout(url: string, timeout = 2000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Retorna lista de países via API REST Countries.
 */
export async function paises(): Promise<{ nome: string; sigla: string }[]> {
  const response = await fetchWithTimeout('https://restcountries.com/v3.1/all');
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
 */
export async function estados(): Promise<{ nome: string; sigla: string }[]> {
  const response = await fetchWithTimeout(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  );
  const data = await response.json();

  return data
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
    .map((e: any) => ({ nome: e.nome, sigla: e.sigla }));
}

/**
 * Retorna opções de cidades para uma UF via API IBGE.
 * @param uf Sigla do estado (ex: 'SP')
 */
export async function getCidadesOptions(
  uf: string
): Promise<{ label: string; value: string }[]> {
  if (!uf) return [];

  const response = await fetchWithTimeout(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  );
  const data = await response.json();

  return data
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
    .map((c: any) => ({ label: c.nome, value: c.nome }));
}
