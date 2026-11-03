import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  Building,
  CheckCircle2,
  Clock3,
  Factory,
  FileText,
  Fingerprint,
  House,
  Plus,
  Search,
  Stamp,
  TrendingUp,
} from "lucide-react"
import { Link } from "@/lib/Link"
import { demoApi } from "@/service/demo.api"
import {
  getCreatePath,
  readDemoInstrumentRecords,
  type DemoInstrumentRecord,
} from "@/lib/demo-form-records"

type DashboardInstrument = {
  id: string
  title: string
  description: string
  listPath: string
  createPath: string
  icon: typeof Stamp
  color: string
}

type InstrumentStats = {
  total: number
  completed: number
  drafts: number
  latestUpdate?: string
}

type LegacyRecord = {
  completed?: boolean
  updated_at?: string
}

type DashboardStats = Record<string, InstrumentStats>

const FAVORITES_KEY = "dashboard_favorites"

const dashboardInstruments: DashboardInstrument[] = [
  {
    id: "selagem",
    title: "Selagem",
    description: "Identificação e caracterização de unidades e espaços habitados.",
    listPath: "/lista-selagens",
    createPath: "/create-selagem",
    icon: Stamp,
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "arrolamento",
    title: "Arrolamento",
    description: "Levantamento de famílias e condições de moradia.",
    listPath: "/lista-arrolamentos",
    createPath: "/create-arrolamento",
    icon: Fingerprint,
    color: "from-violet-600 to-indigo-500",
  },
  {
    id: "residencial",
    title: "Residencial",
    description: "Dados de imóveis, moradores e infraestrutura residencial.",
    listPath: "/lista-residenciais",
    createPath: getCreatePath("residencial"),
    icon: House,
    color: "from-emerald-600 to-teal-500",
  },
  {
    id: "nao-residencial",
    title: "Não Residencial",
    description: "Imóveis, atividades econômicas e ocupações não residenciais.",
    listPath: "/lista-nao-residenciais",
    createPath: getCreatePath("nao-residencial"),
    icon: Factory,
    color: "from-orange-600 to-amber-500",
  },
  {
    id: "ocupacao-predial",
    title: "Ocupação Predial",
    description: "Edificações, ocupação, uso e condições prediais.",
    listPath: "/lista-ocupacao-predial",
    createPath: getCreatePath("ocupacao-predial"),
    icon: Building,
    color: "from-rose-600 to-pink-500",
  },
]

const emptyStats = (): InstrumentStats => ({ total: 0, completed: 0, drafts: 0 })

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every((value) => typeof value === "string")
      ? parsed
      : []
  } catch (error) {
    console.error("Não foi possível carregar os favoritos do painel:", error)
    return []
  }
}

function getStatsFromRecords(records: Array<Pick<DemoInstrumentRecord, "status" | "updatedAt">>): InstrumentStats {
  const completed = records.filter((record) => record.status === "Concluído").length
  const latestUpdate = records
    .map((record) => record.updatedAt)
    .filter((date) => !Number.isNaN(new Date(date).getTime()))
    .sort((a, b) => b.localeCompare(a))[0]

  return {
    total: records.length,
    completed,
    drafts: records.length - completed,
    latestUpdate,
  }
}

function getStatsFromLegacyRecords(records: LegacyRecord[] | undefined): InstrumentStats {
  const values = records ?? []
  const completed = values.filter((record) => record.completed === true).length
  const updatedDates = values.flatMap((record) =>
    record.updated_at && !Number.isNaN(new Date(record.updated_at).getTime())
      ? [record.updated_at]
      : [],
  )
  const latestUpdate = updatedDates.sort((a, b) => b.localeCompare(a))[0]

  return {
    total: values.length,
    completed,
    drafts: values.length - completed,
    latestUpdate,
  }
}

