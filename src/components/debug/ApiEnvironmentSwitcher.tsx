import React from 'react'
import { switchToProduction, switchToLocal, API_CONFIG, CURRENT_API } from '../../service/constants'

interface ApiEnvironmentSwitcherProps {
  className?: string
}

export const ApiEnvironmentSwitcher: React.FC<ApiEnvironmentSwitcherProps> = ({ className = "" }) => {
  const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const forceProduction = localStorage.getItem('FORCE_PRODUCTION')
  const currentEnvironment = (isLocalDevelopment && !forceProduction) ? 'LOCAL' : 'PRODUCTION'

  const handleSwitchToLocal = () => {
    switchToLocal()
    setTimeout(() => window.location.reload(), 500)
  }

  const handleSwitchToProduction = () => {
    switchToProduction()
    setTimeout(() => window.location.reload(), 500)
  }

  if (!isLocalDevelopment) {
    return null // Don't show in production
  }

  return (
    <div className={`bg-gray-100 border border-gray-300 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🔧 API Environment Switcher
        <span className={`px-2 py-1 rounded text-sm font-bold ${
          currentEnvironment === 'LOCAL' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {currentEnvironment}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Configuration */}
        <div>
          <h4 className="font-medium mb-2">📊 Current URLs:</h4>
          <div className="text-sm space-y-1 bg-white p-2 rounded border">
            <div><strong>Survey Resource:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{CURRENT_API.SURVEY_RESOURCE}</code></div>
            <div><strong>Selagem:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{CURRENT_API.SELAGEM}</code></div>
            <div><strong>Auth:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{CURRENT_API.AUTH}</code></div>
          </div>
        </div>

        {/* Switch Buttons */}
        <div>
          <h4 className="font-medium mb-2">🔄 Switch Environment:</h4>
          <div className="space-y-2">
            <button
              onClick={handleSwitchToLocal}
              disabled={currentEnvironment === 'LOCAL'}
              className={`w-full px-3 py-2 rounded text-sm font-medium ${
                currentEnvironment === 'LOCAL'
                  ? 'bg-green-100 text-green-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              🏠 Use Local APIs (Docker)
            </button>
            <button
              onClick={handleSwitchToProduction}
              disabled={currentEnvironment === 'PRODUCTION'}
              className={`w-full px-3 py-2 rounded text-sm font-medium ${
                currentEnvironment === 'PRODUCTION'
                  ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              🌐 Use Production APIs (Cloud)
            </button>
          </div>
        </div>
      </div>

      {/* Connection Test */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>💡 Tip:</strong> 
          {currentEnvironment === 'LOCAL' 
            ? ' Make sure your Docker services are running with ./start-selagem-only.sh'
            : ' You are using production APIs - no local services needed'
          }
        </p>
      </div>

      {/* Available Endpoints */}
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
          📋 View All Available Endpoints
        </summary>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <h5 className="font-medium text-green-600">🏠 Local URLs:</h5>
            {Object.entries(API_CONFIG.LOCAL).map(([service, url]) => (
              <div key={service} className="ml-2">
                <strong>{service}:</strong> <code className="bg-gray-100 px-1 rounded">{url}</code>
              </div>
            ))}
          </div>
          <div>
            <h5 className="font-medium text-blue-600">🌐 Production URLs:</h5>
            {Object.entries(API_CONFIG.PRODUCTION).map(([service, url]) => (
              <div key={service} className="ml-2">
                <strong>{service}:</strong> <code className="bg-gray-100 px-1 rounded">{url}</code>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}

export default ApiEnvironmentSwitcher 