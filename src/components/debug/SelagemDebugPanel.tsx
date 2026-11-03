import ApiConnectionTester from "./ApiConnectionTester"

interface SelagemDebugPanelProps {
  className?: string
}

export function SelagemDebugPanel({ className = "" }: SelagemDebugPanelProps) {
  return <ApiConnectionTester className={className} />
}

export default SelagemDebugPanel
