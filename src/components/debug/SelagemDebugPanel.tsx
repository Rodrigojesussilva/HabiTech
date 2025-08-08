import React, { useState } from 'react'
import { SURVEY_RESOURCE_URL, CURRENT_API } from '../../service/constants'
import survey_resource from '../../service/survey_resource.api'

interface SelagemDebugPanelProps {
  className?: string
}

export const SelagemDebugPanel: React.FC<SelagemDebugPanelProps> = ({ className = "" }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState<any>(null)
  const [lastError, setLastError] = useState<any>(null)

  const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const testApiConnection = async () => {
    setIsLoading(true)
    setLastError(null)
    setLastResponse(null)

    try {
      console.log("🧪 Testando conexão com a API...")
      
      // Test basic connectivity
      const healthUrl = `${SURVEY_RESOURCE_URL}/health`
      console.log(`🔗 Testando URL: ${healthUrl}`)
      
      const response = await fetch(healthUrl)
      const result = {
        status: response.status,
        statusText: response.statusText,
        url: healthUrl,
        headers: Object.fromEntries(response.headers.entries())
      }

      if (response.ok) {
        const data = await response.text()
        setLastResponse({ ...result, data })
        console.log("✅ API respondendo:", result)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("❌ Erro na conexão:", error)
      setLastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateSelagem = async () => {
    setIsLoading(true)
    setLastError(null)
    setLastResponse(null)

    try {
      console.log("🧪 Testando criação de selagem...")
      
      const testData = {
        created_by: "DEBUG-TEST",
        main_metadata: {
          numero_sei: `TEST-${Date.now()}`, // Unique SEI number
          numero_selo: "SELO-DBG",
          quantidade_familias: 1,
        }
      }

      console.log("📤 Dados de teste:", testData)
              console.log("🌐 URL da API:", SURVEY_RESOURCE_URL)

      const result = await survey_resource.CreateSelagem(SURVEY_RESOURCE_URL, testData)
      
      setLastResponse(result)
      console.log("✅ Selagem criada com sucesso:", result)
    } catch (error) {
      console.error("❌ Erro ao criar selagem:", error)
      setLastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setLastResponse(null)
    setLastError(null)
  }

  if (!isLocalDevelopment) {
    return null // Don't show in production
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🧪 Debug Panel - Selagem
      </h3>
      
      {/* Current Configuration */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">📊 Configuração Atual:</h4>
        <div className="text-sm space-y-1">
          <div><strong>Survey Resource URL:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{SURVEY_RESOURCE_URL}</code></div>
          <div><strong>Environment:</strong> <span className={`px-2 py-1 rounded text-xs ${
            CURRENT_API === CURRENT_API ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {SURVEY_RESOURCE_URL.includes('localhost') ? 'LOCAL' : 'PRODUCTION'}
          </span></div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={testApiConnection}
          disabled={isLoading}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? '⏳' : '🔗'} Testar Conexão
        </button>
        <button
          onClick={testCreateSelagem}
          disabled={isLoading}
          className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? '⏳' : '➕'} Testar Criação
        </button>
        <button
          onClick={clearResults}
          className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          🗑️ Limpar
        </button>
      </div>

      {/* Results */}
      {lastResponse && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
          <h5 className="font-medium text-green-800 mb-2">✅ Último Sucesso:</h5>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        </div>
      )}

      {lastError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded">
          <h5 className="font-medium text-red-800 mb-2">❌ Último Erro:</h5>
          <div className="text-sm text-red-700 mb-2">
            <strong>Mensagem:</strong> {lastError?.message || 'Erro desconhecido'}
          </div>
          
          {/* Interpretar tipos comuns de erro */}
          {lastError?.message?.includes('Failed to fetch') && (
            <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
              <strong>💡 Possível causa:</strong> Backend não está respondendo ou problema de CORS<br/>
              <strong>🔧 Solução:</strong> Verifique se os containers Docker estão rodando
            </div>
          )}
          
          {lastError?.message?.includes('400') && (
            <div className="text-sm bg-blue-50 border border-blue-200 rounded p-2 mb-2">
              <strong>💡 Status 400:</strong> Erro de validação - dados enviados estão incorretos<br/>
              <strong>✅ Progresso:</strong> API está funcionando, apenas precisa ajustar os dados
            </div>
          )}
          
          <details>
            <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
              Ver detalhes técnicos
            </summary>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40 mt-2">
              {JSON.stringify(lastError, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-600">
        <p><strong>💡 Como usar:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><strong>Testar Conexão:</strong> Verifica se a API está respondendo</li>
          <li><strong>Testar Criação:</strong> Cria uma selagem de teste</li>
          <li><strong>Console:</strong> Veja logs detalhados no console do navegador</li>
        </ul>
        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs border border-yellow-200">
          <strong>🔧 Path atualizado:</strong> Agora usa <code>/v1/selagens</code> em vez de <code>/survey-resource/v1/selagens</code><br/>
          <strong>🎯 URL completa:</strong> <code>{SURVEY_RESOURCE_URL}/v1/selagens</code>
        </div>
      </div>
    </div>
  )
}

export default SelagemDebugPanel 