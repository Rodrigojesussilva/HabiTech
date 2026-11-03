import { demoApi } from "@/service/demo.api"

export async function buscarEnderecoPorCep(cep: string): Promise<{
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}> {
  const cepLimpo = cep.replace(/\D/g, "")

  if (!/^\d{8}$/.test(cepLimpo)) {
    throw new Error("CEP inválido. Formato esperado: 00000-000 ou 00000000.")
  }

  const { data } = await demoApi.get(`/lookup/cep/${cepLimpo}`)
  return data
}
