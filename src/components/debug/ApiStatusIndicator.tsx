import type { FC } from "react"

interface ApiStatusIndicatorProps {
  className?: string
}

export const ApiStatusIndicator: FC<ApiStatusIndicatorProps> = ({ className = "" }) => (
  <div
    className={`rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ${className}`}
    role="status"
  >
    Dados simulados localmente
  </div>
)

export default ApiStatusIndicator
