import type { FC } from "react"

interface ApiEnvironmentSwitcherProps {
  className?: string
}

export const ApiEnvironmentSwitcher: FC<ApiEnvironmentSwitcherProps> = ({ className = "" }) => (
  <aside className={`rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 ${className}`}>
    <h3 className="font-semibold">Modo de demonstração</h3>
    <p className="mt-1 text-sm">
      As consultas e gravações usam respostas simuladas no navegador. Nenhum serviço de backend é acessado.
    </p>
  </aside>
)

export default ApiEnvironmentSwitcher
