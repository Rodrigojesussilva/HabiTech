import React, { useState, useEffect } from 'react'
import { SURVEY_RESOURCE_URL, CURRENT_API } from '../../service/constants'
import survey_resource from '../../service/survey_resource.api'

interface ApiConnectionTesterProps {
  className?: string
}

export const ApiConnectionTester: React.FC<ApiConnectionTesterProps> = ({ className = "" }) => {
  const [currentEnvironment, setCurrentEnvironment] = useState<string>('')
  const [isLocalhost, setIsLocalhost] = useState<boolean>(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Detectar ambiente atual
    const hostname = window.location.hostname
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
    const forceProduction = localStorage.getItem('FORCE_PRODUCTION')
    
    setIsLocalhost(isLocal)
    setCurrentEnvironment(isLocal && !forceProduction ? 'LOCAL' : 'PRODUCTION')
  }, [])

  const testSelagemCreation = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      console.log("🧪 === TESTE DE CRIAÇÃO DE SELAGEM ===")
      console.log("🌐 Hostname atual:", window.location.hostname)
      console.log("🏠 É localhost?", isLocalhost)
      console.log("🔧 Ambiente detectado:", currentEnvironment)
      console.log("📍 URL Survey Resource:", SURVEY_RESOURCE_URL)
      console.log("🎯 API Config atual:", CURRENT_API)
      console.log("💾 Force Production?", localStorage.getItem('FORCE_PRODUCTION'))

      // Dados de teste (estrutura validada com a API)
      const testData = {
        created_by: "API-CONNECTION-TEST",
        main_metadata: {
          numero_sei: `TEST-${Date.now()}`,
          numero_selo: "SELO-TEST",
          quantidade_familias: 1,
        }
      }

      console.log("📤 Dados que serão enviados:", testData)

      // Fazer a chamada diretamente
      console.log("🎯 URL que será usada:", SURVEY_RESOURCE_URL)
      console.log("📦 Dados que serão enviados:", testData)
      
      const result = await survey_resource.CreateSelagem(SURVEY_RESOURCE_URL, testData)

      console.log("✅ Resposta da API:", result)

      setTestResult({
        success: true,
        urlUsed: SURVEY_RESOURCE_URL,
        response: result,
        environment: currentEnvironment,
        isLocalhost: isLocalhost,
        testData: testData
      })

    } catch (error) {
      console.error("❌ Erro no teste de criação:", error)
      
      // Tentar extrair informação útil do erro
      let errorInfo = error
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        errorInfo = {
          ...error,
          possibleCause: 'Backend não está respondendo ou problema de CORS',
          suggestion: 'Verifique se os containers Docker estão rodando'
        }
      }
      
      setTestResult({
        success: false,
        error: errorInfo,
        environment: currentEnvironment,
        isLocalhost: isLocalhost,
        urlUsed: SURVEY_RESOURCE_URL
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectConnection = async () => {
    setIsLoading(true)
    
    try {
      console.log("🔗 Testando conexão direta...")
      
      // Testar conexão direta
      const testUrls = [
        'http://localhost:7076',
        'http://localhost:7076/health',
        'http://localhost:7076/v1/selagens'
      ]

      const results = []

      for (const url of testUrls) {
        try {
          console.log(`🌐 Testando: ${url}`)
          const response = await fetch(url, { 
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          results.push({
            url,
            status: response.status,
            statusText: response.statusText,
            success: response.ok
          })
          
          console.log(`✅ ${url} → ${response.status} ${response.statusText}`)
        } catch (error) {
          results.push({
            url,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            success: false
          })
          console.log(`❌ ${url} → ERRO:`, error)
        }
      }

      setTestResult({
        type: 'connection',
        results,
        currentConfig: {
          hostname: window.location.hostname,
          isLocalhost,
          environment: currentEnvironment,
          surveyResourceUrl: SURVEY_RESOURCE_URL,
          currentApi: CURRENT_API
        }
      })

    } catch (error) {
      console.error("❌ Erro no teste de conexão:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  if (!isLocalDevelopment) {
    return null // Don't show in production
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🔍 Teste de Conexão API - Selagem
      </h3>
      
      {/* Current Status */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">📊 Status Atual:</h4>
        <div className="text-sm space-y-1">
          <div><strong>Hostname:</strong> <code>{window.location.hostname}</code></div>
          <div><strong>É Localhost:</strong> <span className={`px-2 py-1 rounded text-xs ${isLocalhost ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isLocalhost ? 'SIM' : 'NÃO'}
          </span></div>
          <div><strong>Ambiente:</strong> <span className={`px-2 py-1 rounded text-xs ${currentEnvironment === 'LOCAL' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {currentEnvironment}
          </span></div>
          <div><strong>URL Survey Resource:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{SURVEY_RESOURCE_URL}</code></div>
          <div><strong>Force Production:</strong> <code>{localStorage.getItem('FORCE_PRODUCTION') || 'null'}</code></div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={testDirectConnection}
          disabled={isLoading}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? '⏳' : '🔗'} Testar Conexão
        </button>
        <button
          onClick={testSelagemCreation}
          disabled={isLoading}
          className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? '⏳' : '🎯'} Testar Criação Selagem
        </button>
        <button
          onClick={() => setTestResult(null)}
          className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          🗑️ Limpar
        </button>
      </div>

      {/* Results */}
      {testResult && (
        <div className="mb-3 p-3 bg-white border rounded">
          <h5 className="font-medium mb-2">
            {testResult.success ? '✅ Resultado:' : '❌ Erro:'}
          </h5>
          
          {testResult.type === 'connection' ? (
            <div>
              <h6 className="font-medium text-sm mb-2">Testes de Conectividade:</h6>
              {testResult.results.map((result: any, index: number) => (
                <div key={index} className={`text-xs p-2 rounded mb-1 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <strong>{result.url}:</strong> {result.success ? `${result.status} ${result.statusText}` : result.error}
                </div>
              ))}
              
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-gray-600">Ver configuração atual</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(testResult.currentConfig, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              {testResult.success && (
                <div className="text-sm text-green-700 mb-2">
                  <strong>URL Usada:</strong> <code className="bg-green-100 px-1 rounded">{testResult.urlUsed}</code>
                </div>
              )}
              
              <details>
                <summary className="cursor-pointer text-xs text-gray-600">Ver detalhes</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-600">
        <p><strong>💡 Como usar:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><strong>Testar Conexão:</strong> Verifica se localhost:7076 está respondendo</li>
          <li><strong>Testar Criação:</strong> Testa criação de selagem via API</li>
          <li><strong>Console:</strong> Logs detalhados mostram toda a operação</li>
        </ul>
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <strong>📋 Endpoints testados:</strong><br/>
          • Health: <code>/health</code><br/>
          • Selagens: <code>/v1/selagens</code> (path corrigido!)<br/>
          • Base URL: <code>{SURVEY_RESOURCE_URL}</code>
        </div>
      </div>
    </div>
  )
}

export default ApiConnectionTester 