function formatUpdatedAt(value?: string): string {
  if (!value) return "Sem atualizações recentes"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Sem atualizações recentes"
    : `Atualizado ${date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [stats, setStats] = useState<DashboardStats>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const loadDashboard = useCallback(async () => {
    const user = localStorage.getItem("userEmail") ?? "anonymous"
    try {
      const [selagemResponse, arrolamentoResponse] = await Promise.all([
        demoApi.get<{ selagens?: LegacyRecord[] }>("/v1/selagens"),
        demoApi.get<{ arrolamentos?: LegacyRecord[] }>("/survey-resource/v1/arrolamentos"),
      ])

      const nextStats: DashboardStats = {
        selagem: getStatsFromLegacyRecords(selagemResponse.data.selagens),
        arrolamento: getStatsFromLegacyRecords(arrolamentoResponse.data.arrolamentos),
      }

      for (const instrument of ["residencial", "nao-residencial", "ocupacao-predial"] as const) {
        nextStats[instrument] = getStatsFromRecords(readDemoInstrumentRecords(instrument, user))
      }

      setStats(nextStats)
      setLoadError("")
    } catch (error) {
      console.error("Não foi possível carregar os indicadores do painel:", error)
      setLoadError("Não foi possível carregar os indicadores. Tente atualizar a página.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setFavorites(readFavorites())
    void loadDashboard()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    const handleRecordsUpdated = () => void loadDashboard()
    const handleStorage = () => {
      setFavorites(readFavorites())
      void loadDashboard()
    }

    window.addEventListener("keydown", handleKey)
    window.addEventListener("habitech-demo-records-updated", handleRecordsUpdated)
    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("keydown", handleKey)
      window.removeEventListener("habitech-demo-records-updated", handleRecordsUpdated)
      window.removeEventListener("storage", handleStorage)
    }
  }, [loadDashboard])

  const toggleFavorite = (id: string) => {
    setFavorites((previous) => {
      const next = previous.includes(id)
        ? previous.filter((favorite) => favorite !== id)
        : [...previous, id]
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      } catch (error) {
        console.error("Não foi possível salvar os favoritos do painel:", error)
      }
      return next
    })
  }

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR")
    return dashboardInstruments
      .filter((item) =>
        !normalizedQuery
        || `${item.title} ${item.description}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery),
      )
      .sort((a, b) => {
        const aFavorite = favorites.includes(a.id) ? 0 : 1
        const bFavorite = favorites.includes(b.id) ? 0 : 1
        return aFavorite - bFavorite || a.title.localeCompare(b.title, "pt-BR")
      })
  }, [favorites, query])

  const totals = dashboardInstruments.reduce(
    (result, instrument) => {
      const instrumentStats = stats[instrument.id] ?? emptyStats()
      result.total += instrumentStats.total
      result.completed += instrumentStats.completed
      result.drafts += instrumentStats.drafts
      return result
    },
    { total: 0, completed: 0, drafts: 0 },
  )
  const completionRate = totals.total ? Math.round((totals.completed / totals.total) * 100) : 0

  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-7 px-3 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-7 text-white shadow-xl shadow-blue-950/10 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border-[32px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 size-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Painel de acompanhamento</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Visão geral dos instrumentos</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Acompanhe os registros e o andamento das pesquisas em um só lugar.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur sm:min-w-28 sm:px-4">
              <p className="text-[11px] font-medium text-blue-100 sm:text-xs">Registros</p>
              <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{isLoading ? "—" : totals.total}</p>
            </div>
            <div className="min-w-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur sm:min-w-28 sm:px-4">
              <p className="text-[11px] font-medium text-blue-100 sm:text-xs">Em andamento</p>
              <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{isLoading ? "—" : totals.drafts}</p>
            </div>
            <div className="min-w-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur sm:min-w-28 sm:px-4">
              <p className="text-[11px] font-medium text-blue-100 sm:text-xs">Concluídos</p>
              <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{isLoading ? "—" : `${completionRate}%`}</p>
            </div>
          </div>
        </div>
      </section>

      <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-950">
        Projeto de estudo e portfólio. As contas e os registros de demonstração são fictícios.
      </p>

      <section aria-labelledby="instrumentos-heading">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Acesso e indicadores</p>
            <h2 id="instrumentos-heading" className="mt-1 text-xl font-bold text-slate-900">Seus instrumentos</h2>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar instrumento (pressione /)"
              aria-label="Buscar instrumentos"
              aria-controls="instrument-dashboard-grid"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-10 text-sm shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">/</span>
          </div>
        </div>

        {loadError && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
            <span>{loadError}</span>
            <button type="button" onClick={() => void loadDashboard()} className="font-semibold underline underline-offset-2">
              Tentar novamente
            </button>
          </div>
        )}

        <div id="instrument-dashboard-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && dashboardInstruments.map((instrument) => (
            <div key={instrument.id} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div className="mt-5 h-5 w-1/2 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
              <div className="mt-8 h-14 rounded-xl bg-slate-100" />
            </div>
          ))}

          {!isLoading && filteredItems.map((instrument) => {
            const Icon = instrument.icon
            const instrumentStats = stats[instrument.id] ?? emptyStats()
            const completion = instrumentStats.total
              ? Math.round((instrumentStats.completed / instrumentStats.total) * 100)
              : 0
            const isFavorite = favorites.includes(instrument.id)

            return (
              <article
                key={instrument.id}
                className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                <div className={`h-1.5 bg-gradient-to-r ${instrument.color}`} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={instrument.listPath}
                      className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${instrument.color} text-white shadow-sm`}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-base font-bold text-slate-900 group-hover:text-blue-800">{instrument.title}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Painel do instrumento</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      aria-label={isFavorite ? `Remover ${instrument.title} dos favoritos` : `Adicionar ${instrument.title} aos favoritos`}
                      aria-pressed={isFavorite}
                      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      onClick={() => toggleFavorite(instrument.id)}
                      className={`rounded-full border p-2 transition ${
                        isFavorite
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-amber-500"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-3 min-h-10 text-sm leading-relaxed text-slate-600">{instrument.description}</p>

                  <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/80 py-3">
                    <div className="px-2 text-center">
                      <p className="text-lg font-bold tabular-nums text-slate-900">{instrumentStats.total}</p>
                      <p className="text-[11px] text-slate-500">Registros</p>
                    </div>
                    <div className="px-2 text-center">
                      <p className="text-lg font-bold tabular-nums text-amber-700">{instrumentStats.drafts}</p>
                      <p className="text-[11px] text-slate-500">Em andamento</p>
                    </div>
                    <div className="px-2 text-center">
                      <p className="text-lg font-bold tabular-nums text-emerald-700">{instrumentStats.completed}</p>
                      <p className="text-[11px] text-slate-500">Concluídos</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <TrendingUp className="size-3.5" aria-hidden />
                        Taxa de conclusão
                      </span>
                      <span className="font-semibold text-slate-700">{completion}%</span>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`Conclusão de ${instrument.title}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={completion}
                    >
                      <div className={`h-full rounded-full bg-gradient-to-r ${instrument.color} transition-[width]`} style={{ width: `${completion}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    {instrumentStats.drafts > 0
                      ? <Clock3 className="size-3.5 text-amber-600" aria-hidden />
                      : <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden />}
                    <span>{instrumentStats.total === 0 ? "Aguardando primeiro cadastro" : formatUpdatedAt(instrumentStats.latestUpdate)}</span>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <Link
                      to={instrument.listPath}
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <FileText className="size-4" aria-hidden />
                      Ver registros
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                    <Link
                      to={instrument.createPath}
                      aria-label={`Novo formulário ${instrument.title}`}
                      title="Iniciar novo formulário"
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/25"
                    >
                      <Plus className="size-5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {!isLoading && filteredItems.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            Nenhum instrumento corresponde à busca.
          </p>
        )}
      </section>
    </main>
  )
}
