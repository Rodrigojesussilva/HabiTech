/**
 * Retorna informações de endereço a partir de um CEP usando a API ViaCEP.
 * @param cep CEP no formato '00000-000' ou '00000000'
 * @returns Promise de objeto { cep, logradouro, complemento, bairro, localidade, uf }
 */
export async function buscarEnderecoPorCep(cep: string): Promise<{
 cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;  // mudou aqui
  uf: string;
}> {
  // Remove qualquer caractere que não seja número
  const cepLimpo = cep.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cepLimpo)) {
    throw new Error('CEP inválido. Formato esperado: 00000-000 ou 00000000.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  if (!response.ok) {
    throw new Error('Erro ao buscar CEP na API ViaCEP');
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

 return {
  cep: data.cep,
  logradouro: data.logradouro,
  complemento: data.complemento,
  bairro: data.bairro,
  cidade: data.localidade,  // renomeei para 'cidade' aqui
  uf: data.uf
};
}
