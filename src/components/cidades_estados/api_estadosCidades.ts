import { demoApi } from "@/service/demo.api"

export type OpcaoEstado = { nome: string; sigla: string }
export type OpcaoCidade = { label: string; value: string }

export async function paises(): Promise<{ nome: string; sigla: string }[]> {
  const { data } = await demoApi.get<{ nome: string; sigla: string }[]>("/lookup/countries")
  return data
}

export async function estados(): Promise<OpcaoEstado[]> {
  const { data } = await demoApi.get<OpcaoEstado[]>("/lookup/states")
  return data
}

export async function getCidadesOptions(uf: string): Promise<OpcaoCidade[]> {
  if (!uf) return []

  const { data } = await demoApi.get<OpcaoCidade[]>(`/lookup/cities/${encodeURIComponent(uf)}`)
  return data
}
