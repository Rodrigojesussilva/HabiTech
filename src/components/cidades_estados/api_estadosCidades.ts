import { estados as estadosLocais } from "@/components/cidades_estados/estados"
import { cidadesLocais } from "@/components/cidades_estados/cidade"
import { demoApi } from "@/service/demo.api"

export type OpcaoEstado = { nome: string; sigla: string }
export type OpcaoCidade = { label: string; value: string }

export async function paises(): Promise<{ nome: string; sigla: string }[]> {
  const { data } = await demoApi.get<{ nome: string; sigla: string }[]>("/lookup/countries")
  return data
}

export async function estados(): Promise<OpcaoEstado[]> {
  return estadosLocais.map(({ label, value }) => ({ nome: label, sigla: value }))
}

export async function getCidadesOptions(uf: string): Promise<OpcaoCidade[]> {
  if (!uf) return []

  return cidadesLocais[uf.toUpperCase() as keyof typeof cidadesLocais] ?? []
}
