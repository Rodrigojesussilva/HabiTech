import { useState } from "react"
import { demoApi } from "@/service/demo.api"

interface ApiConnectionTesterProps {
  className?: string
}

type DemoStatus = {
  mode: string
  backendConnected: boolean
}

export function ApiConnectionTester({ className = "" }: ApiConnectionTesterProps) {
  const [status, setStatus] = useState<DemoStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkDemoApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await demoApi.get<DemoStatus>("/demo/status")
      setStatus(response.data)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao consultar a simulação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`rounded-lg border p-4 ${className}`}>
      <h3 className="font-semibold">Verificação do modo demonstrativo</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Esta verificação consulta somente a API simulada pelo MSW.
      </p>
      <button
        type="button"
        onClick={() => void checkDemoApi()}
        disabled={loading}
        className="mt-3 rounded bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Verificando..." : "Verificar"}
      </button>
      {status && (
        <p className="mt-3 text-sm" role="status">
          Modo: {status.mode}; backend conectado: {status.backendConnected ? "sim" : "não"}.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
    </section>
  )
}

export default ApiConnectionTester
