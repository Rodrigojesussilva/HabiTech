import { useCallback, useEffect, useMemo, useState } from "react"
import { Eye, FilePlus2, Pencil, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@/lib/router-compat"
import {
  getCreatePath,
  getEditPath,
  getViewPath,
  readDemoInstrumentRecords,
  type DemoInstrumentRecord,
  type DemoInstrumentType,
} from "@/lib/demo-form-records"

type DemoInstrumentListProps = {
  instrument: DemoInstrumentType
  title: string
}

function getNestedText(values: Record<string, unknown>, key: string): string {
  const direct = values[key]
  if (typeof direct === "string" || typeof direct === "number") return String(direct)

  const families = values.families
  if (Array.isArray(families) && families.length > 0) {
    const firstFamily = families[0]
    if (typeof firstFamily === "object" && firstFamily !== null) {
      const familyValue = (firstFamily as Record<string, unknown>)[key]
      if (typeof familyValue === "string" || typeof familyValue === "number") return String(familyValue)
    }
  }
  return ""
}

function getRecordName(record: DemoInstrumentRecord): string {
  return getNestedText(record.values, "nomeEstabelecimento")
    || getNestedText(record.values, "nomePredio")
    || getNestedText(record.values, "nomeEspacoHabitado")
    || getNestedText(record.values, "seiNumber")
    || getNestedText(record.values, "numeroSei")
    || `Registro ${record.id.slice(0, 8)}`
}

function getRecordAddress(record: DemoInstrumentRecord): string {
  const street = getNestedText(record.values, "logradouro")
  const number = getNestedText(record.values, "numero")
  const district = getNestedText(record.values, "bairro")
  return [street && `${street}${number ? `, ${number}` : ""}`, district].filter(Boolean).join(" · ") || "Endereço não informado"
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export default function DemoInstrumentList({ instrument, title }: DemoInstrumentListProps) {
  const navigate = useNavigate()
  const user = localStorage.getItem("userEmail") ?? "anonymous"
  const [records, setRecords] = useState<DemoInstrumentRecord[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  const loadRecords = useCallback(() => {
    try {
      setRecords(readDemoInstrumentRecords(instrument, user).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
      setError("")
    } catch (loadError) {
      console.error(`Não foi possível carregar a lista de ${title}:`, loadError)
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os registros deste navegador.")
    }
  }, [instrument, title, user])

  useEffect(() => {
    loadRecords()
    const handleRecordsUpdated = (event: Event) => {
      const updatedInstrument = (event as CustomEvent<DemoInstrumentType>).detail
      if (updatedInstrument === instrument) loadRecords()
    }
    window.addEventListener("habitech-demo-records-updated", handleRecordsUpdated)
    window.addEventListener("storage", loadRecords)
    return () => {
      window.removeEventListener("habitech-demo-records-updated", handleRecordsUpdated)
      window.removeEventListener("storage", loadRecords)
    }
  }, [instrument, loadRecords])

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR")
    if (!query) return records
    return records.filter((record) =>
      `${getRecordName(record)} ${getRecordAddress(record)} ${JSON.stringify(record.values)} ${record.status}`
        .toLocaleLowerCase("pt-BR")
        .includes(query),
    )
  }, [records, search])

  const createPath = getCreatePath(instrument)

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 px-3 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Formulários cadastrados</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">Registros demonstrativos armazenados neste navegador.</p>
        </div>
        <Button onClick={() => navigate(createPath)} className="w-full gap-2 sm:w-auto">
          <FilePlus2 className="size-4" aria-hidden />
          Novo formulário
        </Button>
      </header>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          type="search"
          placeholder="Buscar por identificação, endereço ou situação"
          aria-label={`Buscar ${title.toLowerCase()}`}
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <p>{error}</p>
          <Button variant="outline" className="mt-3" onClick={loadRecords}>Tentar novamente</Button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <h2 className="font-semibold text-slate-900">{search ? "Nenhum registro encontrado" : "Nenhum formulário cadastrado"}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {search ? "Tente outro termo de busca." : "Os formulários aparecem aqui após o primeiro salvamento automático."}
          </p>
          {!search && (
            <Button className="mt-4 gap-2" onClick={() => navigate(createPath)}>
              <FilePlus2 className="size-4" aria-hidden />
              Iniciar formulário
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500" aria-live="polite">
            {filteredRecords.length} {filteredRecords.length === 1 ? "registro" : "registros"}
          </p>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">Identificação</th>
                    <th scope="col" className="px-5 py-3">Endereço</th>
                    <th scope="col" className="px-5 py-3">Situação</th>
                    <th scope="col" className="px-5 py-3">Última atualização</th>
                    <th scope="col" className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-900">{getRecordName(record)}</td>
                      <td className="px-5 py-4 text-slate-600">{getRecordAddress(record)}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${record.status === "Concluído" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{formatUpdatedAt(record.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {instrument === "residencial" && record.status === "Rascunho" ? (
                            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(getCreatePath(instrument))}>
                              <Pencil className="size-4" aria-hidden /> Continuar
                            </Button>
                          ) : instrument !== "residencial" ? (
                            <>
                              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(getViewPath(instrument, record.id))}>
                                <Eye className="size-4" aria-hidden /> Ver
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(getEditPath(instrument, record.id))}>
                                <Pencil className="size-4" aria-hidden /> Editar
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="space-y-3 md:hidden">
            {filteredRecords.map((record) => (
              <li key={record.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words font-semibold text-slate-900">{getRecordName(record)}</h2>
                    <p className="mt-1 break-words text-sm text-slate-600">{getRecordAddress(record)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${record.status === "Concluído" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                    {record.status}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">Atualizado: {formatUpdatedAt(record.updatedAt)}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {instrument === "residencial" && record.status === "Rascunho" ? (
                    <Button variant="outline" className="col-span-2 gap-1.5" onClick={() => navigate(getCreatePath(instrument))}>
                      <Pencil className="size-4" aria-hidden /> Continuar preenchimento
                    </Button>
                  ) : instrument !== "residencial" ? (
                    <>
                      <Button variant="outline" className="gap-1.5" onClick={() => navigate(getViewPath(instrument, record.id))}>
                        <Eye className="size-4" aria-hidden /> Visualizar
                      </Button>
                      <Button variant="outline" className="gap-1.5" onClick={() => navigate(getEditPath(instrument, record.id))}>
                        <Pencil className="size-4" aria-hidden /> Editar
                      </Button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
